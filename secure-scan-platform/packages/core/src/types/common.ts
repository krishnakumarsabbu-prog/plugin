export interface GitFileInfo {
  path: string;
  absolutePath: string;
  status: string;
  staged: boolean;
}

export interface GitInfo {
  repoRoot: string;
  branch: string;
  files: GitFileInfo[];
}

export interface ZipResult {
  zipPath: string;
  fileCount: number;
  manifestPath: string;
}

export interface PatchResult {
  applied: boolean;
  filesChanged: string[];
  errors?: string[];
}

export interface FileContent {
  path: string;
  content: string;
}

export type ScanMode = 'staged' | 'unstaged' | 'all';
