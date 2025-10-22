#!/usr/bin/env node

/**
 * Obsidian Vault Images MCP Server v2
 * 
 * Enables Claude to view images from Obsidian vaults without manual uploads.
 * Uses MCP Roots protocol for dynamic multi-directory support.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListRootsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile } from "fs/promises";
import { existsSync, statSync } from "fs";
import { join, extname, normalize } from "path";

console.error("[STARTUP] Obsidian Vault Images MCP Server v2 starting...");

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

// Allowed directories - can be set via command line OR Roots protocol
let allowedDirectories = [];

// Command line argument parsing - look for --roots argument
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--roots' && i + 1 < args.length) {
    // Parse comma-separated roots from argument
    const rootsArg = args[i + 1];
    allowedDirectories = rootsArg.split(',').map(dir => normalize(dir.trim()));
    console.error(`[STARTUP] Roots from args: ${allowedDirectories.join(', ')}`);
    break;
  }
}

if (allowedDirectories.length === 0) {
  console.error("[STARTUP] No roots provided, will wait for client configuration");
}

// Normalize path (handle Windows case sensitivity)
function normalizePath(p) {
  let normalized = normalize(p);
  // On Windows, ensure drive letter is uppercase
  if (process.platform === 'win32' && /^[a-z]:/.test(normalized)) {
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }
  return normalized;
}

// Validate that a path is within allowed directories
function isPathAllowed(filePath) {
  const normalized = normalizePath(filePath);
  return allowedDirectories.some(allowedDir => {
    const normalizedAllowed = normalizePath(allowedDir);
    return normalized.startsWith(normalizedAllowed);
  });
}

// Create server instance
console.error("[STARTUP] Creating MCP Server instance...");
const server = new Server(
  {
    name: "obsidian-vault-images-v2",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
      roots: {
        listChanged: true, // We support dynamic root updates
      },
    },
  }
);
console.error("[STARTUP] Server instance created successfully");

// Handle roots/list requests (client asks what roots we need access to)
server.setRequestHandler(ListRootsRequestSchema, async () => {
  console.error("[HANDLER] roots/list called by client");
  
  // We can return the roots we want access to
  // For now, return empty since we're using filesystem tool's roots
  return { roots: [] };
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("[HANDLER] ListTools called");
  
  return {
    tools: [
      {
        name: "get_vault_image",
        description: `Retrieve an image from Obsidian vault Media directories and return it as viewable content.

This tool reads image files from your vault's Media directory and returns them as base64-encoded content that Claude can view directly.

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
  const { name, arguments: args } = request.params;
  console.error(`[HANDLER] CallTool called with tool: ${name}`);
  
  try {
    if (name === "get_vault_image") {
      const filename = args?.filename;
      console.error(`[HANDLER] Fetching image: ${filename}`);
      
      if (!filename || typeof filename !== 'string') {
        throw new Error("filename parameter is required and must be a string");
      }
      
      // Validate file extension first
      const ext = extname(filename).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.has(ext)) {
        throw new Error(
          `Unsupported file extension '${ext}'. Supported formats: ${Array.from(SUPPORTED_EXTENSIONS).join(', ')}`
        );
      }
      
      // Check if we have any allowed directories configured
      if (allowedDirectories.length === 0) {
        throw new Error('No image directories configured. Please add directories in extension settings.');
      }
      
      // Search for the image in all allowed directories
      let imagePath = null;
      for (const dir of allowedDirectories) {
        const candidatePath = join(dir, filename);
        console.error(`[HANDLER] Checking: ${candidatePath}`);
        if (existsSync(candidatePath)) {
          imagePath = candidatePath;
          console.error(`[HANDLER] Found in: ${dir}`);
          break;
        }
      }
      
      if (!imagePath) {
        throw new Error(`Image '${filename}' not found in any configured directory`);
      }
      
      const stats = statSync(imagePath);
      if (!stats.isFile()) {
        throw new Error(`'${filename}' is not a file`);
      }
      
      try {
        // Read and encode image
        console.error(`[HANDLER] Reading image file...`);
        const imageBuffer = await readFile(imagePath);
        const base64Data = imageBuffer.toString('base64');
        const sizeKB = Math.round(base64Data.length / 1024);
        console.error(`[HANDLER] Image encoded, size: ~${sizeKB}KB`);
        
        // Check if size might exceed 1MB limit
        if (sizeKB > 900) {
          console.error(`[HANDLER] ⚠️  Large image warning: ${sizeKB}KB (may exceed 1MB limit after JSON encoding)`);
        }
        
        // Get MIME type
        const mimeType = MIME_TYPES[ext] || 'image/png';
        console.error(`[HANDLER] MIME type: ${mimeType}`);
        
        // Return MCP image content block
        console.error(`[HANDLER] ✓ Returning image content block`);
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
        if (error.code === 'EACCES') {
          throw new Error(`Permission denied reading '${filename}'. Check file permissions.`);
        }
        throw new Error(`Error reading image file: ${error.message}`);
      }
    }
    
    throw new Error(`Unknown tool: ${name}`);
    
  } catch (error) {
    console.error(`[ERROR] Tool execution failed: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error: ${error.message}`
      }],
      isError: true,
    };
  }
});
console.error("[STARTUP] CallTool handler registered");

// Start the server
async function main() {
  try {
    console.error("[STARTUP] Creating transport...");
    const transport = new StdioServerTransport();
    
    console.error("[STARTUP] Connecting server to transport...");
    await server.connect(transport);
    
    console.error("[STARTUP] ✓ Server connected and ready");
    console.error("[STARTUP] ✓ Waiting for client requests...");
  } catch (error) {
    console.error("[FATAL] Server initialization failed:", error.message);
    console.error("[FATAL] Stack:", error.stack);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[FATAL] Uncaught error:", error.message);
  console.error("[FATAL] Stack:", error.stack);
  process.exit(1);
});
