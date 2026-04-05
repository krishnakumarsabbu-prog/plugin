import * as fs from 'fs';
import { createLogger } from '../../utils/logger';
import { CheckmarxError } from '../../utils/errors';
import {
  CheckmarxClientConfig,
  CheckmarxAuthResponse,
  CheckmarxScanResponse,
  CheckmarxScanResultsResponse,
} from './checkmarxTypes';
import { mapRawFindings, computeSummary } from './checkmarxMapper';
import { ScanResult, ScanStatus } from '../../types/findings';
import { envConfig } from '../../config/env';

const logger = createLogger('checkmarxClient');

export class CheckmarxClient {
  private config: CheckmarxClientConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config?: Partial<CheckmarxClientConfig>) {
    this.config = {
      baseUrl: config?.baseUrl ?? envConfig.checkmarx.baseUrl,
      apiKey: config?.apiKey ?? envConfig.checkmarx.apiKey,
      username: config?.username ?? envConfig.checkmarx.username,
      password: config?.password ?? envConfig.checkmarx.password,
      clientId: config?.clientId ?? envConfig.checkmarx.clientId,
      clientSecret: config?.clientSecret ?? envConfig.checkmarx.clientSecret,
      projectId: config?.projectId ?? envConfig.checkmarx.projectId,
      projectName: config?.projectName ?? envConfig.checkmarx.projectName,
    };
  }

  private async authenticate(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (this.config.apiKey) {
      this.accessToken = this.config.apiKey;
      this.tokenExpiry = Date.now() + 3600 * 1000;
      return this.accessToken;
    }

    logger.info('Authenticating with Checkmarx');
    const params = new URLSearchParams({
      grant_type: 'password',
      client_id: this.config.clientId ?? 'resource_owner_client',
      client_secret: this.config.clientSecret ?? '',
      username: this.config.username ?? '',
      password: this.config.password ?? '',
    });

    const response = await fetch(`${this.config.baseUrl}/auth/realms/organization/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new CheckmarxError(`Authentication failed: ${response.status}`, { status: response.status, body: text });
    }

    const data = (await response.json()) as CheckmarxAuthResponse;
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    logger.info('Checkmarx authentication successful');
    return this.accessToken;
  }

  private async request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    const token = await this.authenticate();
    const url = `${this.config.baseUrl}/api${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json; version=1.0',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new CheckmarxError(`API request failed: ${method} ${endpoint} → ${response.status}`, {
        status: response.status,
        body: text,
      });
    }

    return response.json() as Promise<T>;
  }

  async uploadZip(zipPath: string): Promise<string> {
    logger.info(`Uploading ZIP: ${zipPath}`);

    const uploadResponse = await this.request<{ uploadUrl: string }>('POST', '/uploads');
    const uploadUrl = uploadResponse.uploadUrl;

    const zipBuffer = fs.readFileSync(zipPath);
    const putResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/zip' },
      body: zipBuffer,
    });

    if (!putResponse.ok) {
      throw new CheckmarxError(`ZIP upload failed: ${putResponse.status}`);
    }

    logger.info('ZIP uploaded successfully');
    return uploadUrl;
  }

  async createScan(uploadUrl: string): Promise<string> {
    logger.info('Creating Checkmarx scan');

    const projectId = await this.ensureProject();
    const scanResponse = await this.request<CheckmarxScanResponse>('POST', '/scans', {
      project: { id: projectId },
      type: 'upload',
      handler: { uploadUrl },
      config: [
        {
          type: 'sca',
          value: { enableExploitablePath: 'false' },
        },
        {
          type: 'sast',
          value: { presetName: 'Checkmarx Default' },
        },
      ],
      tags: {
        initiatedBy: 'secure-scan-platform',
        timestamp: new Date().toISOString(),
      },
    });

    logger.info(`Scan created: ${scanResponse.id}`);
    return scanResponse.id;
  }

  private async ensureProject(): Promise<string> {
    if (this.config.projectId) return this.config.projectId;

    const projectName = this.config.projectName ?? 'secure-scan-project';
    const existing = await this.request<{ projects: Array<{ id: string; name: string }> }>(
      'GET', `/projects?name=${encodeURIComponent(projectName)}`
    );

    if (existing.projects?.length > 0) {
      return existing.projects[0].id;
    }

    const created = await this.request<{ id: string }>('POST', '/projects', { name: projectName });
    return created.id;
  }

  async getScanStatus(scanId: string): Promise<ScanStatus> {
    const scan = await this.request<CheckmarxScanResponse>('GET', `/scans/${scanId}`);
    return this.mapScanStatus(scan.status);
  }

  async getScanResults(scanId: string): Promise<ScanResult> {
    const scan = await this.request<CheckmarxScanResponse>('GET', `/scans/${scanId}`);
    const status = this.mapScanStatus(scan.status);

    if (status !== 'completed') {
      return { scanId, status };
    }

    const resultsResponse = await this.request<CheckmarxScanResultsResponse>(
      'GET', `/results?scan-id=${scanId}&limit=10000`
    );

    const findings = mapRawFindings(resultsResponse.results ?? []);
    const summary = computeSummary(findings);

    return {
      scanId,
      status: 'completed',
      summary,
      findings,
      completedAt: new Date(),
    };
  }

  async uploadAndScan(zipPath: string): Promise<string> {
    const uploadUrl = await this.uploadZip(zipPath);
    return this.createScan(uploadUrl);
  }

  private mapScanStatus(status: string): ScanStatus {
    switch (status?.toLowerCase()) {
      case 'queued':
      case 'created': return 'queued';
      case 'running': return 'running';
      case 'completed': return 'completed';
      case 'failed': return 'failed';
      case 'canceled':
      case 'cancelled': return 'cancelled';
      default: return 'running';
    }
  }
}

export const defaultCheckmarxClient = new CheckmarxClient();
