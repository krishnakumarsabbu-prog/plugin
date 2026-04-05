import * as vscode from 'vscode';
import { ScanCoordinator } from '../services/scanCoordinator';

export function registerScanCommands(context: vscode.ExtensionContext, coordinator: ScanCoordinator): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('secureScan.scanChangedFiles', async () => {
      await coordinator.scanChangedFiles('all');
    }),

    vscode.commands.registerCommand('secureScan.scanStagedFiles', async () => {
      await coordinator.scanChangedFiles('staged');
    }),

    vscode.commands.registerCommand('secureScan.scanCurrentFile', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('Secure Scan: No file is currently open.');
        return;
      }
      await coordinator.scanFile(editor.document.uri.fsPath);
    }),

    vscode.commands.registerCommand('secureScan.scanFolder', async (uri?: vscode.Uri) => {
      const folderUri = uri ?? await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        openLabel: 'Select Folder to Scan',
      }).then(uris => uris?.[0]);

      if (!folderUri) return;
      await coordinator.scanFolder(folderUri.fsPath);
    }),

    vscode.commands.registerCommand('secureScan.scanWorkspace', async () => {
      await coordinator.scanWorkspace();
    }),

    vscode.commands.registerCommand('secureScan.scanThisFile', async (uri?: vscode.Uri) => {
      const fileUri = uri ?? vscode.window.activeTextEditor?.document.uri;
      if (!fileUri) {
        vscode.window.showWarningMessage('Secure Scan: No file selected.');
        return;
      }
      await coordinator.scanFile(fileUri.fsPath);
    }),

    vscode.commands.registerCommand('secureScan.scanThisFolder', async (uri?: vscode.Uri) => {
      if (!uri) return;
      await coordinator.scanFolder(uri.fsPath);
    }),

    vscode.commands.registerCommand('secureScan.scanThisProject', async () => {
      await coordinator.scanWorkspace();
    }),

    vscode.commands.registerCommand('secureScan.openFindings', async () => {
      await vscode.commands.executeCommand('workbench.view.explorer');
      await vscode.commands.executeCommand('secureScan.findingsExplorer.focus');
    }),

    vscode.commands.registerCommand('secureScan.fixFindings', async () => {
      const findings = coordinator.getFindings();
      if (findings.length === 0) {
        vscode.window.showInformationMessage('Secure Scan: No findings to fix. Run a scan first.');
        return;
      }
      vscode.window.showInformationMessage('Secure Scan: Use GitHub Copilot Chat and type "fix the issues" to generate fixes.');
    }),

    vscode.commands.registerCommand('secureScan.fixHighSeverity', async () => {
      vscode.window.showInformationMessage('Secure Scan: Use GitHub Copilot Chat and type "fix high severity issues" to generate fixes.');
    }),

    vscode.commands.registerCommand('secureScan.fixFindingsInFile', async (uri?: vscode.Uri) => {
      const fileUri = uri ?? vscode.window.activeTextEditor?.document.uri;
      if (!fileUri) return;
      vscode.window.showInformationMessage(`Secure Scan: Use Copilot Chat to fix findings in ${fileUri.fsPath}`);
    }),

    vscode.commands.registerCommand('secureScan.refreshFindings', async () => {
      vscode.window.showInformationMessage('Secure Scan: Run a scan to refresh findings.');
    })
  );
}
