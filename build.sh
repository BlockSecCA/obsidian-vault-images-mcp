#!/bin/bash
# Build script for image-viewer MCP extension

set -e

echo "=== Image Viewer MCP Build Script ==="
echo

# Check node
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "Node.js version: $(node --version)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Clean old build
rm -f image-viewer.mcpb

# Validate
echo "Validating manifest..."
npx @anthropic-ai/mcpb validate manifest.json

# Build
echo "Building extension..."
npx @anthropic-ai/mcpb pack . image-viewer.mcpb

# Verify
if [ -f "image-viewer.mcpb" ]; then
    echo
    echo "=== Build successful ==="
    ls -lh image-viewer.mcpb
    echo
    echo "To install: Double-click image-viewer.mcpb or drag into Claude Desktop"
else
    echo "ERROR: Build output not found"
    exit 1
fi
