import { useMemo } from "react";

export type LogLevel = "debug" | "info" | "warn" | "error" | "none";

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

/**
 * Environment variables for logging configuration:
 *
 * Server-side: LOG_LEVEL - Set the global log level for server components
 * Client-side: NEXT_PUBLIC_LOG_LEVEL - Set the global log level for client components
 * Values: "debug" | "info" | "warn" | "error" | "none"
 * Default: "info"
 *
 * Examples:
 * LOG_LEVEL=debug                    # Server-side: Show all log messages
 * NEXT_PUBLIC_LOG_LEVEL=error        # Client-side: Show only errors
 * NEXT_PUBLIC_LOG_LEVEL=none         # Client-side: Disable all logging
 */

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  enabled?: boolean;
  useClientEnv?: boolean; // If true, use NEXT_PUBLIC_LOG_LEVEL instead of LOG_LEVEL
}

export class ConsoleLogger implements Logger {
  private level: LogLevel;
  private prefix: string;
  private enabled: boolean;
  private logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4,
  };

  constructor(options: LoggerOptions = {}) {
    this.level =
      options.level ??
      (options.useClientEnv
        ? this.getClientLogLevelFromEnv()
        : this.getServerLogLevelFromEnv()) ??
      "info";
    this.prefix = options.prefix ?? "";
    this.enabled = options.enabled ?? true;
  }

  private getLogLevelFromEnv(envVarName: string): LogLevel | null {
    const envLevel = (
      typeof process !== "undefined" ? process.env[envVarName] : undefined
    )?.toLowerCase();

    if (envLevel && this.isValidLogLevel(envLevel)) {
      return envLevel as LogLevel;
    }
    return null;
  }

  private getServerLogLevelFromEnv(): LogLevel | null {
    return this.getLogLevelFromEnv("LOG_LEVEL");
  }

  private getClientLogLevelFromEnv(): LogLevel | null {
    return this.getLogLevelFromEnv("NEXT_PUBLIC_LOG_LEVEL");
  }

  private isValidLogLevel(level: string): boolean {
    return Object.keys(this.logLevels).includes(level);
  }

  private shouldLog(level: LogLevel): boolean {
    return this.enabled && this.logLevels[level] >= this.logLevels[this.level];
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? `[${this.prefix}] ` : "";
    return `${timestamp} ${level.toUpperCase()} ${prefix}${message}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage("info", message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message), ...args);
    }
  }
}

// Silent logger for when you want to disable logging
export class SilentLogger implements Logger {
  debug(): void {
    // no-op
  }
  info(): void {
    // no-op
  }
  warn(): void {
    // no-op
  }
  error(): void {
    // no-op
  }
}

// Factory function to create loggers
export function createLogger(options: LoggerOptions = {}): Logger {
  if (options.enabled === false) {
    return new SilentLogger();
  }
  return new ConsoleLogger(options);
}

// Default logger instance for server-side use
export const logger = createLogger({
  prefix: "HAX",
  useClientEnv: false,
});

// React hook for component-specific logging (for client-side logging)
export function useLogger(componentName?: string): Logger {
  const logger = useMemo(
    () =>
      createLogger({
        prefix: componentName ? `HAX:${componentName}` : "HAX:Component",
        useClientEnv: true,
      }),
    [componentName]
  );
  return logger;
}
