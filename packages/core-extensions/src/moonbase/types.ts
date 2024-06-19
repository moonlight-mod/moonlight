import { DetectedExtension, ExtensionManifest } from "types/src";

export const DangerIconSVG =
  "M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm1.44-15.94L13.06 14a1.06 1.06 0 0 1-2.12 0l-.38-6.94a1 1 0 0 1 1-1.06h.88a1 1 0 0 1 1 1.06Zm-.19 10.69a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z";

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
