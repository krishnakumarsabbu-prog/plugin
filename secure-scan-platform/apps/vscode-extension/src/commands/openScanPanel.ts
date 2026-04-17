import * as vscode from 'vscode';
import * as path from 'path';
import { getScanPanelHtml } from '../ui/scanPanelHtml';
import { getResultsPanelHtml } from '../ui/resultsPanelHtml';

let scanPanel: vscode.WebviewPanel | undefined;
let resultsPanel: vscode.WebviewPanel | undefined;

export function registerScanPanelCommand(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('checkmarkx.openPanel', () => {
      openScanPanel(context);
    }),

    vscode.commands.registerCommand('checkmarkx.openResults', () => {
      openResultsPanel(context);
    })
  );
}

function openScanPanel(context: vscode.ExtensionContext): void {
  if (scanPanel) {
    scanPanel.reveal(vscode.ViewColumn.One);
    return;
  }

  scanPanel = vscode.window.createWebviewPanel(
    'checkmarkx.scan',
    'CheckmarkX Scan',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  scanPanel.webview.html = getScanPanelHtml();

  scanPanel.webview.onDidReceiveMessage(
    (msg: { type: string; scanId?: number; message?: string }) => {
      switch (msg.type) {
        case 'SCAN_COMPLETE': {
          const scanId = msg.scanId;
          if (scanId) {
            vscode.window.showInformationMessage(
              `CheckmarkX: Scan completed. Scan ID: ${scanId}`
            );
          }
          openResultsPanel(context, scanId ?? null);
          break;
        }

        case 'ERROR':
          vscode.window.showErrorMessage(`CheckmarkX: ${msg.message}`);
          break;
      }
    },
    undefined,
    context.subscriptions
  );

  scanPanel.onDidDispose(
    () => { scanPanel = undefined; },
    undefined,
    context.subscriptions
  );
}

function openResultsPanel(context: vscode.ExtensionContext, scanId: number | null = null): void {
  if (resultsPanel) {
    resultsPanel.reveal(vscode.ViewColumn.One);
    if (scanId) {
      resultsPanel.webview.postMessage({ type: 'SET_SCAN_ID', scanId });
    }
    return;
  }

  resultsPanel = vscode.window.createWebviewPanel(
    'checkmarkx.results',
    'CheckmarkX Results',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  resultsPanel.webview.html = getResultsPanelHtml(scanId);

  resultsPanel.webview.onDidReceiveMessage(
    async (msg: {
      type: string;
      issue?: unknown;
      data?: unknown;
      file?: string;
      line?: number;
      payload?: {
        fileName: string;
        code: string;
        vulnerability: string;
        description: string;
        cwe?: string;
        severity?: string;
        nodes?: unknown[];
      };
    }) => {
      switch (msg.type) {
        case 'NEW_SCAN':
          resultsPanel?.dispose();
          openScanPanel(context);
          break;

        case 'OPEN_FILE':
          await handleOpenFile(msg.file, msg.line);
          break;

        case 'COPILOT_FIX':
          await handleCopilotFix(msg.payload);
          break;

        case 'ANALYZE_ALL':
          vscode.window.showInformationMessage('CheckmarkX: Use GitHub Copilot Chat to analyze all findings.');
          break;

        case 'FIX_ALL':
          vscode.window.showInformationMessage('CheckmarkX: Use GitHub Copilot Chat and type "fix all security issues" to fix findings.');
          break;

        case 'ANALYZE_SELECTED':
          vscode.window.showInformationMessage('CheckmarkX: Use GitHub Copilot Chat to analyze selected findings.');
          break;

        case 'FIX_SELECTED':
          vscode.window.showInformationMessage('CheckmarkX: Use GitHub Copilot Chat to fix selected findings.');
          break;

        case 'ANALYZE_ISSUE':
          vscode.window.showInformationMessage('CheckmarkX: Opening Copilot analysis for this issue.');
          break;

        case 'FIX_ISSUE':
          vscode.window.showInformationMessage('CheckmarkX: Applying fix via Copilot.');
          break;

        case 'EXPORT_REPORT':
          vscode.window.showInformationMessage('CheckmarkX: Exporting report...');
          break;
      }
    },
    undefined,
    context.subscriptions
  );

  resultsPanel.onDidDispose(
    () => { resultsPanel = undefined; },
    undefined,
    context.subscriptions
  );
}

async function handleOpenFile(file?: string, line?: number): Promise<void> {
  if (!file) {
    vscode.window.showWarningMessage('CheckmarkX: No file path available for this finding.');
    return;
  }

  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    let uri: vscode.Uri | undefined;

    if (workspaceFolders && workspaceFolders.length > 0) {
      for (const folder of workspaceFolders) {
        const candidate = vscode.Uri.joinPath(folder.uri, file);
        try {
          await vscode.workspace.fs.stat(candidate);
          uri = candidate;
          break;
        } catch {
          // not found in this workspace root
        }
      }
    }

    if (!uri) {
      if (path.isAbsolute(file)) {
        uri = vscode.Uri.file(file);
      } else if (workspaceFolders && workspaceFolders.length > 0) {
        uri = vscode.Uri.joinPath(workspaceFolders[0].uri, file);
      }
    }

    if (!uri) {
      vscode.window.showWarningMessage(`CheckmarkX: Cannot resolve file: ${file}`);
      return;
    }

    const doc = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);

    if (line && line > 0) {
      const targetLine = Math.max(0, line - 1);
      const range = new vscode.Range(targetLine, 0, targetLine, 0);
      editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
      editor.selection = new vscode.Selection(targetLine, 0, targetLine, 0);
    }
  } catch (err) {
    vscode.window.showErrorMessage(`CheckmarkX: Failed to open file "${file}". ${err}`);
  }
}

async function handleCopilotFix(payload?: {
  fileName: string;
  code: string;
  vulnerability: string;
  description: string;
  cwe?: string;
  severity?: string;
  nodes?: unknown[];
}): Promise<void> {
  if (!payload) {
    vscode.window.showWarningMessage('CheckmarkX: No fix payload available.');
    return;
  }

  const { fileName, code, vulnerability, description, cwe, severity } = payload;

  await handleOpenFile(fileName, undefined);

  const cweRef = cwe ? ` (CWE-${cwe})` : '';
  const sevInfo = severity ? ` [Severity: ${severity}]` : '';
  const prompt = [
    `Fix this ${vulnerability}${cweRef} vulnerability${sevInfo}.`,
    description ? `\n\nContext: ${description}` : '',
    code ? `\n\nVulnerable code:\n\`\`\`\n${code}\n\`\`\`` : '',
    '\n\nPlease provide a secure fix with explanation.'
  ].join('');

  await vscode.env.clipboard.writeText(prompt);

  const action = await vscode.window.showInformationMessage(
    `CheckmarkX: Fix prompt for "${vulnerability}${cweRef}" copied to clipboard. Open Copilot Chat and paste it.`,
    'Open Copilot Chat'
  );

  if (action === 'Open Copilot Chat') {
    vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus');
  }
}
