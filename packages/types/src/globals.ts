import type LunAST from "@moonlight-mod/lunast";
import type Moonmap from "@moonlight-mod/moonmap";
import type EventEmitter from "node:events";
import type { Config, ConfigExtension } from "./config";
import type {
  MoonlightEventEmitter,
  NodeEventPayloads,
  NodeEventType,
  WebEventPayloads,
  WebEventType
} from "./core/event";
import type { DetectedExtension, IdentifiedPatch, IdentifiedWebpackModule, ProcessedExtensions } from "./extension";
import type { MoonlightFS } from "./fs";
import type { Logger } from "./logger";

export interface MoonlightHost {
  config: Config;
  extensions: DetectedExtension[];
  processedExtensions: ProcessedExtensions;
  asarPath: string;
  events: EventEmitter;

  version: string;
  branch: MoonlightBranch;

  getConfig: (ext: string) => ConfigExtension["config"];
  getConfigPath: () => Promise<string>;
  getConfigOption: <T>(ext: string, name: string) => T | undefined;
  setConfigOption: <T>(ext: string, name: string, value: T) => void;
  writeConfig: (config: Config) => Promise<void>;

  getLogger: (id: string) => Logger;
  getMoonlightDir: () => string;
  getExtensionDir: (ext: string) => string;
}

export interface MoonlightNode {
  config: Config;
  extensions: DetectedExtension[];
  processedExtensions: ProcessedExtensions;
  nativesCache: Record<string, any>;
  isBrowser: boolean;
  events: MoonlightEventEmitter<NodeEventType, NodeEventPayloads>;

  version: string;
  branch: MoonlightBranch;

  getConfig: (ext: string) => ConfigExtension["config"];
  getConfigOption: <T>(ext: string, name: string) => T | undefined;
  setConfigOption: <T>(ext: string, name: string, value: T) => Promise<void>;
  writeConfig: (config: Config) => Promise<void>;

  getNatives: (ext: string) => any | undefined;
  getLogger: (id: string) => Logger;
  getMoonlightDir: () => string;
  getExtensionDir: (ext: string) => string;
}

export interface MoonlightNodeSandboxed {
  fs: MoonlightFS;
  addCors: (url: string) => void;
  addBlocked: (url: string) => void;
}

export interface MoonlightWeb {
  patched: Map<string, Set<string>>;
  unpatched: Set<IdentifiedPatch>;
  pendingModules: Set<IdentifiedWebpackModule>;
  enabledExtensions: Set<string>;
  events: MoonlightEventEmitter<WebEventType, WebEventPayloads>;
  patchingInternals: {
    onModuleLoad: (moduleId: string | string[], callback: (moduleId: string) => void) => void;
    registerPatch: (patch: IdentifiedPatch) => void;
    registerWebpackModule: (module: IdentifiedWebpackModule) => void;
  };
  localStorage: Storage;

  version: string;
  branch: MoonlightBranch;
  apiLevel: number;

  // Re-exports for ease of use
  getConfig: MoonlightNode["getConfig"];
  getConfigOption: MoonlightNode["getConfigOption"];
  setConfigOption: MoonlightNode["setConfigOption"];
  writeConfig: MoonlightNode["writeConfig"];

  getNatives: (ext: string) => any | undefined;
  getLogger: (id: string) => Logger;

  lunast: LunAST;
  moonmap: Moonmap;
}

export enum MoonlightEnv {
  Injector = "injector",
  NodePreload = "node-preload",
  WebPreload = "web-preload"
}

export enum MoonlightBranch {
  STABLE = "stable",
  NIGHTLY = "nightly",
  DEV = "dev"
}
