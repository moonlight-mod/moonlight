import type { Logger } from "./logger";
import type { Config, ConfigExtension } from "./config";
import type {
  DetectedExtension,
  IdentifiedPatch,
  IdentifiedWebpackModule,
  ProcessedExtensions
} from "./extension";
import type EventEmitter from "events";
import type LunAST from "@moonlight-mod/lunast";
import type Moonmap from "@moonlight-mod/moonmap";
import { EventPayloads, EventType, MoonlightEventEmitter } from "./core/event";

export type MoonlightHost = {
  asarPath: string;
  config: Config;
  events: EventEmitter;
  extensions: DetectedExtension[];
  processedExtensions: ProcessedExtensions;

  getConfig: (ext: string) => ConfigExtension["config"];
  getConfigOption: <T>(ext: string, name: string) => T | undefined;
  getLogger: (id: string) => Logger;
};

export type MoonlightNode = {
  config: Config;
  extensions: DetectedExtension[];
  processedExtensions: ProcessedExtensions;
  nativesCache: Record<string, any>;

  getConfig: (ext: string) => ConfigExtension["config"];
  getConfigOption: <T>(ext: string, name: string) => T | undefined;
  getNatives: (ext: string) => any | undefined;
  getLogger: (id: string) => Logger;

  getExtensionDir: (ext: string) => string;
  writeConfig: (config: Config) => void;
};

export type MoonlightWeb = {
  unpatched: Set<IdentifiedPatch>;
  pendingModules: Set<IdentifiedWebpackModule>;
  enabledExtensions: Set<string>;
  apiLevel: number;
  events: MoonlightEventEmitter<EventType, EventPayloads>;
  patchingInternals: {
    onModuleLoad: (
      moduleId: string | string[],
      callback: (moduleId: string) => void
    ) => void;
    registerPatch: (patch: IdentifiedPatch) => void;
    registerWebpackModule: (module: IdentifiedWebpackModule) => void;
  };

  getConfig: (ext: string) => ConfigExtension["config"];
  getConfigOption: <T>(ext: string, name: string) => T | undefined;
  getNatives: (ext: string) => any | undefined;
  getLogger: (id: string) => Logger;
  lunast: LunAST;
  moonmap: Moonmap;
};

export enum MoonlightEnv {
  Injector = "injector",
  NodePreload = "node-preload",
  WebPreload = "web-preload"
}
