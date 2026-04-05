import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import * as path from 'path';
import * as fs from 'fs';
import { createLogger, getRepoRoot, resolveWorkspacePath } from '@secure-scan/core';

const logger = createLogger('tool:getFilesForFindings');

const FindingRefSchema = z.object({
  filePath: z.string(),
});

const InputSchema = z.object({
  findings: z.array(FindingRefSchema).min(1),
  workspaceRoot: z.string().optional(),
});

export const getFilesForFindingsTool: Tool = {
  name: 'get_files_for_findings',
  description: 'Returns the full content of files that contain security findings. Use this before generating fixes.',
  inputSchema: {
    type: 'object',
    properties: {
      findings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            filePath: { type: 'string', description: 'Path of the file with findings' },
          },
          required: ['filePath'],
        },
        description: 'List of findings to get files for',
      },
      workspaceRoot: {
        type: 'string',
        description: 'Workspace root path (auto-detected if not provided)',
      },
    },
    required: ['findings'],
  },
};

export async function runGetFilesForFindings(args: Record<string, unknown>): Promise<unknown> {
  const input = InputSchema.parse(args);
  logger.info('Getting files for findings', { count: input.findings.length });

  const workspaceRoot = input.workspaceRoot ?? getRepoRoot();
  const uniquePaths = [...new Set(input.findings.map(f => f.filePath))];
  const files: Array<{ path: string; content: string }> = [];

  for (const filePath of uniquePaths) {
    try {
      const absolutePath = resolveWorkspacePath(workspaceRoot, filePath);
      const content = fs.readFileSync(absolutePath, 'utf8');
      const relativePath = path.relative(workspaceRoot, absolutePath);
      files.push({ path: relativePath, content });
    } catch (err) {
      logger.warn(`Could not read file: ${filePath}`, { error: String(err) });
    }
  }

  return { files };
}
