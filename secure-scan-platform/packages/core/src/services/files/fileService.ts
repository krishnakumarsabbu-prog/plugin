import * as fs from 'fs';
import * as path from 'path';
import { createLogger } from '../../utils/logger';
import { FileAccessError } from '../../utils/errors';
import { resolveWorkspacePath } from '../../utils/paths';
import { SUPPORTED_EXTENSIONS, EXCLUDED_DIRS, EXCLUDED_FILES, MAX_FILE_SIZE_BYTES } from '../../config/constants';
import { FileContent } from '../../types/common';

const logger = createLogger('fileService');

export function readFile(absolutePath: string, workspaceRoot: string): FileContent {
  const resolved = resolveWorkspacePath(workspaceRoot, absolutePath);

  const stat = fs.statSync(resolved);
  if (stat.size > MAX_FILE_SIZE_BYTES) {
    throw new FileAccessError(`File too large to process: ${absolutePath} (${stat.size} bytes)`);
  }

  const content = fs.readFileSync(resolved, 'utf8');
  const relativePath = path.relative(workspaceRoot, resolved);
  return { path: relativePath, content };
}

export function readFiles(absolutePaths: string[], workspaceRoot: string): FileContent[] {
  const results: FileContent[] = [];
  const seen = new Set<string>();

  for (const filePath of absolutePaths) {
    const resolved = path.resolve(filePath);
    if (seen.has(resolved)) continue;
    seen.add(resolved);

    try {
      const fileContent = readFile(resolved, workspaceRoot);
      results.push(fileContent);
    } catch (err) {
      logger.warn(`Skipping file: ${filePath}`, { error: String(err) });
    }
  }

  return results;
}

export function collectSupportedFiles(rootPath: string): string[] {
  const results: string[] = [];

  function walk(currentPath: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch {
      logger.warn(`Cannot read directory: ${currentPath}`);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.has(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        const name = entry.name;
        if (SUPPORTED_EXTENSIONS.has(ext) && !EXCLUDED_FILES.has(name)) {
          try {
            const stat = fs.statSync(fullPath);
            if (stat.size <= MAX_FILE_SIZE_BYTES) {
              results.push(fullPath);
            }
          } catch {
            // skip
          }
        }
      }
    }
  }

  walk(rootPath);
  return results;
}
