import * as vscode from 'vscode';
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

  resultsPanel.webview.html = getResultsPanelHtml();

  resultsPanel.webview.onDidReceiveMessage(
    (msg: { type: string; issue?: unknown; data?: unknown }) => {
      switch (msg.type) {
        case 'NEW_SCAN':
          resultsPanel?.dispose();
          openScanPanel(context);
          break;

        case 'ANALYZE_ALL':
          vscode.window.showInformationMessage('CheckmarkX: Use GitHub Copilot Chat to analyze all findings.');
          break;

        case 'FIX_ALL':
          vscode.window.showInformationMessage('CheckmarkX: Use GitHub Copilot Chat to fix all findings.');
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
