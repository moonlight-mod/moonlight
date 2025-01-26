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
  $schema?: string;

  /**
   * A unique identifier for your extension.
   */
  id: string;

  /**
   * A version string for your extension - doesn't need to follow a specific format. Required for publishing.
   */
  version?: string;

  /**
   * The API level this extension targets. If it does not match the current version, the extension will not be loaded.
   */
  apiLevel?: number;

  /**
   * Which environment this extension is capable of running in.
   */
  environment?: ExtensionEnvironment;

  /**
   * Metadata about your extension for use in Moonbase.
   */
  meta?: {
    /**
     * A human friendly name for your extension as a proper noun.
     */
    name?: string;

    /**
     * A short tagline that appears below the name.
     */
    tagline?: string;

    /**
     * A longer description that can use Markdown.
     */
    description?: string;

    /**
     * List of authors that worked on this extension - accepts string or object with ID.
     */
    authors?: ExtensionAuthor[];

    /**
     * A list of tags that are relevant to the extension.
     */
    tags?: ExtensionTag[];

    /**
     * The URL to the source repository.
     */
    source?: string;

    /**
     * A donation link (or other method of support). If you don't want financial contributions, consider putting your favorite charity here!
     */
    donate?: string;

    /**
     * A changelog to show in Moonbase.
     * Moonbase will show the changelog for the latest version, even if it is not installed.
     */
    changelog?: string;

    /**
     * Whether the extension is deprecated and no longer receiving updates.
     */
    deprecated?: boolean;
  };

  /**
   * A list of extension IDs that are required for the extension to load.
   */
  dependencies?: string[];

  /**
   * A list of extension IDs that the user may want to install.
   */
  suggested?: string[];

  /**
   * A list of extension IDs that the extension is incompatible with.
   * If two incompatible extensions are enabled, one of them will not load.
   */
  incompatible?: string[];

  /**
   * A list of settings for your extension, where the key is the settings ID.
   */
  settings?: Record<string, ExtensionSettingsManifest>;

  /**
   * A list of URLs to bypass CORS for.
   * This is implemented by checking if the start of the URL matches.
   * @example https://moonlight-mod.github.io/
   */
  cors?: string[];

  /**
   * A list of URLs to block all requests to.
   * This is implemented by checking if the start of the URL matches.
   * @example https://moonlight-mod.github.io/
   */
  blocked?: string[];

  csp?: Record<string, string[]>;
};

export enum ExtensionEnvironment {
  /**
   * The extension will run on both platforms, the host/native modules MAY be loaded
   */
  Both = "both",

  /**
   * Extension will run on desktop only, the host/native modules are guaranteed to load
   */
  Desktop = "desktop",

  /**
   * Currently equivalent to Both
   */
  Web = "web"
}

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
    style?: string;
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
  hardFail?: boolean; // if any patches fail, all fail
  prerequisite?: () => boolean;
};

export type ExplicitExtensionDependency = {
  ext?: string;
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
  styles?: string[];
};

export type IdentifiedPatch = Patch & {
  ext: string;
  id: number;
};

export type IdentifiedWebpackModule = ExtensionWebpackModule & ExplicitExtensionDependency;
