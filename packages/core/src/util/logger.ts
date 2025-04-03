/* eslint-disable no-console -- literally a logging utility :sob: */
import type { Config } from "@moonlight-mod/types";
import { LogLevel } from "@moonlight-mod/types/logger";

const colors = {
  [LogLevel.SILLY]: "#EDD3E9",
  [LogLevel.TRACE]: "#000000",
  [LogLevel.DEBUG]: "#555555",
  [LogLevel.INFO]: "#8686d9",
  [LogLevel.WARN]: "#5454d1",
  [LogLevel.ERROR]: "#FF0000"
};

let maxLevel = LogLevel.INFO;

export default class Logger {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  silly(...args: any[]) {
    this.log(LogLevel.SILLY, args);
  }

  trace(...args: any[]) {
    this.log(LogLevel.TRACE, args);
  }

  debug(...args: any[]) {
    this.log(LogLevel.DEBUG, args);
  }

  info(...args: any[]) {
    this.log(LogLevel.INFO, args);
  }

  warn(...args: any[]) {
    this.log(LogLevel.WARN, args);
  }

  error(...args: any[]) {
    this.log(LogLevel.ERROR, args);
  }

  log(level: LogLevel, obj: any[]) {
    let args = [];
    const logLevel = LogLevel[level].toUpperCase();
    if (maxLevel > level) return;

    if (MOONLIGHT_WEB_PRELOAD || MOONLIGHT_BROWSER) {
      args = [`%c[${logLevel}]`, `background-color: ${colors[level]}; color: #FFFFFF;`, `[${this.name}]`, ...obj];
    }
    else {
      args = [`[${logLevel}]`, `[${this.name}]`, ...obj];
    }

    switch (level) {
      case LogLevel.SILLY:
      case LogLevel.TRACE:
        console.trace(...args);
        break;

      case LogLevel.DEBUG:
        console.debug(...args);
        break;

      case LogLevel.INFO:
        console.info(...args);
        break;

      case LogLevel.WARN:
        console.warn(...args);
        break;

      case LogLevel.ERROR:
        console.error(...args);
        break;
    }
  }
}

export function initLogger(config: Config) {
  if (config.loggerLevel != null) {
    const enumValue = LogLevel[config.loggerLevel.toUpperCase() as keyof typeof LogLevel];
    if (enumValue != null) {
      maxLevel = enumValue;
    }
  }
}
