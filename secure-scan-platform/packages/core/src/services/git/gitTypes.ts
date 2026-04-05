export interface GitFileStatus {
  path: string;
  absolutePath: string;
  status: string;
  staged: boolean;
}

export interface GitRepositoryInfo {
  repoRoot: string;
  branch: string;
  remoteName?: string;
  remoteUrl?: string;
}

export type GitChangedFilesMode = 'staged' | 'unstaged' | 'all';
