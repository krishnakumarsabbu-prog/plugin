import * as vscode from 'vscode';
import { StatusBarManager } from './ui/statusBar';
import { DiagnosticsManager } from './ui/diagnostics';
import { FindingsTreeProvider } from './ui/findingsTreeProvider';
import { ScanCoordinator } from './services/scanCoordinator';
import { registerScanCommands } from './commands/scanChangedFiles';
import { registerScmActions } from './scm/scmActions';

let scanCoordinator: ScanCoordinator;
let statusBar: StatusBarManager;
let diagnosticsManager: DiagnosticsManager;
let findingsTree: FindingsTreeProvider;

export function activate(context: vscode.ExtensionContext): void {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();

  statusBar = new StatusBarManager();
  diagnosticsManager = new DiagnosticsManager();
  findingsTree = new FindingsTreeProvider();
  scanCoordinator = new ScanCoordinator(workspaceRoot, statusBar, diagnosticsManager, findingsTree);

  const treeView = vscode.window.createTreeView('secureScan.findingsExplorer', {
    treeDataProvider: findingsTree,
    showCollapseAll: true,
  });

  registerScanCommands(context, scanCoordinator);
  registerScmActions(context, scanCoordinator);

  context.subscriptions.push(
    treeView,
    statusBar,
    diagnosticsManager,
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      const newRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (newRoot) scanCoordinator.setWorkspaceRoot(newRoot);
    })
  );

  statusBar.setReady();
}

export function deactivate(): void {
  diagnosticsManager?.dispose();
  statusBar?.dispose();
}
