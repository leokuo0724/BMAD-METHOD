# Knowledge Builder - Installation Guide

## Overview

Knowledge Builder requires the Playwright MCP Server for optimal functionality. This guide walks you through the complete installation process.

## Prerequisites

- Node.js 18+ installed
- Claude Code with MCP support
- Access to npm/npx

## Step 1: Install Knowledge Builder Module

```bash
bmad install knowledge-builder
```

During installation, you'll be prompted to configure:

1. **Translation Language** - Choose your preferred language (繁中/簡中/English/日本語)
2. **Knowledge Base Path** - Where to store your knowledge notes (default: `knowledge-base/`)
3. **Default Template** - Choose note template style (technical-article/tutorial/api-docs/blog-post)
4. **Auto-tagging** - Enable automatic tag generation (recommended: Yes)
5. **Detail Level** - How detailed notes should be (minimal/standard/detailed)
6. **Browser Automation** - Use Playwright for content fetching (recommended: Yes, requires MCP)

## Step 2: Install Playwright MCP Server

### For Claude Desktop

1. Locate your Claude Desktop MCP configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Add the Playwright MCP server configuration:

**Option A: Headless Mode (Recommended for production)**

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-playwright", "--headless"]
    }
  }
}
```

**Option B: Headed Mode (For debugging)**

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-playwright"]
    }
  }
}
```

**Recommendation**: Use headless mode (`--headless` flag) for daily usage to avoid browser windows popping up. Use headed mode only when you need to debug content fetching issues.

If you already have other MCP servers configured, add the `playwright` entry to the existing `mcpServers` object:

```json
{
  "mcpServers": {
    "existing-server": {
      "command": "...",
      "args": ["..."]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-playwright", "--headless"]
    }
  }
}
```

3. **Restart Claude Desktop** to load the new MCP server

### For Claude Code (VS Code Extension)

1. Open VS Code Settings (Cmd/Ctrl + ,)
2. Search for "Claude Code MCP"
3. Edit the MCP configuration JSON
4. Add the Playwright server configuration with `--headless` flag
5. Reload VS Code window

### Advanced Configuration (Optional)

For more control over browser behavior, you can create a configuration file:

**1. Create config file** (`playwright-config.json`):

```json
{
  "browser": {
    "type": "chromium",
    "launchOptions": {
      "headless": true,
      "args": ["--disable-blink-features=AutomationControlled", "--disable-dev-shm-usage"]
    }
  }
}
```

**2. Reference config in MCP settings**:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-playwright", "--config", "/path/to/playwright-config.json"]
    }
  }
}
```

**Available Browser Options**:

- `headless: true/false` - Run browser in headless mode
- `type: "chromium"|"firefox"|"webkit"` - Browser engine to use
- `args: [...]` - Additional browser launch arguments
- Custom viewport, user agent, and other Playwright launch options

### Verify Installation

After restart, check if Playwright MCP is loaded:

```bash
# In Claude Code, look for MCP tools starting with "mcp__playwright"
# You should see tools like:
# - mcp__playwright_navigate
# - mcp__playwright_screenshot
# - mcp__playwright_snapshot
```

## Step 3: Test the Installation

1. Load the Knowledge Curator agent:

   ```
   /bmad:kb:agent:curator
   ```

2. Test digesting an article:

   ```
   /digest https://react.dev/learn
   ```

3. Verify output:
   - Check that the article was fetched successfully
   - Verify technical images were downloaded (if present in article)
   - Confirm knowledge note was saved to your knowledge base path

## Troubleshooting

### Issue: "WebFetch tool not available"

**Solution**: This means Playwright MCP is not loaded. Verify:

1. MCP configuration JSON is correct
2. Claude Desktop/Code was restarted after config change
3. `npx` is accessible in your PATH

### Issue: "Dynamic content not rendering"

**Cause**: Playwright MCP is not available, falling back to simple HTTP fetch

**Solution**:

1. Install Playwright MCP (see Step 2)
2. Or, if intentional, set `use_browser_automation: false` in config

### Issue: "MCP server fails to start"

**Possible causes**:

1. Node.js version too old (need 18+)
2. npx not in PATH
3. Conflicting Playwright installations

**Solution**:

```bash
# Check Node.js version
node --version  # Should be 18.0.0 or higher

# Test npx accessibility
npx --version

# Clear npm cache if needed
npm cache clean --force
```

## Alternative: Without Playwright MCP

If you cannot install Playwright MCP, Knowledge Builder can still work with reduced functionality:

1. During installation, set **Browser Automation** to "No"
2. Or manually edit config:
   ```yaml
   use_browser_automation: false
   ```

**Limitations without Playwright**:

- Cannot fetch JavaScript-rendered content (SPAs, dynamic sites)
- May miss content that loads asynchronously

## Configuration Reference

After installation, your config file will be at:
`.bmad/knowledge-builder/config.yaml`

Key configuration options:

```yaml
# User preferences (set during installation)
translation_language: 'zh-TW' # or "zh-CN", "en", "ja"
knowledge_base_path: '/path/to/kb' # Your knowledge base location
default_template: 'technical-article' # or "tutorial", "api-docs", "blog-post"
auto_tagging: true # Enable automatic tagging
detail_level: 'standard' # or "minimal", "detailed"
use_browser_automation: true # Use Playwright MCP

# Static paths (auto-generated)
module_version: '1.0.0'
data_path: '{project-root}/.bmad/knowledge-builder/data'
templates_path: '{project-root}/.bmad/knowledge-builder/templates'
```

## Next Steps

1. ✅ Module installed
2. ✅ Playwright MCP configured
3. ✅ Configuration customized
4. 📚 Start building your knowledge base!

Try digesting your first article:

```
/bmad:kb:agent:curator
/digest https://your-favorite-tech-blog.com/article
```

## Support

For issues and questions:

- Check the [main README](README.md) for usage examples
- Review the [TODO roadmap](TODO.md) for planned features
- Report bugs via your BMAD issue tracker

---

**Installation Status**: ✅ Complete
**Recommended Setup**: Browser Automation + Image Download
**Module Version**: 1.0.0
