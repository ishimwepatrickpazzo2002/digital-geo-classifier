type LogLevel = 'info' | 'error' | 'warn' | 'debug';

const getTimestamp = (): string => new Date().toISOString();

const log = (level: LogLevel, message: string, data?: unknown): void => {
  const timestamp = getTimestamp();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
};

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  debug: (message: string, data?: unknown) => log('debug', message, data),
};
