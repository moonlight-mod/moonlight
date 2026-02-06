import register from "../../../registry";

export interface Log {
  delta?: number;
  emoji: string;
  log: string;
  prefix: string;
  timestamp?: number;
}

export interface LogGroup {
  index: number;
  logs: Log[];
  nativeLogs: any[];
  serverTrace: string;
  timestamp: number;
}

export declare class AppStartPerformance {
  addDetail(log: string, value?: number): void;
  addImportLogDetail(): void;
  mark(log: string, delta?: number): void;
  markAndLog(logger: unknown, log: string, delta?: number): void;
  markAt(log: string, time: number): void;
  markWithDelta(log: string): void;
  resumeTracing(): void;
  setServerTrace(trace: string): void;

  /**
   * Times a function and logs the time it took to execute
   * @param label the label of the log entry
   * @param cb the function to time
   * @returns the return value of the function
   */
  time<T>(label: string, cb: () => T): T;

  /**
   * Times an asynchronous function and logs the time it took to execute
   * @param label the label of the log entry
   * @param cb the function to time
   * @returns a promise containing the return value of the function
   */
  timeAsync<T>(label: string, cb: () => Promise<T>): Promise<T>;

  get endTime(): number;
  set endTime(value: number);

  get isTracing(): boolean;

  logs: Log[];
  logGroups: LogGroup[];
  lastImportDuration: number;
  prefix: string;

  constructor();
}

type Exports = {
  default: AppStartPerformance;
};
export default Exports;

register((moonmap) => {
  const name = "discord/common/AppStartPerformance";
  moonmap.register({
    name,
    find: ["markWithDelta", "markAndLog", "markAt"],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
