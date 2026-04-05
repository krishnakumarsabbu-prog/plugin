import * as vscode from 'vscode';
import { FindingsSummary } from '@secure-scan/core';

export class StatusBarManager implements vscode.Disposable {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this.statusBarItem.command = 'secureScan.openFindings';
    this.statusBarItem.show();
  }

  setReady(): void {
    this.statusBarItem.text = '$(shield) Checkmarx: Ready';
    this.statusBarItem.tooltip = 'Checkmarx Security Scanner — Click to view findings';
    this.statusBarItem.backgroundColor = undefined;
  }

  setScanning(): void {
    this.statusBarItem.text = '$(loading~spin) Checkmarx: Scanning...';
    this.statusBarItem.tooltip = 'Checkmarx scan in progress';
    this.statusBarItem.backgroundColor = undefined;
  }

  setFindings(summary: FindingsSummary): void {
    const hasCritical = summary.critical > 0;
    const hasHigh = summary.high > 0;

    if (hasCritical) {
      this.statusBarItem.text = `$(error) Checkmarx: ${summary.critical} Critical, ${summary.high} High`;
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    } else if (hasHigh) {
      this.statusBarItem.text = `$(warning) Checkmarx: ${summary.high} High`;
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else if (summary.total === 0) {
      this.statusBarItem.text = '$(pass) Checkmarx: Clean';
      this.statusBarItem.backgroundColor = undefined;
    } else {
      this.statusBarItem.text = `$(info) Checkmarx: ${summary.total} Finding(s)`;
      this.statusBarItem.backgroundColor = undefined;
    }

    this.statusBarItem.tooltip = `Critical: ${summary.critical} | High: ${summary.high} | Medium: ${summary.medium} | Low: ${summary.low}`;
  }

  setFailed(): void {
    this.statusBarItem.text = '$(x) Checkmarx: Failed';
    this.statusBarItem.tooltip = 'Checkmarx scan failed — check logs';
    this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}
