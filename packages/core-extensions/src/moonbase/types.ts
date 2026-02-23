import type { ExtensionCompat } from "@moonlight-mod/core/extension/loader";
import type { DetectedExtension, ExtensionManifest, MoonlightBranch } from "@moonlight-mod/types";

export type MoonbaseNatives = {
  checkForMoonlightUpdate(): Promise<string | null>;
  updateMoonlight(overrideBranch?: MoonlightBranch): Promise<void>;

  fetchRepositories(repos: string[]): Promise<Record<string, RepositoryManifest[]>>;
  installExtension(manifest: RepositoryManifest, url: string, repo: string): Promise<void>;
  deleteExtension(id: string): Promise<void>;
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
  changelog?: string;
  settingsOverride?: ExtensionManifest["settings"];
};

export enum UpdateState {
  Ready,
  Working,
  Installed,
  Failed
}

// Ordered in terms of priority
export enum RestartAdvice {
  NotNeeded, // No action is needed
  ReloadSuggested, // A reload might be needed
  ReloadNeeded, // A reload is needed
  RestartNeeded // A restart is needed
}
