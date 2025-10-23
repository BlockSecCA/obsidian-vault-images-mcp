# Installation Guide

Complete installation instructions for the Obsidian Vault Images MCP extension.

## Quick Install (V2 - Recommended)

### 1. Download or Build

**Option A: Download pre-built**
- Download `obsidian-vault-images-mcp-v2.mcpb` from releases
- Skip to step 2

**Option B: Build from source**
```bash
cd extension_v2
npm install
mcpb pack . obsidian-vault-images-mcp-v2.mcpb
```

### 2. Install Extension

**Windows:**
1. Open Claude Desktop
2. Click Settings (gear icon)
3. Navigate to "Extensions"
4. Click "Install Extension" or drag-and-drop the .mcpb file
5. Browse to `obsidian-vault-images-mcp-v2.mcpb`
6. Click "Install"

**macOS:**
1. Open Claude Desktop
2. Go to Preferences → Extensions
3. Click "+" or drag-and-drop the .mcpb file
4. Select `obsidian-vault-images-mcp-v2.mcpb`
5. Click "Install"

**Alternative: Double-click**
If file associations are set up, simply double-click the .mcpb file.

### 3. Configure Directories

After installation:
1. In Claude Desktop settings, find "obsidian-vault-images-mcp-v2"
2. Click "Configure" button
3. Click "Add Directory" 
4. Browse to your Obsidian vault's Media directory
   - Example: `C:\Users\YourName\Documents\Obsidian\blocksec\Media`
5. Add additional Media directories if needed (can have multiple)
6. Click "Save"

### 4. Restart Claude Desktop

Close and reopen Claude Desktop to activate the extension.

### 5. Verify Installation

1. Open a new conversation in Claude Desktop
2. Ask: "Can you list the available tools?"
3. You should see `get_vault_image` in the list
4. Check Settings → Extensions shows the extension as "Enabled"

## Testing the Extension

Try these commands in Claude:

```
Show me the image "Wardley Map.png"
```

```
Get the Cynefin framework diagram
```

```
Display "FAIR Risk Model Overview.png" from my vault
```

Claude should:
1. Call the `get_vault_image` tool
2. Retrieve the image from your configured directories
3. Display and analyze the image

## Installing V1 (Not Recommended)

V1 requires manual path configuration in the manifest before building.

### 1. Edit manifest.json

Before building, edit `extension_v1/manifest.json`:

```json
{
  "server": {
    "mcp_config": {
      "args": [
        "${__dirname}/server/index.js",
        "C:\\Users\\YourName\\Documents\\Obsidian\\YourVault\\Media"
      ]
    }
  }
}
```

Replace the path with your actual Media directory.

### 2. Build and Install

```bash
cd extension_v1
npm install
mcpb pack . obsidian-vault-images-mcp-v1.mcpb
```

Then install the .mcpb file as described above.

**Note:** V1 doesn't have the configuration UI, so you must edit the manifest to change paths.

## Configuration Details

### Directory Requirements

Configured directories should:
- Exist on your filesystem
- Be readable by Claude Desktop
- Contain supported image formats (.png, .jpg, .jpeg, .gif, .webp)
- Be absolute paths (e.g., `C:\Users\...` on Windows, `/Users/...` on macOS)

### Multiple Directories

You can configure multiple Media directories:
- Main vault: `C:\Users\Carlos\Documents\Obsidian\blocksec\Media`
- Archive vault: `C:\Users\Carlos\Documents\Obsidian\archive\Media`
- Assets folder: `C:\Users\Carlos\Documents\Assets`

The extension searches all configured directories when looking for an image.

### Security Considerations

⚠️ **Important:** Only configure directories you want Claude to access. The extension can read any image file in the configured directories.

Best practices:
- Use specific Media directories, not entire drives
- Don't configure sensitive document folders
- Review configured paths regularly
- Remove unused directory configurations

## Uninstalling

### Remove Extension

1. Open Claude Desktop Settings → Extensions
2. Find "obsidian-vault-images-mcp-v2"
3. Click the "..." menu
4. Select "Uninstall"
5. Restart Claude Desktop

### Manual Cleanup (if needed)

**Windows:**
```
%APPDATA%\Claude\extensions\
```

**macOS:**
```
~/Library/Application Support/Claude/extensions/
```

Delete the `obsidian-vault-images-mcp-v2` folder if it exists.

## Updating the Extension

### To a New Version

1. Uninstall the current version (see above)
2. Install the new .mcpb file
3. Reconfigure directories (settings may not persist)
4. Restart Claude Desktop

### Preserving Configuration

Configuration is stored by Claude Desktop. In most cases it persists across updates, but reconfiguration may be needed.

## Troubleshooting Installation

### Extension doesn't appear in list

**Possible causes:**
- Installation failed
- File corruption
- Insufficient permissions

**Solutions:**
- Check Claude Desktop logs for errors
- Try reinstalling
- Verify .mcpb file integrity (should be a valid zip file)
- Run Claude Desktop as administrator (Windows)

### "Configure" button not showing (V2)

**Possible causes:**
- V1 installed instead of V2
- Extension not fully loaded

**Solutions:**
- Verify you installed the V2 version
- Check extension details in settings
- Restart Claude Desktop
- Reinstall the extension

### Configuration not saving

**Possible causes:**
- Paths don't exist
- Permission issues
- Invalid path format

**Solutions:**
- Verify directories exist
- Use absolute paths
- Check directory permissions
- Try paths without spaces (use short names if needed on Windows)

### Extension enabled but tools not available

**Possible causes:**
- Extension crashed on startup
- Node.js runtime issues
- Dependency problems

**Solutions:**
- Check Claude Desktop logs
- Verify Node.js is installed and in PATH
- Try reinstalling with `npm install` before building
- Test server standalone: `node server/index.js --roots "C:\test\path"`

## Installation Logs

### Windows Logs Location
```
%APPDATA%\Claude\logs\
```

Look for:
- `mcp-server-obsidian-vault-images-mcp-v2.log`
- `claude-desktop.log`

### macOS Logs Location
```
~/Library/Application Support/Claude/logs/
```

### What to Look For

Successful installation shows:
```
[INFO] Loading extension: obsidian-vault-images-mcp-v2
[INFO] Extension loaded successfully
[INFO] Server started on stdio transport
```

Errors might show:
```
[ERROR] Failed to load extension
[ERROR] Module not found
[ERROR] Permission denied
```

## Getting Help

If installation issues persist:

1. **Check logs** for specific error messages
2. **Verify prerequisites** (Node.js version, MCPB CLI)
3. **Try V1** if V2 has issues (simpler configuration)
4. **Open an issue** on GitHub with:
   - Your OS and version
   - Claude Desktop version
   - Error messages from logs
   - Steps you've tried

## Next Steps

After successful installation:
- Test with sample images
- Explore integration with Obsidian workflows
- Check out example use cases
- Provide feedback on GitHub

---

**Need more help?** See [BUILDING.md](BUILDING.md) for build instructions or [README.md](README.md) for general information.
