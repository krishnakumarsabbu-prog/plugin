import * as path from 'path';
import * as fs from 'fs';
import { FileAccessError } from './errors';

export function resolveWorkspacePath(workspaceRoot: string, filePath: string): string {
  const resolved = path.isAbsolute(filePath)
    ? path.resolve(filePath)
    : path.resolve(workspaceRoot, filePath);
  const normalizedRoot = path.resolve(workspaceRoot);
  if (!resolved.startsWith(normalizedRoot + path.sep) && resolved !== normalizedRoot) {
    throw new FileAccessError(
      `Path "${filePath}" resolves outside workspace boundary "${workspaceRoot}"`,
      { resolved, workspaceRoot }
    );
  }
  return resolved;
}

export function toRelativePath(workspaceRoot: string, absolutePath: string): string {
  return path.relative(workspaceRoot, absolutePath);
}

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

export function dirExists(dirPath: string): boolean {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

export function generateTempPath(basePath: string, prefix: string, ext: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return path.join(basePath, `${prefix}-${timestamp}-${random}${ext}`);
}
