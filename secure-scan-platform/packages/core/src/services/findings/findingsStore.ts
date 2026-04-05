import { Finding, FindingsSummary, ScanResult } from '../../types/findings';
import { computeSummary } from '../checkmarx/checkmarxMapper';
import { createLogger } from '../../utils/logger';

const logger = createLogger('findingsStore');

export class FindingsStore {
  private currentScanResult: ScanResult | null = null;
  private listeners: Array<(result: ScanResult | null) => void> = [];

  setScanResult(result: ScanResult): void {
    this.currentScanResult = result;
    logger.info('Findings updated', { total: result.summary?.total });
    this.notifyListeners();
  }

  clear(): void {
    this.currentScanResult = null;
    this.notifyListeners();
  }

  getCurrentResult(): ScanResult | null {
    return this.currentScanResult;
  }

  getAllFindings(): Finding[] {
    return this.currentScanResult?.findings ?? [];
  }

  getSummary(): FindingsSummary | null {
    return this.currentScanResult?.summary ?? null;
  }

  findingsBySeverity(severity: Finding['severity']): Finding[] {
    return this.getAllFindings().filter(f => f.severity === severity);
  }

  findingsByFile(filePath: string): Finding[] {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return this.getAllFindings().filter(f =>
      f.filePath.replace(/\\/g, '/').endsWith(normalizedPath) ||
      normalizedPath.endsWith(f.filePath.replace(/\\/g, '/'))
    );
  }

  getHighAndCritical(): Finding[] {
    return this.getAllFindings().filter(f => f.severity === 'Critical' || f.severity === 'High');
  }

  groupBySeverity(): Record<Finding['severity'], Finding[]> {
    const result: Record<Finding['severity'], Finding[]> = {
      Critical: [], High: [], Medium: [], Low: [], Info: [],
    };
    for (const finding of this.getAllFindings()) {
      result[finding.severity].push(finding);
    }
    return result;
  }

  onUpdate(listener: (result: ScanResult | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.currentScanResult);
    }
  }
}

export const globalFindingsStore = new FindingsStore();
