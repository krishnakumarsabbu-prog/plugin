import * as vscode from 'vscode';
import * as path from 'path';
import { Finding } from '@secure-scan/core';

export type TreeItemType = 'severity-group' | 'finding';

export class FindingTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly itemType: TreeItemType,
    public readonly finding?: Finding
  ) {
    super(label, collapsibleState);

    if (itemType === 'finding' && finding) {
      this.description = `${path.basename(finding.filePath)}${finding.line ? `:${finding.line}` : ''}`;
      this.tooltip = finding.description;
      this.iconPath = this.getSeverityIcon(finding.severity);
      this.command = {
        command: 'vscode.open',
        title: 'Open File',
        arguments: [
          vscode.Uri.file(finding.filePath),
          finding.line ? { selection: new vscode.Range(finding.line - 1, 0, finding.line - 1, 0) } : undefined,
        ],
      };
    } else {
      this.iconPath = new vscode.ThemeIcon('shield');
    }
  }

  private getSeverityIcon(severity: string): vscode.ThemeIcon {
    switch (severity) {
      case 'Critical': return new vscode.ThemeIcon('error', new vscode.ThemeColor('charts.red'));
      case 'High': return new vscode.ThemeIcon('warning', new vscode.ThemeColor('charts.orange'));
      case 'Medium': return new vscode.ThemeIcon('info', new vscode.ThemeColor('charts.yellow'));
      case 'Low': return new vscode.ThemeIcon('circle-outline', new vscode.ThemeColor('charts.blue'));
      default: return new vscode.ThemeIcon('circle-filled');
    }
  }
}

export class FindingsTreeProvider implements vscode.TreeDataProvider<FindingTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<FindingTreeItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private findings: Finding[] = [];
  private grouped: Record<string, Finding[]> = {};

  refresh(findings: Finding[]): void {
    this.findings = findings;
    this.grouped = {
      Critical: findings.filter(f => f.severity === 'Critical'),
      High: findings.filter(f => f.severity === 'High'),
      Medium: findings.filter(f => f.severity === 'Medium'),
      Low: findings.filter(f => f.severity === 'Low'),
      Info: findings.filter(f => f.severity === 'Info'),
    };
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: FindingTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FindingTreeItem): FindingTreeItem[] {
    if (!element) {
      const severities = ['Critical', 'High', 'Medium', 'Low', 'Info'];
      return severities
        .filter(sev => (this.grouped[sev]?.length ?? 0) > 0)
        .map(sev => new FindingTreeItem(
          `${sev} (${this.grouped[sev].length})`,
          vscode.TreeItemCollapsibleState.Expanded,
          'severity-group'
        ));
    }

    if (element.itemType === 'severity-group') {
      const severity = element.label.split(' (')[0];
      return (this.grouped[severity] ?? []).map(f =>
        new FindingTreeItem(
          f.title,
          vscode.TreeItemCollapsibleState.None,
          'finding',
          f
        )
      );
    }

    return [];
  }
}
