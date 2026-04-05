import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { CheckmarxClient, createLogger } from '@secure-scan/core';

const logger = createLogger('tool:runCheckmarxScan');

const InputSchema = z.object({
  zipPath: z.string().min(1, 'zipPath is required'),
});

export const runCheckmarxScanTool: Tool = {
  name: 'run_checkmarx_scan',
  description: 'Uploads a ZIP file to Checkmarx and starts a security scan. Returns the scan ID for polling.',
  inputSchema: {
    type: 'object',
    properties: {
      zipPath: {
        type: 'string',
        description: 'Absolute path to the ZIP file to upload and scan',
      },
    },
    required: ['zipPath'],
  },
};

export async function runRunCheckmarxScan(args: Record<string, unknown>): Promise<unknown> {
  const input = InputSchema.parse(args);
  logger.info('Starting Checkmarx scan', { zipPath: input.zipPath });

  const client = new CheckmarxClient();
  const scanId = await client.uploadAndScan(input.zipPath);

  logger.info(`Scan started: ${scanId}`);
  return {
    scanId,
    status: 'queued',
  };
}
