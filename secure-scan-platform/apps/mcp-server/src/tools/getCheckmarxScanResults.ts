import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { CheckmarxClient, createLogger } from '@secure-scan/core';

const logger = createLogger('tool:getCheckmarxScanResults');

const InputSchema = z.object({
  scanId: z.string().min(1, 'scanId is required'),
});

export const getCheckmarxScanResultsTool: Tool = {
  name: 'get_checkmarx_scan_results',
  description: 'Fetches the results of a Checkmarx scan. Returns status and findings when the scan is complete.',
  inputSchema: {
    type: 'object',
    properties: {
      scanId: {
        type: 'string',
        description: 'The Checkmarx scan ID returned by run_checkmarx_scan',
      },
    },
    required: ['scanId'],
  },
};

export async function runGetCheckmarxScanResults(args: Record<string, unknown>): Promise<unknown> {
  const input = InputSchema.parse(args);
  logger.info('Fetching scan results', { scanId: input.scanId });

  const client = new CheckmarxClient();
  const result = await client.getScanResults(input.scanId);

  logger.info(`Scan status: ${result.status}`, { summary: result.summary });
  return result;
}
