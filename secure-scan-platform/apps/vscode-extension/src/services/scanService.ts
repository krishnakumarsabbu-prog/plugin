export interface ScanResponse {
  success: boolean;
  scan_id: number;
}

export interface ScanOptions {
  projectId?: string;
  overrideProjectSetting?: string;
  isIncremental?: boolean;
  isPublic?: boolean;
  forceScan?: boolean;
  runPostScanOnlyWhenNewResults?: boolean;
  runPostScanMinSeverity?: number;
  authToken?: string;
}

const DEFAULT_SCAN_URL = 'http://localhost:8888/cxrestapi/help/sast/scanWithSettings';

export async function startScan(file: File, options: ScanOptions = {}): Promise<number> {
  const formData = new FormData();
  formData.append('projectId', options.projectId ?? '1');
  formData.append('overrideProjectSetting', options.overrideProjectSetting ?? '1');
  formData.append('isIncremental', String(options.isIncremental ?? false));
  formData.append('isPublic', String(options.isPublic ?? true));
  formData.append('forceScan', String(options.forceScan ?? true));
  formData.append('runPostScanOnlyWhenNewResults', String(options.runPostScanOnlyWhenNewResults ?? false));
  formData.append('runPostScanMinSeverity', String(options.runPostScanMinSeverity ?? 0));
  formData.append('zippedSource', file);

  const headers: Record<string, string> = {};
  if (options.authToken) {
    headers['Authorization'] = `Bearer ${options.authToken}`;
  }

  const response = await fetch(DEFAULT_SCAN_URL, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Scan API returned ${response.status}: ${response.statusText}`);
  }

  const json: ScanResponse = await response.json();

  if (!json.success) {
    throw new Error('Scan API returned success: false');
  }

  return json.scan_id;
}
