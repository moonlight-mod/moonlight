import { ExtensionSettingsManifest } from "./config";
import { Snowflake } from "./discord";
import { WebpackModuleFunc } from "./discord/webpack";

export enum ExtensionTag {
  Accessibility = "accessibility",
  Appearance = "appearance",
  Chat = "chat",
  Commands = "commands",
  ContextMenu = "contextMenu",
  DangerZone = "dangerZone",
  Development = "development",
  Fixes = "fixes",
  Fun = "fun",
  Markdown = "markdown",
  Voice = "voice",
  Privacy = "privacy",
  Profiles = "profiles",
  QualityOfLife = "qol",
  Library = "library"
}

export type ExtensionAuthor =
  | string
  | {
      name: string;
      id?: Snowflake;
    };

export type ExtensionManifest = {
  id: string;
  version?: string;

  meta?: {
    name?: string;
    tagline?: string;
    description?: string;
    authors?: ExtensionAuthor[];
    deprecated?: boolean;
    tags?: ExtensionTag[];
    source?: string;
  };

  dependencies?: string[];
  suggested?: string[];
  incompatible?: string[]; // TODO: implement

  settings?: Record<string, ExtensionSettingsManifest>;
  cors?: string[];
};

export enum ExtensionLoadSource {
  Developer,
  Core,
  Normal
}

export type DetectedExtension = {
  id: string;
  manifest: ExtensionManifest;
  source: { type: ExtensionLoadSource; url?: string };
  scripts: {
    web?: string;
    webPath?: string;
    webpackModules?: Record<string, string>;
    nodePath?: string;
    hostPath?: string;
  };
};

export type ProcessedExtensions = {
  extensions: DetectedExtension[];
  dependencyGraph: Map<string, Set<string> | null>;
};

export type PatchMatch = string | RegExp;
export type PatchReplaceFn = (substring: string, ...args: string[]) => string;
export type PatchReplaceModule = (orig: string) => WebpackModuleFunc;

export enum PatchReplaceType {
  Normal,
  Module
}

export type PatchReplace =
  | {
      type?: PatchReplaceType.Normal;
      match: PatchMatch;
      replacement: string | PatchReplaceFn;
    }
  | {
      type: PatchReplaceType.Module;
      replacement: PatchReplaceModule;
    };

export type Patch = {
  find: PatchMatch;
  replace: PatchReplace | PatchReplace[];
  prerequisite?: () => boolean;
};

export type ExplicitExtensionDependency = {
  ext: string;
  id: string;
};

export type ExtensionDependency = string | RegExp | ExplicitExtensionDependency;

export type ExtensionWebpackModule = {
  entrypoint?: boolean;
  dependencies?: ExtensionDependency[];
  run?: WebpackModuleFunc;
};

export type ExtensionWebExports = {
  patches?: Patch[];
  webpackModules?: Record<string, ExtensionWebpackModule>;
};

export type IdentifiedPatch = Patch & {
  ext: string;
  id: number;
};

export type IdentifiedWebpackModule = ExtensionWebpackModule &
  ExplicitExtensionDependency;
