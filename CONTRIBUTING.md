# Contributing to Obsidian Vault Images MCP

Thanks for your interest in contributing! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. **Search existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear, descriptive title
   - Detailed description of the problem or feature
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (OS, Claude Desktop version, Node.js version)
   - Relevant logs or error messages

### Suggesting Enhancements

For feature requests:
- Explain the use case and why it's valuable
- Describe the proposed solution
- Consider alternatives you've thought of
- Note any potential downsides or challenges

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to your branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js 18+
- npm
- MCPB CLI: `npm install -g @anthropic-ai/mcpb`
- Claude Desktop for testing

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/obsidian-vault-images-mcp.git
cd obsidian-vault-images-mcp

# Work on V2 (recommended)
cd extension_v2

# Install dependencies
npm install

# Make your changes to server/index.js or manifest.json

# Test locally
node server/index.js --roots "C:\path\to\test\dir"

# Build
npm run build

# Install in Claude Desktop for testing
# (See INSTALLATION.md)
```

### Testing Changes

1. **Manual testing**: Install in Claude Desktop and test interactively
2. **Log checking**: Monitor logs in Claude Desktop logs directory
3. **Edge cases**: Test with:
   - Missing files
   - Large images (>1MB)
   - Different image formats
   - Multiple directories
   - Invalid paths

### Code Style

- Use consistent formatting (2-space indentation)
- Add comments for complex logic
- Use descriptive variable names
- Follow existing code patterns

Example:
```javascript
// Good
const normalizedPath = normalizePath(filePath);

// Avoid
const p = normalizePath(filePath);
```

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows existing style
- [ ] Changes are tested in Claude Desktop
- [ ] Manifest validates: `mcpb validate manifest.json`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in logs
- [ ] Documentation updated if needed

### PR Description

Include:
- **What** changed
- **Why** it changed
- **How** to test it
- **Screenshots** if UI-related
- **Breaking changes** if any

Example:
```markdown
## Changes
- Added support for SVG images
- Updated file extension validation

## Why
Users requested SVG support for diagrams

## Testing
1. Add SVG file to Media directory
2. Ask Claude to display it
3. Verify it renders correctly

## Breaking Changes
None
```

### Review Process

- Maintainer will review your PR
- May request changes or clarification
- Once approved, PR will be merged
- Thanks for contributing! 🎉

## Areas for Contribution

### Good First Issues

- Documentation improvements
- Error message enhancements
- Additional image format support
- Better logging

### Medium Complexity

- Performance optimizations
- Caching mechanisms
- Batch image loading
- Configuration validation

### Advanced

- Auto-detection of wikilinks in notes
- Integration with other Obsidian features
- Cross-platform path handling improvements
- Memory optimization for large vaults

## Documentation

If your changes affect user-facing behavior:

- Update README.md
- Update INSTALLATION.md or BUILDING.md if needed
- Add examples for new features
- Update troubleshooting section if relevant

## Questions?

- Open a discussion on GitHub
- Comment on related issues
- Reach out to maintainers

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Accept criticism gracefully
- Prioritize community health

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing others' private information
- Other unprofessional conduct

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making this project better! 🙏
