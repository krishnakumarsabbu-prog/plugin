export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface Finding {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  filePath: string;
  line?: number;
  column?: number;
  ruleId?: string;
  category?: string;
  remediation?: string;
  externalUrl?: string;
}

export interface FindingsSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  total: number;
}

export interface ScanResult {
  scanId: string;
  status: ScanStatus;
  summary?: FindingsSummary;
  findings?: Finding[];
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
}

export type ScanStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ScanScope {
  type: 'changed' | 'staged' | 'file' | 'folder' | 'workspace';
  paths?: string[];
  workspaceRoot: string;
}
