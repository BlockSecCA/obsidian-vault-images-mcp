#!/usr/bin/env node

/**
 * Obsidian Vault Images MCP Server
 * 
 * Enables Claude to view images from an Obsidian vault without manual uploads.
 * Returns images as base64-encoded MCP image content blocks.
 */

// Add error handling for imports
try {
  var { Server } = await import("@modelcontextprotocol/sdk/server/index.js");
  var { StdioServerTransport } = await import("@modelcontextprotocol/sdk/server/stdio.js");
  var {
    CallToolRequestSchema,
    ListToolsRequestSchema,
  } = await import("@modelcontextprotocol/sdk/types.js");
} catch (importError) {
  console.error("FATAL: Failed to import MCP SDK:", importError);
  console.error("Import error details:", importError.message);
  console.error("Stack:", importError.stack);
  process.exit(1);
}

import { readFile } from "fs/promises";
import { existsSync, statSync } from "fs";
import { join, extname } from "path";

console.error("[STARTUP] Obsidian Vault Images MCP Server starting...");

// Supported image formats
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

// MIME type mapping
const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp'
};

// Get vault media path from environment (injected by Claude Desktop from user config)
const VAULT_MEDIA_PATH = process.env.VAULT_MEDIA_PATH;
console.error(`[STARTUP] VAULT_MEDIA_PATH from environment: ${VAULT_MEDIA_PATH}`);

if (!VAULT_MEDIA_PATH) {
  console.error('[ERROR] VAULT_MEDIA_PATH environment variable not set');
  process.exit(1);
}

// Validate that the path exists
if (!existsSync(VAULT_MEDIA_PATH)) {
  console.error(`[ERROR] Media directory not found: ${VAULT_MEDIA_PATH}`);
  process.exit(1);
}

console.error(`[STARTUP] Media directory validated: ${VAULT_MEDIA_PATH}`);

// Create server instance
console.error("[STARTUP] Creating MCP Server instance...");
const server = new Server(
  {
    name: "obsidian-vault-images",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);
console.error("[STARTUP] Server instance created successfully");

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("[HANDLER] ListTools called");
  return {
    tools: [
      {
        name: "get_vault_image",
        description: `Retrieve an image from the Obsidian vault Media directory and return it as viewable content.

This tool reads image files from your vault's Media directory (${VAULT_MEDIA_PATH}) and returns them as base64-encoded content that Claude can view directly.

Supported formats: PNG, JPG, JPEG, GIF, WEBP

Example usage:
- "Show me the Wardley Map diagram"
- "Get the FAIR Risk Model Overview image"
- "Display the Cynefin framework image"`,
        inputSchema: {
          type: "object",
          properties: {
            filename: {
              type: "string",
              description: "Name of the image file including extension (e.g., 'Wardley Map.png', 'FAIR Risk Model Overview.png')",
            },
          },
          required: ["filename"],
        },
      },
    ],
  };
});
console.error("[STARTUP] ListTools handler registered");

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.error(`[HANDLER] CallTool called with tool: ${request.params.name}`);
  
  if (request.params.name !== "get_vault_image") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const filename = request.params.arguments?.filename;
  console.error(`[HANDLER] Fetching image: ${filename}`);
  
  if (!filename || typeof filename !== 'string') {
    throw new Error("filename parameter is required and must be a string");
  }

  // Validate file extension
  const ext = extname(filename).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    throw new Error(
      `Unsupported file extension '${ext}'. Supported formats: ${Array.from(SUPPORTED_EXTENSIONS).join(', ')}`
    );
  }

  // Construct full path
  const filePath = join(VAULT_MEDIA_PATH, filename);
  console.error(`[HANDLER] Full file path: ${filePath}`);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(VAULT_MEDIA_PATH)) {
    throw new Error("Invalid file path: directory traversal not allowed");
  }

  // Check if file exists
  if (!existsSync(filePath)) {
    throw new Error(
      `Image '${filename}' not found in Media directory. Please verify the filename and try again.`
    );
  }

  // Check if it's actually a file
  const stats = statSync(filePath);
  if (!stats.isFile()) {
    throw new Error(`'${filename}' is not a file`);
  }

  try {
    // Read and encode image
    console.error(`[HANDLER] Reading image file...`);
    const imageBuffer = await readFile(filePath);
    const base64Data = imageBuffer.toString('base64');
    console.error(`[HANDLER] Image encoded, size: ${base64Data.length} bytes`);
    
    // Get MIME type
    const mimeType = MIME_TYPES[ext] || 'image/png';
    console.error(`[HANDLER] MIME type: ${mimeType}`);

    // Return MCP image content block
    // THIS IS THE CRITICAL TEST: Will this image be visible to Claude?
    console.error(`[HANDLER] Returning image content block`);
    return {
      content: [
        {
          type: "image",
          data: base64Data,
          mimeType: mimeType,
        },
      ],
    };
  } catch (error) {
    console.error(`[ERROR] Error reading image: ${error.message}`);
    if (error.code === 'EACCES') {
      throw new Error(`Permission denied reading '${filename}'. Check file permissions.`);
    }
    throw new Error(`Error reading image file: ${error.message}`);
  }
});
console.error("[STARTUP] CallTool handler registered");

// Start the server
async function main() {
  try {
    console.error("[STARTUP] Creating stdio transport...");
    const transport = new StdioServerTransport();
    console.error("[STARTUP] Connecting server to transport...");
    await server.connect(transport);
    console.error("[STARTUP] ✓ Obsidian Vault Images MCP server running on stdio");
  } catch (error) {
    console.error("[FATAL] Error in main():", error);
    console.error("[FATAL] Error message:", error.message);
    console.error("[FATAL] Error stack:", error.stack);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[FATAL] Uncaught error in main():", error);
  console.error("[FATAL] Error message:", error.message);
  console.error("[FATAL] Error stack:", error.stack);
  process.exit(1);
});
