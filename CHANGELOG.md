# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Batch image loading
- Auto-detection of wikilinks in notes
- Image caching for performance
- SVG support
- Additional image format support

## [2.0.0] - 2025-10-22

### Added
- V2 implementation with user-configurable directories
- Multi-directory support via Claude Desktop UI
- Directory configuration through settings (no code editing)
- Proper MCP roots protocol implementation
- User-friendly configuration validation
- Build script for easier packaging (`npm run build`)

### Changed
- Moved from hardcoded paths to user configuration
- Updated manifest to version 0.2
- Improved error messages for better user experience
- Enhanced path normalization for Windows compatibility

### Fixed
- Cross-platform path handling
- Case sensitivity issues on Windows
- Directory validation edge cases

## [1.0.0] - 2025-10-21

### Added
- Initial V1 implementation
- Basic image retrieval from Obsidian vault
- Support for PNG, JPG, JPEG, GIF, WEBP formats
- Base64 encoding for image transport
- MCP tool: `get_vault_image`
- Single directory support (hardcoded)

### Features
- Read images from configured Media directory
- Return images as viewable content for Claude
- File size validation (1MB limit)
- Error handling for missing files

### Known Limitations
- Single directory only
- Path hardcoded in manifest
- Requires manifest editing to change directory
- No UI for configuration

## Version Comparison

### V1 vs V2

| Feature | V1 | V2 |
|---------|----|----|
| Directory Configuration | Hardcoded | UI-based |
| Multiple Directories | ❌ | ✅ |
| User-Friendly Setup | ❌ | ✅ |
| Path Editing Required | ✅ | ❌ |
| Manifest Version | 0.1 | 0.2 |
| Roots Protocol | ❌ | ✅ |
| Build Script | Manual | `npm run build` |

## Migration Guide

### V1 to V2

1. Uninstall V1 extension from Claude Desktop
2. Build and install V2 extension
3. Configure directories through settings UI
4. No code changes needed!

## Future Versions

### Potential 2.1.0
- Performance improvements
- Better caching
- Additional image formats
- Improved error messages

### Potential 3.0.0
- Auto-detection of images in notes
- Batch loading capabilities
- Integration with Obsidian graph
- Advanced search features

---

## Release Notes Format

Each release includes:
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

[Unreleased]: https://github.com/YOUR_USERNAME/obsidian-vault-images-mcp/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/YOUR_USERNAME/obsidian-vault-images-mcp/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/YOUR_USERNAME/obsidian-vault-images-mcp/releases/tag/v1.0.0
