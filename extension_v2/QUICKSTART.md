# Quick Start - Obsidian Images v2

## Build & Install (5 minutes)

### Step 1: Install Dependencies
```bash
cd "C:\Users\YourUsername\OneDrive - <YourCompany>\code\claude-image-mcp\extension_v2"
npm install
```

### Step 2: Package the Extension
```bash
npx @anthropic-ai/mcpb pack
```

You should see `extension_v2.mcpb` created in the directory.

### Step 3: Install in Claude Desktop
1. Open Claude Desktop
2. Drag `extension_v2.mcpb` into the window
3. Click "Install"

### Step 4: Configure Directories
1. Go to: Extensions → obsidian-vault-images-mcp-v2 → Settings
2. You should see a UI similar to the Filesystem extension
3. Click "Add directory"
4. Enter: `C:\Users\YourUsername\Documents\Obsidian\blocksec\Media`
5. (Optional) Add more directories if you have multiple vaults

### Step 5: Test It!
Ask Claude:
```
"Show me the Wardley Map from my vault"
```

or

```
"Display the Cynefin framework diagram"
```

## What You Get

✅ Multiple image directories (unlike v1's single directory)
✅ Add/remove directories without reinstalling
✅ Native Claude Desktop UI for configuration
✅ All your images from multiple vaults accessible

## If Something Goes Wrong

### Check Logs
Extensions → obsidian-vault-images-mcp-v2 → "Open Logs Folder"

Look for:
- `[STARTUP]` messages showing initialization
- `[ROOTS]` messages showing directory configuration
- `[HANDLER]` messages showing image requests

### Common Issues

**"No directories configured"**
→ You haven't added any directories yet - go to extension settings

**"Image not found"**
→ Check filename spelling and that it's in one of your configured directories

**"Server disconnected"**
→ Check logs for error messages - likely a path or permission issue

## Next Steps

Once working, you can:
1. Add more vault Media directories
2. Keep v1 installed alongside v2 to compare
3. Use v2 as your primary image access method

Enjoy seamless image access from your Obsidian vaults! 🎉
