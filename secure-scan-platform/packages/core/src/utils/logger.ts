export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let configuredLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'info';

export function setLogLevel(level: LogLevel): void {
  configuredLevel = level;
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[configuredLevel];
}

function formatMessage(level: LogLevel, context: string, message: string, data?: unknown): string {
  const ts = new Date().toISOString();
  const dataStr = data !== undefined ? ` ${JSON.stringify(data)}` : '';
  return `[${ts}] [${level.toUpperCase()}] [${context}] ${message}${dataStr}`;
}

export interface Logger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, data?: unknown): void;
}

export function createLogger(context: string): Logger {
  return {
    debug(message, data) {
      if (shouldLog('debug')) console.debug(formatMessage('debug', context, message, data));
    },
    info(message, data) {
      if (shouldLog('info')) console.info(formatMessage('info', context, message, data));
    },
    warn(message, data) {
      if (shouldLog('warn')) console.warn(formatMessage('warn', context, message, data));
    },
    error(message, data) {
      if (shouldLog('error')) console.error(formatMessage('error', context, message, data));
    },
  };
}
