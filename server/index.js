#!/usr/bin/env node

/**
 * Image Viewer MCP Server
 * 
 * Enables Claude to view images from configured directories without manual uploads.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListRootsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile, readdir } from "fs/promises";
import { existsSync, statSync } from "fs";
import { join, extname, normalize } from "path";

console.error("[STARTUP] Image Viewer MCP Server starting...");

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

// Allowed directories - set via command line --roots argument
let allowedDirectories = [];

// Parse directories from various formats
function parseDirectories(args) {
  const dirs = [];
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--roots' && i + 1 < args.length) {
      // Collect all remaining arguments after --roots
      for (let j = i + 1; j < args.length; j++) {
        const arg = args[j];
        
        // Stop if we hit another flag
        if (arg.startsWith('--')) break;
        
        // Try to parse as JSON array
        if (arg.startsWith('[')) {
          try {
            const parsed = JSON.parse(arg);
            if (Array.isArray(parsed)) {
              dirs.push(...parsed);
              continue;
            }
          } catch (e) {
            // Not JSON, treat as path
          }
        }
        
        // Handle comma-separated paths
        if (arg.includes(',')) {
          dirs.push(...arg.split(',').map(d => d.trim()).filter(d => d));
        } else if (arg.trim()) {
          // Single path
          dirs.push(arg.trim());
        }
      }
      break;
    }
  }
  
  // Normalize all paths
  return dirs.map(d => normalize(d)).filter(d => d.length > 0);
}

// Parse command line arguments
const args = process.argv.slice(2);
console.error(`[STARTUP] Raw args: ${JSON.stringify(args)}`);

allowedDirectories = parseDirectories(args);
console.error(`[STARTUP] Configured directories (${allowedDirectories.length}):`);
allowedDirectories.forEach((d, i) => console.error(`  [${i}] ${d}`));

if (allowedDirectories.length === 0) {
  console.error("[STARTUP] WARNING: No directories configured");
}

// Create server instance
const server = new Server(
  {
    name: "image-viewer",
    version: "2.2.0",
  },
  {
    capabilities: {
      tools: {},
      roots: {
        listChanged: true,
      },
    },
  }
);

// Handle roots/list requests
server.setRequestHandler(ListRootsRequestSchema, async () => {
  return { roots: [] };
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_image",
        description: `Retrieve an image from configured directories and return it as viewable content.

Supported formats: PNG, JPG, JPEG, GIF, WEBP

Example usage:
- "Show me the diagram.png"
- "Get the screenshot.jpg"
- "Display architecture.png"`,
        inputSchema: {
          type: "object",
          properties: {
            filename: {
              type: "string",
              description: "Name of the image file including extension",
            },
          },
          required: ["filename"],
        },
      },
      {
        name: "list_directories",
        description: "List all configured image directories and their status. Useful for troubleshooting.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "list_images",
        description: "List all images in a specific configured directory.",
        inputSchema: {
          type: "object",
          properties: {
            directory_index: {
              type: "number",
              description: "Index of the directory (from list_directories). Use 0 for first directory, 1 for second, etc.",
            },
          },
          required: [],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    // Tool: list_directories
    if (name === "list_directories") {
      if (allowedDirectories.length === 0) {
        return {
          content: [{
            type: "text",
            text: "No directories configured.\n\nTo configure directories, update the MCP settings in Claude Desktop."
          }],
        };
      }
      
      let output = `Configured directories (${allowedDirectories.length}):\n\n`;
      
      for (let i = 0; i < allowedDirectories.length; i++) {
        const dir = allowedDirectories[i];
        const exists = existsSync(dir);
        const status = exists ? "✓ exists" : "✗ NOT FOUND";
        output += `[${i}] ${dir}\n    Status: ${status}\n`;
        
        if (exists) {
          try {
            const files = await readdir(dir);
            const imageFiles = files.filter(f => SUPPORTED_EXTENSIONS.has(extname(f).toLowerCase()));
            output += `    Images: ${imageFiles.length} files\n`;
          } catch (e) {
            output += `    Error reading: ${e.message}\n`;
          }
        }
        output += "\n";
      }
      
      return {
        content: [{
          type: "text",
          text: output
        }],
      };
    }
    
    // Tool: list_images
    if (name === "list_images") {
      const dirIndex = args?.directory_index ?? 0;
      
      if (allowedDirectories.length === 0) {
        throw new Error("No directories configured");
      }
      
      if (dirIndex < 0 || dirIndex >= allowedDirectories.length) {
        throw new Error(`Invalid directory index. Valid range: 0-${allowedDirectories.length - 1}`);
      }
      
      const dir = allowedDirectories[dirIndex];
      
      if (!existsSync(dir)) {
        throw new Error(`Directory does not exist: ${dir}`);
      }
      
      const files = await readdir(dir);
      const imageFiles = files.filter(f => SUPPORTED_EXTENSIONS.has(extname(f).toLowerCase()));
      
      if (imageFiles.length === 0) {
        return {
          content: [{
            type: "text",
            text: `No images found in: ${dir}\n\nSupported formats: ${Array.from(SUPPORTED_EXTENSIONS).join(', ')}`
          }],
        };
      }
      
      let output = `Images in ${dir}:\n\n`;
      for (const file of imageFiles.sort()) {
        try {
          const filePath = join(dir, file);
          const stats = statSync(filePath);
          const sizeKB = Math.round(stats.size / 1024);
          output += `  ${file} (${sizeKB} KB)\n`;
        } catch {
          output += `  ${file}\n`;
        }
      }
      output += `\nTotal: ${imageFiles.length} images`;
      
      return {
        content: [{
          type: "text",
          text: output
        }],
      };
    }
    
    // Tool: get_image
    if (name === "get_image") {
      const filename = args?.filename;
      
      if (!filename || typeof filename !== 'string') {
        throw new Error("filename parameter is required");
      }
      
      const ext = extname(filename).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.has(ext)) {
        throw new Error(
          `Unsupported format '${ext}'. Supported: ${Array.from(SUPPORTED_EXTENSIONS).join(', ')}`
        );
      }
      
      if (allowedDirectories.length === 0) {
        throw new Error('No directories configured. Use list_directories to check configuration.');
      }
      
      // Search for the image in all allowed directories
      let imagePath = null;
      for (const dir of allowedDirectories) {
        const candidatePath = join(dir, filename);
        if (existsSync(candidatePath)) {
          imagePath = candidatePath;
          break;
        }
      }
      
      if (!imagePath) {
        const searchedDirs = allowedDirectories.map((d, i) => `  [${i}] ${d}`).join('\n');
        throw new Error(`Image '${filename}' not found.\n\nSearched directories:\n${searchedDirs}\n\nUse list_images to see available files.`);
      }
      
      const stats = statSync(imagePath);
      if (!stats.isFile()) {
        throw new Error(`'${filename}' is not a file`);
      }
      
      const imageBuffer = await readFile(imagePath);
      const base64Data = imageBuffer.toString('base64');
      const mimeType = MIME_TYPES[ext] || 'image/png';
      
      return {
        content: [
          {
            type: "image",
            data: base64Data,
            mimeType: mimeType,
          },
        ],
      };
    }
    
    throw new Error(`Unknown tool: ${name}`);
    
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error: ${error.message}`
      }],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[STARTUP] Server ready");
}

main().catch((error) => {
  console.error("[FATAL]", error.message);
  process.exit(1);
});
