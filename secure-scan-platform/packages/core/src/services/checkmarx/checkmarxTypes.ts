export interface CheckmarxAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface CheckmarxUploadResponse {
  uploadUrl: string;
}

export interface CheckmarxScanCreateRequest {
  project: { id: string };
  type: string;
  handler: {
    uploadUrl: string;
  };
  tags?: Record<string, string>;
}

export interface CheckmarxScanResponse {
  id: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CheckmarxRawFinding {
  id: string;
  similarityId?: string;
  type: string;
  data: {
    queryName: string;
    severity: string;
    cweId?: string;
    description?: string;
    fileName?: string;
    line?: number;
    column?: number;
    remediation?: string;
  };
  state?: string;
  severity: string;
}

export interface CheckmarxScanResultsResponse {
  totalCount: number;
  results: CheckmarxRawFinding[];
}

export interface CheckmarxClientConfig {
  baseUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  projectId?: string;
  projectName?: string;
}
