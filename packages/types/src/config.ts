export type Config = {
  extensions: ConfigExtensions;
  repositories: string[];
  devSearchPaths?: string[];
  loggerLevel?: string;
  patchAll?: boolean;
};

export type ConfigExtensions =
  | { [key: string]: boolean }
  | { [key: string]: ConfigExtension };

export type ConfigExtension = {
  enabled: boolean;
  config?: Record<string, any>;
};

export enum ExtensionSettingType {
  Boolean = "boolean",
  Number = "number",
  String = "string",
  Select = "select",
  List = "list",
  Dictionary = "dictionary",
  Custom = "custom"
}

export type BooleanSettingType = {
  type: ExtensionSettingType.Boolean;
  default?: boolean;
};

export type NumberSettingType = {
  type: ExtensionSettingType.Number;
  default?: number;
  min?: number;
  max?: number;
};

export type StringSettingType = {
  type: ExtensionSettingType.String;
  default?: string;
};

export type SelectSettingType = {
  type: ExtensionSettingType.Select;
  options: string[];
  default?: string;
};

export type ListSettingType = {
  type: ExtensionSettingType.List;
  options?: string[];
  default?: string[];
};

export type DictionarySettingType = {
  type: ExtensionSettingType.Dictionary;
  default?: Record<string, string>;
};

export type CustomSettingType = {
  type: ExtensionSettingType.Custom;
  default?: any;
};

export type ExtensionSettingsManifest = {
  displayName?: string;
  description?: string;
} & (
  | BooleanSettingType
  | NumberSettingType
  | StringSettingType
  | SelectSettingType
  | ListSettingType
  | DictionarySettingType
  | CustomSettingType
);
