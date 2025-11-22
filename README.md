# image-viewer-mcp

MCP server that enables Claude to view images from configured directories without manual uploads.

## Features

- **View images directly in Claude** - No drag/drop or upload needed
- **Multi-directory support** - Configure as many image directories as needed
- **Troubleshooting tools** - List directories and browse available images
- **Supported formats**: PNG, JPG, JPEG, GIF, WEBP

## Tools

| Tool | Description |
|------|-------------|
| `get_vault_image` | Retrieve an image by filename |
| `list_directories` | List configured directories and their status |
| `list_images` | List all images in a specific directory |

## Installation

### Option 1: Build and install

```bash
git clone https://github.com/YOUR_USERNAME/image-viewer-mcp.git
cd image-viewer-mcp
npm install
npm run build
```

Then double-click `image-viewer.mcpb` to install in Claude Desktop.

### Option 2: Manual configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "image-viewer": {
      "command": "node",
      "args": [
        "/path/to/image-viewer-mcp/server/index.js",
        "--roots",
        "/path/to/images,/another/path/to/images"
      ]
    }
  }
}
```

Directories are comma-separated, no spaces between them.

## Configuration

After installation via `.mcpb`, configure directories in Claude Desktop:

1. Settings → Extensions
2. Find "image-viewer"
3. Add directories containing your images

## Usage

In Claude:

```
"Show me diagram.png"
"List the configured image directories"
"What images are in directory 0?"
"Display the architecture screenshot"
```

## Troubleshooting

**"Image not found"**
- Run `list_directories` to verify paths are configured and exist
- Run `list_images` to see available files in each directory
- Check filename spelling and extension

**"No directories configured"**
- Verify `--roots` argument in config
- Restart Claude Desktop after config changes

**Large images fail**
- Images over ~1MB may exceed MCP message limits
- Resize or compress large images before viewing

## Development

```bash
npm install          # Install dependencies
npm run validate     # Validate manifest.json
npm run build        # Build .mcpb extension
npm run clean        # Remove build artifacts
```

## License

MIT
