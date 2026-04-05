import * as vscode from 'vscode';
import * as path from 'path';
import {
  CheckmarxClient,
  getRepoRoot,
  getCurrentBranch,
  getChangedFiles,
  getStagedFileContent,
  collectSupportedFiles,
  createCheckmarxZip,
  globalFindingsStore,
  applyPatch,
  createLogger,
  ScanScope,
  Finding,
} from '@secure-scan/core';
import { StatusBarManager } from '../ui/statusBar';
import { DiagnosticsManager } from '../ui/diagnostics';
import { FindingsTreeProvider } from '../ui/findingsTreeProvider';

const logger = createLogger('scanCoordinator');

export class ScanCoordinator {
  private workspaceRoot: string;
  private client: CheckmarxClient;
  private statusBar: StatusBarManager;
  private diagnostics: DiagnosticsManager;
  private findingsTree: FindingsTreeProvider;

  constructor(
    workspaceRoot: string,
    statusBar: StatusBarManager,
    diagnostics: DiagnosticsManager,
    findingsTree: FindingsTreeProvider
  ) {
    this.workspaceRoot = workspaceRoot;
    this.client = new CheckmarxClient();
    this.statusBar = statusBar;
    this.diagnostics = diagnostics;
    this.findingsTree = findingsTree;
  }

  setWorkspaceRoot(root: string): void {
    this.workspaceRoot = root;
  }

  async scanChangedFiles(mode: 'staged' | 'unstaged' | 'all' = 'all'): Promise<void> {
    await this.runScanFlow(async () => {
      const repoRoot = getRepoRoot(this.workspaceRoot);
      const files = getChangedFiles(repoRoot, mode);

      if (files.length === 0) {
        vscode.window.showInformationMessage('Secure Scan: No changed files found.');
        return null;
      }

      const fileEntries = files.map(f => {
        let content: string | undefined;
        if (mode === 'staged') {
          try {
            content = getStagedFileContent(repoRoot, f.path);
          } catch { /* fall through to disk */ }
        }
        return {
          relativePath: f.path,
          absolutePath: f.absolutePath,
          content,
        };
      });

      return { repoRoot, fileEntries, fileCount: files.length };
    });
  }

  async scanFile(filePath: string): Promise<void> {
    await this.runScanFlow(async () => {
      const repoRoot = getRepoRoot(this.workspaceRoot);
      const relativePath = path.relative(repoRoot, filePath);
      return {
        repoRoot,
        fileEntries: [{ relativePath, absolutePath: filePath }],
        fileCount: 1,
      };
    });
  }

  async scanFolder(folderPath: string): Promise<void> {
    await this.runScanFlow(async () => {
      const repoRoot = getRepoRoot(this.workspaceRoot);
      const files = collectSupportedFiles(folderPath);
      if (files.length === 0) {
        vscode.window.showInformationMessage('Secure Scan: No supported files found in folder.');
        return null;
      }
      const fileEntries = files.map(f => ({
        relativePath: path.relative(repoRoot, f),
        absolutePath: f,
      }));
      return { repoRoot, fileEntries, fileCount: files.length };
    });
  }

  async scanWorkspace(): Promise<void> {
    await this.runScanFlow(async () => {
      const repoRoot = getRepoRoot(this.workspaceRoot);
      const files = collectSupportedFiles(repoRoot);
      if (files.length === 0) {
        vscode.window.showInformationMessage('Secure Scan: No supported files found in workspace.');
        return null;
      }
      const fileEntries = files.map(f => ({
        relativePath: path.relative(repoRoot, f),
        absolutePath: f,
      }));
      return { repoRoot, fileEntries, fileCount: files.length };
    });
  }

  private async runScanFlow(
    buildInput: () => Promise<{ repoRoot: string; fileEntries: Array<{ relativePath: string; absolutePath: string; content?: string }>; fileCount: number } | null>
  ): Promise<void> {
    this.statusBar.setScanning();

    try {
      const input = await buildInput();
      if (!input) {
        this.statusBar.setReady();
        return;
      }

      vscode.window.showInformationMessage(`Secure Scan: Scanning ${input.fileCount} file(s)...`);

      const branch = getCurrentBranch(input.repoRoot);
      const zipResult = await createCheckmarxZip({
        files: input.fileEntries,
        manifest: {
          repoName: path.basename(input.repoRoot),
          branch,
          scanMode: 'all',
          timestamp: new Date().toISOString(),
          files: input.fileEntries.map(f => f.relativePath),
        },
      });

      const scanId = await this.client.uploadAndScan(zipResult.zipPath);
      vscode.window.showInformationMessage(`Secure Scan: Scan started (${scanId}). Polling for results...`);

      const result = await this.pollForResults(scanId);
      globalFindingsStore.setScanResult(result);

      this.diagnostics.updateDiagnostics(result.findings ?? [], this.workspaceRoot);
      this.findingsTree.refresh(result.findings ?? []);

      const summary = result.summary;
      if (summary) {
        this.statusBar.setFindings(summary);
        vscode.window.showInformationMessage(
          `Secure Scan: Completed — ${summary.critical} Critical, ${summary.high} High, ${summary.medium} Medium, ${summary.low} Low`
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error('Scan failed', err);
      this.statusBar.setFailed();
      vscode.window.showErrorMessage(`Secure Scan: ${message}`);
    }
  }

  private async pollForResults(scanId: string): Promise<import('@secure-scan/core').ScanResult> {
    const maxAttempts = 360;
    const intervalMs = 5000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await this.client.getScanResults(scanId);
      if (result.status === 'completed' || result.status === 'failed') {
        return result;
      }
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error('Scan timed out after 30 minutes');
  }

  async applyFix(patch: string): Promise<void> {
    const result = applyPatch(patch, this.workspaceRoot);
    if (result.applied) {
      vscode.window.showInformationMessage(
        `Secure Scan: Fix applied to ${result.filesChanged.join(', ')}`
      );
      this.diagnostics.clearForFiles(result.filesChanged, this.workspaceRoot);
    } else {
      vscode.window.showErrorMessage(
        `Secure Scan: Patch apply failed. ${result.errors?.join('; ') ?? ''}`
      );
    }
  }

  getFindings(): Finding[] {
    return globalFindingsStore.getAllFindings();
  }
}
