# Secure Scan Platform

Enterprise security scanning platform integrating Checkmarx with GitHub Copilot Chat and VS Code.

## What This Is

This monorepo provides two complementary developer security experiences:

- **MCP Server** — registers custom tools for GitHub Copilot Chat so developers can scan code and fix findings using natural language prompts directly inside VS Code
- **VS Code Extension** — provides native IDE UX: right-click scanning, Problems panel diagnostics, Findings explorer sidebar, status bar, and SCM integration
- **Shared Core Package** — all business logic (Git, ZIP, Checkmarx client, patch application) lives here and is reused by both apps

Checkmarx is the **only** scan engine. LLMs are used only for intent detection, explaining findings, and generating fixes after Checkmarx returns results.

## Monorepo Structure

```
secure-scan-platform/
  apps/
    mcp-server/          # MCP server for GitHub Copilot Chat tools
    vscode-extension/    # VS Code companion extension
  packages/
    core/                # Shared business logic, types, services
```

## Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git
- A Checkmarx instance (CxOne / Checkmarx One)

### Install Dependencies

```bash
cd secure-scan-platform
pnpm install
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your Checkmarx credentials:

```env
CHECKMARX_BASE_URL=https://your-instance.checkmarx.net
CHECKMARX_API_KEY=your-api-key
CHECKMARX_PROJECT_NAME=my-project
TEMP_ZIP_DIR=/tmp/checkmarx-scans
LOG_LEVEL=info
```

You can use either `CHECKMARX_API_KEY` (preferred) or `CHECKMARX_USERNAME` + `CHECKMARX_PASSWORD` + `CHECKMARX_CLIENT_SECRET`.

### Build

```bash
pnpm build
```

Or build individually:

```bash
pnpm build:core
pnpm build:mcp
pnpm build:ext
```

## Running the MCP Server

```bash
pnpm dev:mcp
```

The MCP server communicates via stdio and is meant to be launched by GitHub Copilot.

## Running the VS Code Extension

1. Open `apps/vscode-extension` in VS Code
2. Press `F5` to launch the Extension Development Host
3. The extension activates automatically on startup

## Connecting MCP to GitHub Copilot Chat

Create or edit `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "secure-scan": {
      "type": "stdio",
      "command": "node",
      "args": ["path/to/secure-scan-platform/apps/mcp-server/dist/index.js"],
      "env": {
        "CHECKMARX_BASE_URL": "https://your-instance.checkmarx.net",
        "CHECKMARX_API_KEY": "your-api-key"
      }
    }
  }
}
```

Alternatively, add to your VS Code user settings:

```json
{
  "github.copilot.chat.mcpServers": {
    "secure-scan": {
      "command": "node",
      "args": ["path/to/apps/mcp-server/dist/index.js"]
    }
  }
}
```

## Example Copilot Chat Prompts

Once the MCP server is connected, use these prompts in GitHub Copilot Chat:

**Scanning:**
```
scan files
scan staged files
scan current project
scan this folder
scan this file
run checkmarx
```

**Viewing Results:**
```
show findings
what security issues are there
show high severity findings
```

**Fixing:**
```
fix the issues
fix high severity issues
fix findings in this file
generate fixes for the SQL injection findings
```

**Combined workflow:**
```
scan staged files, then show me the high severity findings and suggest fixes
```

## Example VS Code Workflows

### Right-Click Scan (Explorer)

1. Right-click any file → **Scan This File with Checkmarx**
2. Right-click any folder → **Scan This Folder with Checkmarx**
3. Right-click workspace root → **Scan This Project with Checkmarx**

### Command Palette

Press `Ctrl+Shift+P` (or `Cmd+Shift+P`) and type `Secure Scan`:

- `Secure Scan: Scan Changed Files`
- `Secure Scan: Scan Staged Files`
- `Secure Scan: Scan Workspace / Project`
- `Secure Scan: Open Findings`

### Source Control Integration

In the Source Control panel, the toolbar includes:

- **Scan Staged Files** — scans files staged for commit
- **Scan Changed Files** — scans all modified files

### Findings Explorer

After a scan completes:

- Open the Explorer sidebar
- Find **Checkmarx Findings** panel
- Browse findings grouped by severity: Critical, High, Medium, Low, Info
- Click any finding to jump directly to the affected line

### Problems Panel

Findings automatically appear in the **Problems** panel (`Ctrl+Shift+M`) with:

- Critical/High → Error markers (red)
- Medium → Warning markers (yellow)
- Low/Info → Information markers (blue)

Red/yellow squiggles appear inline in affected files.

### Applying Fixes

1. Run a scan to get findings
2. Ask Copilot Chat: `fix the issues` or `fix high severity issues`
3. Copilot uses `get_files_for_findings` and `apply_patch_to_files` tools
4. Review the generated patch
5. Confirm to apply — diagnostics refresh automatically

## MCP Tools Reference

| Tool | Description |
|------|-------------|
| `get_git_changed_files` | Returns staged/unstaged/all changed files from Git |
| `create_checkmarx_zip` | Creates a ZIP archive for Checkmarx upload |
| `run_checkmarx_scan` | Uploads ZIP and starts a Checkmarx scan |
| `get_checkmarx_scan_results` | Polls and returns scan results/findings |
| `get_files_for_findings` | Returns full file contents for impacted files |
| `apply_patch_to_files` | Applies a unified diff patch to workspace files |

## Architecture Decisions

- **No LLM vulnerability detection** — Checkmarx is the sole scan engine
- **Git for scope only** — Git identifies what changed; Checkmarx scans actual file contents
- **Workspace boundary enforcement** — file reads and patch applies are restricted to workspace
- **Input validation** — all MCP tool inputs validated with Zod schemas
- **Shared core** — no business logic duplication between MCP server and VS Code extension

## License

Enterprise Internal — Not for distribution.
