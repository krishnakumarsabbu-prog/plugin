import { Finding, Severity, FindingsSummary } from '../../types/findings';
import { CheckmarxRawFinding } from './checkmarxTypes';

function mapSeverity(raw: string): Severity {
  const normalized = raw?.toLowerCase() ?? '';
  switch (normalized) {
    case 'critical': return 'Critical';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return 'Info';
  }
}

export function mapRawFinding(raw: CheckmarxRawFinding): Finding {
  return {
    id: raw.id,
    severity: mapSeverity(raw.severity ?? raw.data.severity),
    title: raw.data.queryName ?? 'Unknown Finding',
    description: raw.data.description ?? '',
    filePath: raw.data.fileName ?? '',
    line: raw.data.line,
    column: raw.data.column,
    ruleId: raw.data.cweId ? `CWE-${raw.data.cweId}` : undefined,
    category: raw.type,
    remediation: raw.data.remediation,
  };
}

export function mapRawFindings(raws: CheckmarxRawFinding[]): Finding[] {
  return raws.map(mapRawFinding);
}

export function computeSummary(findings: Finding[]): FindingsSummary {
  const summary: FindingsSummary = { critical: 0, high: 0, medium: 0, low: 0, info: 0, total: 0 };
  for (const f of findings) {
    switch (f.severity) {
      case 'Critical': summary.critical++; break;
      case 'High': summary.high++; break;
      case 'Medium': summary.medium++; break;
      case 'Low': summary.low++; break;
      case 'Info': summary.info++; break;
    }
    summary.total++;
  }
  return summary;
}
