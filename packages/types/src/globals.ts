import type { Logger } from "./logger";
import type { Config, ConfigExtension } from "./config";
import type { DetectedExtension, IdentifiedPatch, IdentifiedWebpackModule, ProcessedExtensions } from "./extension";
import type EventEmitter from "events";
import type LunAST from "@moonlight-mod/lunast";
import type Moonmap from "@moonlight-mod/moonmap";
import type { EventPayloads, EventType, MoonlightEventEmitter } from "./core/event";
import { MoonlightFS } from "./fs";

export type MoonlightHost = {
  asarPath: string;
  config: Config;
  events: EventEmitter;
  extensions: DetectedExtension[];
  processedExtensions: ProcessedExtensions;

  version: string;
  branch: MoonlightBranch;

  getConfig: (ext: string) => ConfigExtension["config"];
  getConfigOption: <T>(ext: string, name: string) => T | undefined;
  getLogger: (id: string) => Logger;
};

export type MoonlightNode = {
  config: Config;
  extensions: DetectedExtension[];
  processedExtensions: ProcessedExtensions;
  nativesCache: Record<string, any>;
  isBrowser: boolean;

  version: string;
  branch: MoonlightBranch;

  getConfig: (ext: string) => ConfigExtension["config"];
  getConfigOption: <T>(ext: string, name: string) => T | undefined;
  setConfigOption: <T>(ext: string, name: string, value: T) => void;

  getNatives: (ext: string) => any | undefined;
  getLogger: (id: string) => Logger;

  getMoonlightDir: () => string;
  getExtensionDir: (ext: string) => string;
  writeConfig: (config: Config) => Promise<void>;
};

export type MoonlightNodeSandboxed = {
  fs: MoonlightFS;
  addCors: (url: string) => void;
  addBlocked: (url: string) => void;
};

export type MoonlightWeb = {
  unpatched: Set<IdentifiedPatch>;
  pendingModules: Set<IdentifiedWebpackModule>;
  enabledExtensions: Set<string>;
  apiLevel: number;
  events: MoonlightEventEmitter<EventType, EventPayloads>;
  patchingInternals: {
    onModuleLoad: (moduleId: string | string[], callback: (moduleId: string) => void) => void;
    registerPatch: (patch: IdentifiedPatch) => void;
    registerWebpackModule: (module: IdentifiedWebpackModule) => void;
  };
  localStorage: Storage;

  version: string;
  branch: MoonlightBranch;

  // Re-exports for ease of use
  getConfig: MoonlightNode["getConfig"];
  getConfigOption: MoonlightNode["getConfigOption"];
  setConfigOption: MoonlightNode["setConfigOption"];

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

export enum MoonlightBranch {
  STABLE = "stable",
  NIGHTLY = "nightly",
  DEV = "dev"
}
