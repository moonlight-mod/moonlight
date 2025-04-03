import type { Config } from "../config";
import type { WebpackModuleFunc, WebpackRequireType } from "../discord";

export interface MoonlightEventEmitter<EventId extends string = string, EventData = Record<EventId, any>> {
  dispatchEvent: <Id extends keyof EventData>(id: Id, data: EventData[Id]) => void;
  addEventListener: <Id extends keyof EventData>(id: Id, cb: (data: EventData[Id]) => void) => void;
  removeEventListener: <Id extends keyof EventData>(id: Id, cb: (data: EventData[Id]) => void) => void;
}

export enum WebEventType {
  ChunkLoad = "chunkLoad",
  ExtensionLoad = "extensionLoad"
}

export interface WebEventPayloads {
  [WebEventType.ChunkLoad]: {
    chunkId?: number[];
    modules: Record<string, WebpackModuleFunc>;
    require?: (require: WebpackRequireType) => any;
  };
  [WebEventType.ExtensionLoad]: string;
}

export enum NodeEventType {
  ConfigSaved = "configSaved"
}

export interface NodeEventPayloads {
  [NodeEventType.ConfigSaved]: Config;
}
