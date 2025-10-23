# Obsidian Vault Images MCP Extension

MCP extension that enables Claude Desktop to retrieve and view images from your Obsidian vault's Media directories.

## Features

- 📁 **Multi-directory support**: Configure multiple Media directories in your vault
- 🖼️ **Image retrieval**: Fetch images by filename from configured directories
- 🔍 **Format support**: PNG, JPG, JPEG, GIF, WEBP
- 🎯 **Direct viewing**: Images returned as viewable content for Claude to analyze

## Versions

This repository contains two versions:

### V1 - Single Directory (Hardcoded)
Simple proof-of-concept with hardcoded Media directory path.

**Pros:**
- Simple, straightforward implementation
- Easy to understand and modify

**Cons:**
- Path hardcoded in manifest
- Requires editing manifest.json to change directory

### V2 - Multi-Directory (User Configured) ⭐ Recommended
Production-ready version with user-configurable directories via Claude Desktop UI.

**Pros:**
- Configure directories through Claude Desktop settings
- Support for multiple Media directories
- No code editing required
- Proper implementation of MCP roots protocol

**Cons:**
- Slightly more complex setup

## Installation

### Prerequisites

- Claude Desktop application (Windows, macOS, or Linux)
- Node.js 18+ installed
- MCPB CLI tool (`npm install -g @anthropic-ai/mcpb`)

### Quick Start (V2 Recommended)

1. **Clone this repository**
   ```bash
   git clone https://github.com/BlockSecCA/claude-image-retrieve-mcp.git
   cd obsidian-vault-images-mcp/extension_v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Package the extension**
   ```bash
   mcpb pack
   ```

4. **Install in Claude Desktop**
   
   The pack command creates `obsidian-vault-images-mcp-v2.mcpb` file.
   
   **Option A: Double-click** the `.mcpb` file (if file association is set up)
   
   **Option B: Manual installation**
   - Open Claude Desktop settings
   - Go to Extensions
   - Click "Install Extension"
   - Select the `obsidian-vault-images-mcp-v2.mcpb` file

5. **Configure directories**
   - In Claude Desktop settings, find "obsidian-vault-images-mcp-v2"
   - Click "Configure"
   - Add your Obsidian vault Media directories (e.g., `C:\Users\YourName\Documents\Obsidian\YourVault\Media`)
   - Save configuration

6. **Restart Claude Desktop**

### V1 Installation

See [extension_v1/README.md](extension_v1/README.md) for V1-specific instructions.

## Usage

Once installed and configured, you can ask Claude to retrieve images referenced in Obsidian notes as links. Note the extension can be used with any directory that contains image files. 

Claude will use the `get_vault_image` tool to retrieve images from your configured Media directories.

## How It Works

1. **User configures directories** in Claude Desktop settings (V2) or manifest (V1)
2. **Claude recognizes image requests** in conversation
3. **Extension searches** configured directories for the image file
4. **Image returned** as base64-encoded viewable content
5. **Claude analyzes** the image directly in the conversation

## Building from Source

### V2 (Recommended)

```bash
cd extension_v2
npm install
mcpb pack 
```

This creates `obsidian-vault-images-mcp-v2.mcpb` ready for installation.

### V1

```bash
cd extension_v1
npm install
mcpb pack 
```

## Development

### Project Structure

```
obsidian-vault-images-mcp/
├── extension_v1/              # Simple hardcoded version
│   ├── manifest.json          # V1 manifest
│   ├── server/
│   │   └── index.js          # V1 server implementation
│   └── package.json
├── extension_v2/              # Multi-directory configurable version
│   ├── manifest.json          # V2 manifest with user_config
│   ├── server/
│   │   └── index.js          # V2 server implementation
│   └── package.json
└── README.md                  # This file
```

### Key Technologies

- **MCP (Model Context Protocol)**: Communication protocol between Claude and extensions
- **@modelcontextprotocol/sdk**: Official MCP SDK for Node.js
- **MCPB**: MCP Bundle format for Claude Desktop extensions

### Manifest Details

The manifest.json defines:
- Extension metadata (name, version, description)
- Server configuration (Node.js entry point)
- User configuration schema (V2 only)
- Available tools
- MCP configuration (command, args, env)

See [manifest documentation](https://docs.anthropic.com/claude/docs/extensions) for details.

## Troubleshooting

### Extension not showing in Claude Desktop

- Verify MCPB file was created successfully
- Check Claude Desktop logs for errors
- Try reinstalling the extension
- Restart Claude Desktop

### "No directories configured" error

- Open Claude Desktop settings → Extensions
- Find obsidian-vault-images-mcp-v2
- Click "Configure" and add your Media directories
- Ensure paths are absolute and directories exist

### "Image not found" error

- Verify the image file exists in one of your configured directories
- Check filename matches exactly (case-sensitive)
- Ensure file extension is supported (.png, .jpg, .jpeg, .gif, .webp)
- Check directory paths are correct in configuration

### "Tool result is too large" error

Image file exceeds 1MB limit. Solutions:
- Compress the image before adding to vault
- Use smaller image formats (WEBP)
- Consider splitting large diagrams

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Claude Desktop
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built using the [MCP SDK](https://github.com/anthropics/mcp-sdk)
- Designed for [Obsidian](https://obsidian.md) vault integration
- Tested with Claude Desktop application

## Related Projects

- [MCP Servers](https://github.com/anthropics/mcp-servers) - Official MCP server examples
- [Claude Desktop Extensions](https://docs.anthropic.com/claude/docs/extensions) - Extension documentation

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review troubleshooting section above

---

**Note**: This extension provides local file access to Claude Desktop. Ensure you understand the security implications and only configure directories you want Claude to access.
