import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { applyPatch, getRepoRoot, createLogger } from '@secure-scan/core';

const logger = createLogger('tool:applyPatchToFiles');

const InputSchema = z.object({
  patch: z.string().min(1, 'patch is required'),
  workspaceRoot: z.string().optional(),
});

export const applyPatchToFilesTool: Tool = {
  name: 'apply_patch_to_files',
  description: 'Applies a unified diff patch to workspace files. Use this after Copilot generates fixes.',
  inputSchema: {
    type: 'object',
    properties: {
      patch: {
        type: 'string',
        description: 'Unified diff patch string to apply to workspace files',
      },
      workspaceRoot: {
        type: 'string',
        description: 'Workspace root path (auto-detected if not provided)',
      },
    },
    required: ['patch'],
  },
};

export async function runApplyPatchToFiles(args: Record<string, unknown>): Promise<unknown> {
  const input = InputSchema.parse(args);
  logger.info('Applying patch to workspace files');

  const workspaceRoot = input.workspaceRoot ?? getRepoRoot();
  const result = applyPatch(input.patch, workspaceRoot);

  logger.info(`Patch applied`, { filesChanged: result.filesChanged });
  return result;
}
