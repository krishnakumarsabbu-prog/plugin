import * as vscode from 'vscode';
import { ScanCoordinator } from '../services/scanCoordinator';

export function registerScmActions(context: vscode.ExtensionContext, coordinator: ScanCoordinator): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('secureScan.scm.scanStaged', async () => {
      await coordinator.scanChangedFiles('staged');
    }),
    vscode.commands.registerCommand('secureScan.scm.scanChanged', async () => {
      await coordinator.scanChangedFiles('all');
    })
  );
}
