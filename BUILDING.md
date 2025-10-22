# Building the Extension

This guide covers how to build the MCPB extension from source.

## Prerequisites

Before building, ensure you have:

- **Node.js 18 or higher**: Download from [nodejs.org](https://nodejs.org/)
- **npm**: Comes with Node.js
- **MCPB CLI**: Install globally with `npm install -g @anthropic-ai/mcpb`

Verify installations:
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show 8.x.x or higher
mcpb --version   # Should show the MCPB version
```

## Building V2 (Recommended)

V2 uses a build script for convenience:

### 1. Navigate to V2 directory
```bash
cd extension_v2
```

### 2. Install dependencies
```bash
npm install
```

This installs:
- `@modelcontextprotocol/sdk` - MCP SDK for Node.js
- Development dependencies

### 3. Build the extension
```bash
npm run build
```

This script:
1. Validates the manifest.json
2. Packages all files into `obsidian-vault-images-mcp-v2.mcpb`
3. Places the .mcpb file in the extension_v2 directory

### 4. Verify the build
```bash
# Windows
dir *.mcpb

# macOS/Linux
ls -lh *.mcpb
```

You should see `obsidian-vault-images-mcp-v2.mcpb` created.

## Building V1

V1 requires manual MCPB packaging:

### 1. Navigate to V1 directory
```bash
cd extension_v1
```

### 2. Install dependencies
```bash
npm install
```

### 3. Package with MCPB
```bash
mcpb pack . obsidian-vault-images-mcp-v1.mcpb
```

This creates the .mcpb file ready for installation.

## Build Output

The `.mcpb` file is essentially a zip archive containing:
- `manifest.json` - Extension metadata and configuration
- `server/` - Server implementation files
- `node_modules/` - Bundled dependencies
- `package.json` - Node.js package metadata

## Validating Before Build

To check your manifest without building:

```bash
mcpb validate manifest.json
```

This catches common errors:
- Invalid JSON syntax
- Missing required fields
- Incorrect field types
- Schema validation issues

## Common Build Errors

### "manifest.json not found"

**Cause**: Running command from wrong directory

**Fix**: Ensure you're in extension_v1 or extension_v2 directory

### "Invalid manifest version"

**Cause**: Manifest version doesn't match current MCPB spec

**Fix**: Update `manifest_version` to "0.2" in manifest.json

### "Module not found"

**Cause**: Dependencies not installed

**Fix**: Run `npm install` first

### "Permission denied"

**Cause**: Insufficient permissions to write .mcpb file

**Fix**: 
- Run terminal as administrator (Windows)
- Use `sudo` (macOS/Linux) - though this shouldn't be necessary
- Check directory write permissions

## Advanced: Custom Build Configuration

### Modifying the Build Script (V2)

Edit `package.json` scripts section:

```json
{
  "scripts": {
    "build": "mcpb pack . obsidian-vault-images-mcp-v2.mcpb",
    "validate": "mcpb validate manifest.json",
    "clean": "rm -f *.mcpb"
  }
}
```

Add custom scripts:
- `npm run validate` - Check manifest without building
- `npm run clean` - Remove built .mcpb files

### Environment-Specific Builds

For different environments, you might create multiple manifests:

```bash
# Development build with verbose logging
mcpb pack . obsidian-vault-images-dev.mcpb

# Production build
mcpb pack . obsidian-vault-images-prod.mcpb
```

## Continuous Integration

For automated builds, create a simple CI script:

```yaml
# .github/workflows/build.yml
name: Build Extension

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd extension_v2 && npm install
      - name: Install MCPB
        run: npm install -g @anthropic-ai/mcpb
      - name: Build extension
        run: cd extension_v2 && npm run build
      - name: Upload artifact
        uses: actions/upload-artifact@v2
        with:
          name: mcpb-extension
          path: extension_v2/*.mcpb
```

## Troubleshooting Build Issues

### Build succeeds but extension doesn't work

1. Validate manifest: `mcpb validate manifest.json`
2. Check server code for syntax errors
3. Verify all dependencies are in package.json
4. Test server standalone: `node server/index.js`

### Dependencies not bundled

Ensure dependencies are in `dependencies`, not `devDependencies`:

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  },
  "devDependencies": {
    "@anthropic-ai/mcpb": "^1.0.0"
  }
}
```

### Large build size

The .mcpb file includes all `node_modules`. To reduce size:
- Remove unused dependencies
- Use `npm prune --production`
- Check for duplicate dependencies: `npm dedupe`

## Next Steps

After building:
1. See [INSTALLATION.md](INSTALLATION.md) for installation instructions
2. Test the extension in Claude Desktop
3. Check logs if issues occur
4. Iterate on your changes and rebuild

## Resources

- [MCPB Documentation](https://docs.anthropic.com/claude/docs/extensions)
- [MCP SDK](https://github.com/anthropics/mcp-sdk)
- [Node.js Documentation](https://nodejs.org/docs/)
