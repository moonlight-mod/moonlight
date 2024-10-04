import { WebpackModuleFunc, WebpackRequireType } from "../discord";

export interface MoonlightEventEmitter<
  EventId extends string = string,
  EventData = Record<EventId, any>
> {
  dispatchEvent: <Id extends keyof EventData>(
    id: Id,
    data: EventData[Id]
  ) => void;
  addEventListener: <Id extends keyof EventData>(
    id: Id,
    cb: (data: EventData[Id]) => void
  ) => void;
  removeEventListener: <Id extends keyof EventData>(
    id: Id,
    cb: (data: EventData[Id]) => void
  ) => void;
}

export enum EventType {
  ChunkLoad = "chunkLoad",
  ExtensionLoad = "extensionLoad"
}

export type EventPayloads = {
  [EventType.ChunkLoad]: {
    chunkId?: number[];
    modules: { [id: string]: WebpackModuleFunc };
    require?: (require: WebpackRequireType) => any;
  };
  [EventType.ExtensionLoad]: string;
};
