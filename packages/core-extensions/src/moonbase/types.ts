import { ExtensionCompat } from "@moonlight-mod/core/extension/loader";
import { DetectedExtension, ExtensionManifest } from "@moonlight-mod/types";

export type MoonbaseNatives = {
  checkForMoonlightUpdate(): Promise<string | null>;
  fetchRepositories(
    repos: string[]
  ): Promise<Record<string, RepositoryManifest[]>>;
  installExtension(
    manifest: RepositoryManifest,
    url: string,
    repo: string
  ): Promise<void>;
  deleteExtension(id: string): Promise<void>;
  getExtensionConfig(id: string, key: string): any;
};

export type RepositoryManifest = ExtensionManifest & {
  download: string;
};

export enum ExtensionState {
  NotDownloaded,
  Disabled,
  Enabled
}

export type MoonbaseExtension = {
  id: string;
  uniqueId: number;
  manifest: ExtensionManifest | RepositoryManifest;
  source: DetectedExtension["source"];
  state: ExtensionState;
  compat: ExtensionCompat;
  hasUpdate: boolean;
};
