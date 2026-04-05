import * as vscode from 'vscode';
import * as path from 'path';
import { Finding } from '@secure-scan/core';

export class DiagnosticsManager implements vscode.Disposable {
  private collection: vscode.DiagnosticCollection;

  constructor() {
    this.collection = vscode.languages.createDiagnosticCollection('checkmarx');
  }

  updateDiagnostics(findings: Finding[], workspaceRoot: string): void {
    this.collection.clear();

    const byFile = new Map<string, Finding[]>();
    for (const finding of findings) {
      const absPath = path.isAbsolute(finding.filePath)
        ? finding.filePath
        : path.join(workspaceRoot, finding.filePath);
      const key = absPath;
      if (!byFile.has(key)) byFile.set(key, []);
      byFile.get(key)!.push(finding);
    }

    for (const [absPath, filefindings] of byFile.entries()) {
      const uri = vscode.Uri.file(absPath);
      const diagnostics = filefindings.map(f => this.toDiagnostic(f));
      this.collection.set(uri, diagnostics);
    }
  }

  clearForFiles(filePaths: string[], workspaceRoot: string): void {
    for (const filePath of filePaths) {
      const absPath = path.isAbsolute(filePath)
        ? filePath
        : path.join(workspaceRoot, filePath);
      this.collection.delete(vscode.Uri.file(absPath));
    }
  }

  private toDiagnostic(finding: Finding): vscode.Diagnostic {
    const line = (finding.line ?? 1) - 1;
    const col = (finding.column ?? 1) - 1;
    const range = new vscode.Range(
      new vscode.Position(Math.max(0, line), Math.max(0, col)),
      new vscode.Position(Math.max(0, line), Math.max(0, col) + 100)
    );

    const severity = this.mapSeverity(finding.severity);
    const diagnostic = new vscode.Diagnostic(range, finding.description || finding.title, severity);
    diagnostic.source = 'Checkmarx';
    diagnostic.code = finding.ruleId ?? finding.id;

    return diagnostic;
  }

  private mapSeverity(severity: string): vscode.DiagnosticSeverity {
    switch (severity) {
      case 'Critical':
      case 'High': return vscode.DiagnosticSeverity.Error;
      case 'Medium': return vscode.DiagnosticSeverity.Warning;
      case 'Low':
      case 'Info': return vscode.DiagnosticSeverity.Information;
      default: return vscode.DiagnosticSeverity.Hint;
    }
  }

  dispose(): void {
    this.collection.dispose();
  }
}
