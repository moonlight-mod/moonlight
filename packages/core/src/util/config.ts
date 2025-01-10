import type { Config, DetectedExtension, ExtensionManifest } from "@moonlight-mod/types";

export function getManifest(extensions: DetectedExtension[], ext: string) {
  return extensions.find((x) => x.id === ext)?.manifest;
}

export function getConfig(ext: string, config: Config) {
  const val = config.extensions[ext];
  if (val == null || typeof val === "boolean") return undefined;
  return val.config;
}

export function getConfigOption<T>(
  ext: string,
  key: string,
  config: Config,
  settings?: ExtensionManifest["settings"]
): T | undefined {
  const defaultValue: T | undefined = structuredClone(settings?.[key]?.default);
  const cfg = getConfig(ext, config);
  if (cfg == null || typeof cfg === "boolean") return defaultValue;
  return cfg?.[key] ?? defaultValue;
}

export function setConfigOption<T>(config: Config, ext: string, key: string, value: T) {
  const oldConfig = config.extensions[ext];
  const newConfig =
    typeof oldConfig === "boolean"
      ? {
          enabled: oldConfig,
          config: { [key]: value }
        }
      : {
          ...oldConfig,
          config: { ...(oldConfig?.config ?? {}), [key]: value }
        };

  config.extensions[ext] = newConfig;
}
