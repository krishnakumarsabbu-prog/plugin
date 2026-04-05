import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface EnvConfig {
  checkmarx: {
    baseUrl: string;
    apiKey: string;
    username: string;
    password: string;
    clientId: string;
    clientSecret: string;
    projectId: string;
    projectName: string;
  };
  tempZipDir: string;
  logLevel: string;
  workspaceRoot: string;
}

export function loadEnvConfig(): EnvConfig {
  return {
    checkmarx: {
      baseUrl: process.env.CHECKMARX_BASE_URL ?? '',
      apiKey: process.env.CHECKMARX_API_KEY ?? '',
      username: process.env.CHECKMARX_USERNAME ?? '',
      password: process.env.CHECKMARX_PASSWORD ?? '',
      clientId: process.env.CHECKMARX_CLIENT_ID ?? 'resource_owner_client',
      clientSecret: process.env.CHECKMARX_CLIENT_SECRET ?? '',
      projectId: process.env.CHECKMARX_PROJECT_ID ?? '',
      projectName: process.env.CHECKMARX_PROJECT_NAME ?? 'default-project',
    },
    tempZipDir: process.env.TEMP_ZIP_DIR ?? '/tmp/checkmarx-scans',
    logLevel: process.env.LOG_LEVEL ?? 'info',
    workspaceRoot: process.env.WORKSPACE_ROOT ?? process.cwd(),
  };
}

export const envConfig = loadEnvConfig();
