import * as path from 'path';
import * as fs from 'fs';
import { execCommand, tryExecCommand } from '../../utils/exec';
import { GitError } from '../../utils/errors';
import { createLogger } from '../../utils/logger';
import { SUPPORTED_EXTENSIONS, EXCLUDED_DIRS } from '../../config/constants';
import { GitFileStatus, GitRepositoryInfo, GitChangedFilesMode } from './gitTypes';

const logger = createLogger('gitService');

export function getRepoRoot(cwd?: string): string {
  const options = cwd ? { cwd } : undefined;
  const result = tryExecCommand('git rev-parse --show-toplevel', options);
  if (!result) {
    throw new GitError('Not a git repository or git is not available', { cwd });
  }
  return result.stdout;
}

export function getCurrentBranch(repoRoot: string): string {
  try {
    const result = execCommand('git rev-parse --abbrev-ref HEAD', { cwd: repoRoot });
    return result.stdout || 'HEAD';
  } catch {
    return 'HEAD';
  }
}

export function getRepositoryInfo(cwd?: string): GitRepositoryInfo {
  const repoRoot = getRepoRoot(cwd);
  const branch = getCurrentBranch(repoRoot);
  const remoteResult = tryExecCommand('git remote get-url origin', { cwd: repoRoot });
  return {
    repoRoot,
    branch,
    remoteUrl: remoteResult?.stdout,
  };
}

export function getChangedFiles(repoRoot: string, mode: GitChangedFilesMode): GitFileStatus[] {
  const files: GitFileStatus[] = [];

  if (mode === 'staged' || mode === 'all') {
    const result = tryExecCommand('git diff --cached --name-status', { cwd: repoRoot });
    if (result?.stdout) {
      const staged = parseGitStatus(result.stdout, repoRoot, true);
      files.push(...staged);
    }
  }

  if (mode === 'unstaged' || mode === 'all') {
    const result = tryExecCommand('git diff --name-status', { cwd: repoRoot });
    if (result?.stdout) {
      const unstaged = parseGitStatus(result.stdout, repoRoot, false);
      for (const f of unstaged) {
        if (!files.some(existing => existing.path === f.path)) {
          files.push(f);
        }
      }
    }
  }

  return files.filter(f => f.status !== 'D' && SUPPORTED_EXTENSIONS.has(path.extname(f.path)));
}

function parseGitStatus(output: string, repoRoot: string, staged: boolean): GitFileStatus[] {
  return output.split('\n')
    .filter(line => line.trim())
    .map(line => {
      const parts = line.split('\t');
      const status = parts[0]?.trim() ?? 'M';
      const filePath = parts[1]?.trim() ?? parts[0]?.trim() ?? '';
      if (!filePath) return null;
      return {
        path: filePath,
        absolutePath: path.join(repoRoot, filePath),
        status,
        staged,
      };
    })
    .filter((f): f is GitFileStatus => f !== null);
}

export function getStagedFileContent(repoRoot: string, filePath: string): string {
  try {
    const result = execCommand(`git show :${filePath}`, { cwd: repoRoot });
    return result.stdout;
  } catch {
    logger.warn(`Failed to get staged content for ${filePath}, falling back to disk`);
    return fs.readFileSync(path.join(repoRoot, filePath), 'utf8');
  }
}

export function getWorkingTreeFileContent(repoRoot: string, filePath: string): string {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(repoRoot, filePath);
  return fs.readFileSync(absolutePath, 'utf8');
}

export function collectFilesFromFolder(folderPath: string): string[] {
  const results: string[] = [];

  function walk(currentPath: string): void {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.has(entry.name)) {
          walk(entryPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (SUPPORTED_EXTENSIONS.has(ext)) {
          results.push(entryPath);
        }
      }
    }
  }

  walk(folderPath);
  return results;
}
