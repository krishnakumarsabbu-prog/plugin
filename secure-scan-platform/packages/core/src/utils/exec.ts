import { execSync, ExecSyncOptions } from 'child_process';
import { createLogger } from './logger';

const logger = createLogger('exec');

export interface ExecResult {
  stdout: string;
  stderr: string;
}

export function execCommand(command: string, options?: ExecSyncOptions): ExecResult {
  logger.debug(`Executing command: ${command}`);
  try {
    const stdout = execSync(command, {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
      ...options,
    });
    return { stdout: stdout?.toString().trim() ?? '', stderr: '' };
  } catch (err: unknown) {
    const error = err as { stdout?: Buffer; stderr?: Buffer; message?: string };
    const stderr = error.stderr?.toString().trim() ?? '';
    const stdout = error.stdout?.toString().trim() ?? '';
    logger.error(`Command failed: ${command}`, { stderr, stdout });
    throw err;
  }
}

export function tryExecCommand(command: string, options?: ExecSyncOptions): ExecResult | null {
  try {
    return execCommand(command, options);
  } catch {
    return null;
  }
}
