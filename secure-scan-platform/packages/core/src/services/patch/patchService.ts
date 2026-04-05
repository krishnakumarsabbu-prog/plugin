import * as path from 'path';
import * as fs from 'fs';
import * as Diff from 'diff';
import { createLogger } from '../../utils/logger';
import { PatchError } from '../../utils/errors';
import { resolveWorkspacePath } from '../../utils/paths';
import { PatchResult } from '../../types/common';

const logger = createLogger('patchService');

export function validatePatch(patch: string): boolean {
  return (
    typeof patch === 'string' &&
    patch.trim().length > 0 &&
    (patch.includes('--- ') || patch.includes('+++ ') || patch.includes('diff --git'))
  );
}

export function applyPatch(patch: string, workspaceRoot: string): PatchResult {
  if (!validatePatch(patch)) {
    throw new PatchError('Invalid patch format');
  }

  const changedFiles: string[] = [];
  const errors: string[] = [];

  const patches = Diff.parsePatch(patch);
  logger.info(`Applying patch with ${patches.length} file(s)`);

  for (const filePatch of patches) {
    const rawPath = filePatch.newFileName ?? filePatch.oldFileName ?? '';
    const cleanPath = rawPath.replace(/^[ab]\//, '');

    if (!cleanPath) {
      errors.push('Patch contains entry with no file path');
      continue;
    }

    let absolutePath: string;
    try {
      absolutePath = resolveWorkspacePath(workspaceRoot, cleanPath);
    } catch (err) {
      errors.push(`Path outside workspace: ${cleanPath}`);
      logger.warn(`Rejected patch for out-of-workspace path: ${cleanPath}`);
      continue;
    }

    let originalContent = '';
    if (fs.existsSync(absolutePath)) {
      originalContent = fs.readFileSync(absolutePath, 'utf8');
    }

    const patchedContent = Diff.applyPatch(originalContent, filePatch);
    if (patchedContent === false) {
      errors.push(`Failed to apply patch to: ${cleanPath}`);
      logger.error(`Patch apply failed for: ${cleanPath}`);
      continue;
    }

    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(absolutePath, patchedContent, 'utf8');
    changedFiles.push(cleanPath);
    logger.info(`Patched: ${cleanPath}`);
  }

  return {
    applied: changedFiles.length > 0 && errors.length === 0,
    filesChanged: changedFiles,
    errors: errors.length > 0 ? errors : undefined,
  };
}
