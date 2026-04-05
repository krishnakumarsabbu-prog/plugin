export const SUPPORTED_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx',
  '.cs', '.java', '.py', '.go',
  '.sql', '.json', '.yaml', '.yml',
  '.xml', '.config', '.properties',
  '.php', '.rb', '.cpp', '.c', '.h',
  '.swift', '.kt', '.rs', '.scala',
]);

export const EXCLUDED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage',
  '.next', 'bin', 'obj', '.cache', '.parcel-cache',
  'vendor', 'target', '__pycache__', '.pytest_cache',
  '.mypy_cache', 'venv', '.venv', 'env', '.env',
]);

export const EXCLUDED_FILES = new Set([
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  'poetry.lock', 'Pipfile.lock', 'composer.lock',
  'Cargo.lock', 'go.sum',
]);

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_FILES_PER_ZIP = 1000;
export const SCAN_POLL_INTERVAL_MS = 5000;
export const SCAN_POLL_TIMEOUT_MS = 30 * 60 * 1000;
export const MCP_SERVER_PORT = 3000;
