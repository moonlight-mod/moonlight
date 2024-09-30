import { DetectedExtension, ExtensionManifest } from "types/src";

export type MoonbaseNatives = {
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
};
