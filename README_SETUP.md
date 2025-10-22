# Obsidian Vault Images MCP Server - Setup Instructions

## What This Does

This MCP server enables Claude to view images from your Obsidian vault without requiring manual uploads. It's a proof-of-concept to test whether MCP image content types are properly passed through to Claude's context window.

## Prerequisites

- **Claude Desktop app** (not the web version - browser can't spawn local processes)
- **Python 3.10+** installed
- **mcp package** installed

## Installation

### 1. Install the MCP Python SDK

```bash
pip install mcp
```

### 2. Save the MCP Server

Save `obsidian_vault_images_mcp.py` to a location on your system, for example:
```
C:\Users\Carlos\mcp-servers\obsidian_vault_images_mcp.py
```

### 3. Configure Claude Desktop

The MCP configuration file location depends on your OS:

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Mac:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

Edit this file (create it if it doesn't exist) and add:

```json
{
  "mcpServers": {
    "obsidian-vault-images": {
      "command": "python",
      "args": [
        "C:\\Users\\Carlos\\mcp-servers\\obsidian_vault_images_mcp.py"
      ]
    }
  }
}
```

**Important:** Update the path in `args` to match where you saved the file.

### 4. Restart Claude Desktop

Close and reopen Claude Desktop to load the new MCP server.

## Testing

Once configured, you can test it in Claude Desktop by asking:

```
Can you show me the image "Wardley Map Example - Tea Shop.webp" from my vault?
```

Or:

```
Use the get_vault_image tool to show me "FAIR Risk Model Overview.png"
```

Claude should call the MCP tool, which will return the image data. The critical test is whether Claude can actually **see** the image, or if it just receives it as text/JSON.

## Expected Behavior

**If the loophole works:**
- Claude will be able to see and analyze the image just like you uploaded it manually
- You'll get visual analysis, OCR, diagram interpretation, etc.

**If the loophole doesn't work:**
- Claude will receive the base64 data but not be able to "see" it
- It might say "I received image data but cannot view it" or similar

## Troubleshooting

### Server not showing up in Claude

- Verify Python is in your PATH: `python --version`
- Check the path in the config file is correct (use double backslashes on Windows)
- Look for error messages in Claude Desktop's logs
- Try running the server manually to check for errors: `python obsidian_vault_images_mcp.py --help`

### File not found errors

- Verify the VAULT_MEDIA_PATH in the Python file matches your actual Media directory
- Check that the image filename is exactly correct (case-sensitive)
- Make sure the file extension is supported (.png, .jpg, .jpeg, .gif, .webp)

### Permission errors

- Ensure Claude Desktop has permission to read from your Obsidian vault directory
- Try running Claude Desktop as administrator (Windows) if needed

## What This Tests

This MCP server is specifically designed to test whether:
1. MCP servers can return image content blocks (type: "image")
2. The Claude.ai MCP framework properly passes these through to Claude's context
3. Claude can natively view images returned by MCP tools

If this works, it solves your original problem: viewing vault images without manual uploads!

## Next Steps

If the test is successful, this could be extended to:
- Auto-detect wikilink references like `![[Image.png]]` in notes
- Batch load multiple images
- Support other media types (audio, video thumbnails)
- Integration with the blocksec skill for seamless note+image viewing
