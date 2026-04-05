export class SecureScanError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'SecureScanError';
  }
}

export class GitError extends SecureScanError {
  constructor(message: string, details?: unknown) {
    super(message, 'GIT_ERROR', details);
    this.name = 'GitError';
  }
}

export class CheckmarxError extends SecureScanError {
  constructor(message: string, details?: unknown) {
    super(message, 'CHECKMARX_ERROR', details);
    this.name = 'CheckmarxError';
  }
}

export class ZipError extends SecureScanError {
  constructor(message: string, details?: unknown) {
    super(message, 'ZIP_ERROR', details);
    this.name = 'ZipError';
  }
}

export class PatchError extends SecureScanError {
  constructor(message: string, details?: unknown) {
    super(message, 'PATCH_ERROR', details);
    this.name = 'PatchError';
  }
}

export class FileAccessError extends SecureScanError {
  constructor(message: string, details?: unknown) {
    super(message, 'FILE_ACCESS_ERROR', details);
    this.name = 'FileAccessError';
  }
}

export class ValidationError extends SecureScanError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export function isSecureScanError(err: unknown): err is SecureScanError {
  return err instanceof SecureScanError;
}

export function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
