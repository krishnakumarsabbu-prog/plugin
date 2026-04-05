import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import {
  getRepoRoot,
  getCurrentBranch,
  getChangedFiles,
  createLogger,
  GitError,
} from '@secure-scan/core';

const logger = createLogger('tool:getGitChangedFiles');

const InputSchema = z.object({
  mode: z.enum(['staged', 'unstaged', 'all']).default('all'),
  cwd: z.string().optional(),
});

export const getGitChangedFilesTool: Tool = {
  name: 'get_git_changed_files',
  description: 'Returns changed files from the current Git repository. Use this before scanning to identify which files have changed.',
  inputSchema: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        enum: ['staged', 'unstaged', 'all'],
        description: 'Which files to return: staged, unstaged, or all changed files',
        default: 'all',
      },
      cwd: {
        type: 'string',
        description: 'Working directory (defaults to current directory)',
      },
    },
    required: [],
  },
};

export async function runGetGitChangedFiles(args: Record<string, unknown>): Promise<unknown> {
  const input = InputSchema.parse(args);
  logger.info('Getting git changed files', { mode: input.mode });

  let repoRoot: string;
  try {
    repoRoot = getRepoRoot(input.cwd);
  } catch (err) {
    throw new GitError('No git repository found in the current workspace');
  }

  const branch = getCurrentBranch(repoRoot);
  const files = getChangedFiles(repoRoot, input.mode);

  logger.info(`Found ${files.length} changed files`);
  return {
    repoRoot,
    branch,
    files,
  };
}
