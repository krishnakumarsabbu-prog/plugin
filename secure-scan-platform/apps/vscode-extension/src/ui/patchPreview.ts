import * as vscode from 'vscode';
import * as path from 'path';
import { ScanCoordinator } from '../services/scanCoordinator';

export async function showPatchPreviewAndApply(
  patch: string,
  coordinator: ScanCoordinator,
  context: vscode.ExtensionContext
): Promise<void> {
  const doc = await vscode.workspace.openTextDocument({
    content: patch,
    language: 'diff',
  });

  await vscode.window.showTextDocument(doc, { preview: true });

  const answer = await vscode.window.showInformationMessage(
    'Secure Scan: Review the patch above. Apply these changes?',
    { modal: false },
    'Apply',
    'Reject'
  );

  if (answer === 'Apply') {
    await coordinator.applyFix(patch);
  } else {
    vscode.window.showInformationMessage('Secure Scan: Patch rejected.');
  }
}
