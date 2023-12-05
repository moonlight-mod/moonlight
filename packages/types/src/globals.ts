import { Logger } from "./logger";
import { Config, ConfigExtension } from "./config";
import {
  DetectedExtension,
  IdentifiedPatch,
  ProcessedExtensions
} from "./extension";
import EventEmitter from "events";

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
  enabledExtensions: Set<string>;

  getConfig: (ext: string) => ConfigExtension["config"];
  getConfigOption: <T>(ext: string, name: string) => T | undefined;
  getNatives: (ext: string) => any | undefined;
  getLogger: (id: string) => Logger;
};

export enum MoonlightEnv {
  Injector = "injector",
  NodePreload = "node-preload",
  WebPreload = "web-preload"
}
