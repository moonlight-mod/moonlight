import register from "../../../../registry";

export type LogTrace = {
  name: string;
  time: number;
};
export declare class ActionLog {
  id: number;
  action: string;
  createdAt: Date;
  startTime: number;
  totalTime: number;
  traces: LogTrace[];
  error: Error | null;

  get name(): string;
  toJSON(): {
    actionType: string;
    created_at: Date;
    totalTime: number;
    traces: LogTrace[];
  };

  constructor(action: string);
}
export declare class ActionLogger {
  logs: ActionLog[];
  persist: boolean;

  log(type: string, value: any): ActionLog; // TODO: this function is a mess to decipher as its like a stack of 3 function calls for the parameter
  getSlowestActions(type: string): ActionLog[];
  getLastActionMetrics(type: string): [traceName: string, name: string, time: number][];

  constructor(options: { persist: boolean });
}

type Exports = {
  default: ActionLogger;
};
export default Exports;

register((moonmap) => {
  const name = "discord/packages/flux/LoggingUtils";
  moonmap.register({
    name,
    find: "ActionLog.toJSON: You must complete your logging before calling toJSON",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
