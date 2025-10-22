# Quick Start: Building the .mcpb Extension

## What Changed
- **Old format:** `.dxt` files
- **New format:** `.mcpb` (MCP Bundle) files  
- **When:** September 11, 2025
- **Impact:** Only naming - all functionality is the same

## Build the Extension (One Time Setup)

```bash
# 1. Install dependencies
npm install

# 2. Install MCPB packaging tools globally
npm install -g @anthropic-ai/mcpb

# 3. Package into .mcpb file
npx @anthropic-ai/mcpb pack
```

This creates: `obsidian-vault-images.mcpb`

## Install the Extension (End User - No Dev Tools Needed!)

1. **Double-click** `obsidian-vault-images.mcpb`
2. Claude Desktop opens with install dialog
3. **Configure** your Media directory path
4. Click **"Install"**
5. **Done!** 🎉

## Test the Loophole

Once installed, just ask Claude:

```
Show me the Wardley Map from my vault
```

Claude will call `get_vault_image` which returns:
```javascript
{
  type: "image",
  data: "<base64>",
  mimeType: "image/png"
}
```

**THE TEST:** Can Claude actually SEE the image, or just receive JSON?

## Key Points

✅ **For END USERS:** Zero dev tools needed - Claude bundles Node.js  
✅ **For DEVELOPERS:** Need Node/npm ONCE to create the `.mcpb` package  
✅ **Cross-platform:** Works on Windows, macOS, Linux  
✅ **Secure:** API keys stored in OS keychain  
✅ **Auto-updates:** When you publish new versions  

## If You Don't Want to Build

Alternative: Use the old stdio MCP approach (painful manual config, but no build step required)

## What This Tests

Whether MCP servers can return images that Claude can actually VIEW (not just receive as base64 text).

If this works = **HUGE WIN** for your Obsidian workflow!
