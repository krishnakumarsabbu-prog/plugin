import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import * as path from 'path';
import {
  createCheckmarxZip,
  getRepoRoot,
  getCurrentBranch,
  getStagedFileContent,
  getWorkingTreeFileContent,
  createLogger,
} from '@secure-scan/core';

const logger = createLogger('tool:createCheckmarxZip');

const InputSchema = z.object({
  files: z.array(z.string()).min(1, 'At least one file is required'),
  mode: z.enum(['staged', 'unstaged', 'all']).default('all'),
  repoRoot: z.string().optional(),
});

export const createCheckmarxZipTool: Tool = {
  name: 'create_checkmarx_zip',
  description: 'Creates a ZIP archive of the specified files for Checkmarx scanning. Returns the path to the ZIP file.',
  inputSchema: {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of file paths (relative to repo root) to include in the ZIP',
      },
      mode: {
        type: 'string',
        enum: ['staged', 'unstaged', 'all'],
        description: 'Determines how to read file content: staged reads from git index, unstaged reads from disk',
        default: 'all',
      },
      repoRoot: {
        type: 'string',
        description: 'Repository root path (auto-detected if not provided)',
      },
    },
    required: ['files'],
  },
};

export async function runCreateCheckmarxZip(args: Record<string, unknown>): Promise<unknown> {
  const input = InputSchema.parse(args);
  logger.info('Creating Checkmarx ZIP', { fileCount: input.files.length, mode: input.mode });

  const repoRoot = input.repoRoot ?? getRepoRoot();
  const branch = getCurrentBranch(repoRoot);

  const fileEntries = input.files.map(filePath => {
    const relativePath = path.isAbsolute(filePath)
      ? path.relative(repoRoot, filePath)
      : filePath;
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(repoRoot, filePath);

    let content: string | undefined;
    if (input.mode === 'staged') {
      try {
        content = getStagedFileContent(repoRoot, relativePath);
      } catch {
        logger.warn(`Failed to get staged content for ${relativePath}, reading from disk`);
      }
    }

    return { relativePath, absolutePath, content };
  });

  const result = await createCheckmarxZip({
    files: fileEntries,
    manifest: {
      repoName: path.basename(repoRoot),
      branch,
      scanMode: input.mode,
      timestamp: new Date().toISOString(),
      files: input.files,
    },
  });

  logger.info(`ZIP created: ${result.zipPath}`);
  return result;
}
