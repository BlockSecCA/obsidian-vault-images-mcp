# Obsidian Vault Images - Claude Desktop Extension

An `.mcpb` (MCP Bundle) extension that enables Claude to view images from your Obsidian vault without manual uploads.

**Note:** This uses the new `.mcpb` format (previously `.dxt`). Both formats work in Claude Desktop.

## What This Tests

This extension is a proof-of-concept to test whether MCP image content blocks (type: "image") are properly passed through to Claude's context window, allowing Claude to natively view images returned by MCP tools.

## Quick Install (Once Built)

1. Download `obsidian-vault-images.mcpb`
2. Double-click the file (or drag into Claude Desktop Settings)
3. Claude Desktop will prompt you to configure the Media directory path
4. Click "Install"
5. Done!

## Building the Extension

### Prerequisites

- Node.js 18+ installed
- npm installed

### Build Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install MCPB packaging tools:**
   ```bash
   npm install -g @anthropic-ai/mcpb
   ```

3. **Package the extension:**
   ```bash
   npx @anthropic-ai/mcpb pack
   ```

   This creates `obsidian-vault-images.mcpb` - a ZIP file containing:
   ```
   obsidian-vault-images.mcpb
   ├── manifest.json      # Extension metadata and config
   ├── server/
   │   └── index.js       # MCP server code
   ├── package.json       # Node.js dependencies
   └── node_modules/      # Bundled dependencies
   ```

4. **Install in Claude Desktop:**
   - Double-click the `.mcpb` file
   - OR drag it into Claude Desktop Settings
   - Configure your Media directory path when prompted
   - Click "Install"

## Usage

Once installed, you can ask Claude:

```
Show me the image "Wardley Map Example - Tea Shop.webp" from my vault
```

Or:

```
Use get_vault_image to display "FAIR Risk Model Overview.png"
```

Or naturally:

```
What's in my Cynefin framework diagram?
```

Claude will call the `get_vault_image` tool, which returns the image as a base64-encoded content block.

## The Critical Test

**Does it work?**

- ✅ **Success**: Claude can see and analyze the image (OCR, visual analysis, diagram interpretation)
- ❌ **Failure**: Claude receives base64 data but says "I cannot view this" or similar

## How It Works

1. **User asks about an image**
2. **Claude calls the tool**: `get_vault_image({ filename: "Image.png" })`
3. **MCP server**:
   - Reads from `C:\Users\YourUsername\Documents\Obsidian\blocksec\Media\Image.png`
   - Encodes to base64
   - Returns: `{ type: "image", data: "...", mimeType: "image/png" }`
4. **Claude Desktop MCP framework** receives the response
5. **THE TEST**: Does it pass the image to Claude's context like an uploaded image?

## Configuration

The extension will prompt you for:

- **Obsidian Media Directory**: Path to your vault's Media folder
  - Example: `C:\Users\YourUsername\Documents\Obsidian\blocksec\Media`
  - Or: `~/Documents/Obsidian/blocksec/Media`

This path is stored securely by Claude Desktop and injected as an environment variable when the MCP server starts.

## Supported Formats

- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- GIF (`.gif`)
- WebP (`.webp`)

## Troubleshooting

### Extension won't install
- Ensure you're using Claude Desktop (not the web version)
- Check that Node.js 18+ is available (bundled by Claude)
- Try restarting Claude Desktop

### "File not found" errors
- Verify the Media directory path in the extension settings
- Check that the filename is exactly correct (case-sensitive on some systems)
- Ensure the file has a supported extension

### Permission errors
- Ensure Claude Desktop has read access to your vault directory
- On Windows, try running Claude Desktop as administrator
- Check file permissions on the Media directory

## Why .mcpb Instead of Manual MCP?

**Old way (stdio MCP):**
- Install Node.js manually
- Clone repository
- Run `npm install`
- Edit `~/.claude/claude_desktop_config.json`
- Restart Claude
- Debug PATH issues
- 😭

**New way (.mcpb extension):**
- Double-click
- Configure path
- Install
- ✨

## Development

To modify the server code:

1. Edit `server/index.js`
2. Run `npx @anthropic-ai/mcpb pack` to rebuild
3. Reinstall the `.mcpb` file in Claude Desktop

## What's Next?

If this test succeeds, potential extensions:
- Auto-detect `![[Image.png]]` wikilinks in notes
- Batch load multiple images from a note
- Integration with the blocksec skill for seamless note+image viewing
- Support for other media types

## License

MIT

## Credits

Built to test the MCP image content block loophole - can MCP servers make images visible to Claude without manual uploads?
