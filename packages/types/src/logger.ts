export enum LogLevel {
  SILLY,
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR
}

type LogFunc = (...args: any[]) => void;

export type Logger = {
  silly: LogFunc;
  trace: LogFunc;
  debug: LogFunc;
  info: LogFunc;
  warn: LogFunc;
  error: LogFunc;
  log: (level: LogLevel, args: any[]) => void;
};
