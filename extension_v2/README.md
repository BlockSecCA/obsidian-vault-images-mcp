# Obsidian Vault Images MCP Server v2

Version 2.0 with **MCP Roots Protocol** support for dynamic multi-directory management!

## What's New in v2

✨ **Multi-Directory Support** - Configure multiple image directories dynamically through Claude Desktop UI
✨ **Roots Protocol** - No restart needed to add/remove directories
✨ **Better Error Messages** - Clear feedback when images aren't found
✨ **Security** - Path validation ensures only configured directories are accessed
✨ **New Tool** - `list_allowed_directories` to see what's configured

## Key Differences from v1

| Feature | v1 | v2 |
|---------|----|----|
| Directories | Single, hardcoded during install | Multiple, configurable via UI |
| Changes | Requires reinstall | Dynamic, no restart |
| UI | Manual path entry | Native Claude Desktop interface |
| Protocol | Basic MCP | MCP with Roots |

## Installation

### 1. Install Dependencies
```bash
cd extension_v2
npm install
```

### 2. Pack the Extension
```bash
npx @anthropic-ai/mcpb pack
```

This creates `extension_v2.mcpb` in the directory.

### 3. Install in Claude Desktop
1. Drag `extension_v2.mcpb` into Claude Desktop
2. After installation, go to extension settings
3. Configure image directories through the UI (similar to Filesystem extension)

## Usage

Once configured, simply ask Claude to retrieve images:

```
"Show me the Wardley Map from my vault"
"Display Cynefin framework diagram"
"Get the image named 'architecture-overview.png'"
```

You can also check what directories are configured:
```
"List my image directories"
```

## How It Works

The extension implements the **MCP Roots protocol**, which allows:

1. **Initial Setup**: Claude Desktop can provide directory paths to the server
2. **Dynamic Updates**: Add/remove directories without restarting
3. **Automatic Discovery**: Server searches all configured directories for requested images
4. **Security**: All file access is validated against allowed directories

## Architecture

```
Claude Desktop (Client)
    ↓ Roots Protocol
MCP Server v2
    ↓ File System Access
Multiple Image Directories
```

The server:
- Subscribes to `roots/list_changed` notifications
- Requests current roots via `roots/list`
- Updates allowed directories dynamically
- Searches all directories when fetching images

## Comparison with Filesystem Extension

This extension is inspired by Anthropic's Filesystem extension but specialized for images:

| Feature | Filesystem | Obsidian Images v2 |
|---------|-----------|-------------------|
| File Types | Any | Images only (.png, .jpg, .gif, .webp) |
| Operations | Full CRUD | Read-only |
| Return Format | Text content | Base64 image blocks |
| Use Case | General file access | Obsidian vault images |

## Troubleshooting

### No Directories Configured
**Error**: "No directories configured"
**Solution**: Go to Claude Desktop → Extensions → obsidian-vault-images-mcp-v2 → Settings, and add directory paths

### Image Not Found
**Error**: "Image 'x.png' not found in any configured directory"
**Solution**: 
1. Check the filename (case-sensitive on some systems)
2. Verify the image is in one of your configured directories
3. Use `list_allowed_directories` tool to see what's configured

### Large Image Warning
**Warning**: "Large image warning: >900KB"
**Note**: Images over ~800KB original size may exceed the 1MB MCP response limit. Consider resizing large images in your vault.

## Technical Details

### Supported Image Formats
- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF (.gif)
- WebP (.webp)

### Size Limits
- Maximum response size: 1MB (MCP protocol limit)
- Large images are detected and warned about
- Base64 encoding adds ~33% overhead

### Security
- Path traversal protection
- Directory validation on every request
- Only configured directories are accessible

## License

MIT
