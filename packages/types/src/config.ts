export type Config = {
  extensions: ConfigExtensions;
  repositories: string[];
  devSearchPaths?: string[];
  loggerLevel?: string;
  patchAll?: boolean;
};

export type ConfigExtensions = { [key: string]: boolean } | { [key: string]: ConfigExtension };

export type ConfigExtension = {
  enabled: boolean;
  config?: Record<string, any>;
};

export enum ExtensionSettingType {
  Boolean = "boolean",
  Number = "number",
  String = "string",
  MultilineString = "multilinestring",
  Select = "select",
  MultiSelect = "multiselect",
  List = "list",
  Dictionary = "dictionary",
  Custom = "custom"
}

export type SelectOption =
  | string
  | {
      value: string;
      label: string;
    };

export type BooleanSettingType = {
  /**
   * Displays as a simple switch.
   */
  type: ExtensionSettingType.Boolean;
  default?: boolean;
};

export type NumberSettingType = {
  /**
   * Displays as a simple slider.
   */
  type: ExtensionSettingType.Number;
  default?: number;
  min?: number;
  max?: number;
};

export type StringSettingType = {
  /**
   * Displays as a single line string input.
   */
  type: ExtensionSettingType.String;
  default?: string;
};

export type MultilineTextInputSettingType = {
  /**
   * Displays as a multiple line string input.
   */
  type: ExtensionSettingType.MultilineString;
  default?: string;
};

export type SelectSettingType = {
  /**
   * A dropdown to pick between one of many values.
   */
  type: ExtensionSettingType.Select;
  options: SelectOption[];
  default?: string;
};

export type MultiSelectSettingType = {
  /**
   * A dropdown to pick multiple values.
   */
  type: ExtensionSettingType.MultiSelect;
  options: string[];
  default?: string[];
};

export type ListSettingType = {
  /**
   * A list of strings that the user can add or remove from.
   */
  type: ExtensionSettingType.List;
  default?: string[];
};

export type DictionarySettingType = {
  /**
   * A dictionary (key-value pair) that the user can add or remove from.
   */
  type: ExtensionSettingType.Dictionary;
  default?: Record<string, string>;
};

export type CustomSettingType = {
  /**
   * A custom component.
   * You can use the registerConfigComponent function in the Moonbase API to register a React component to render here.
   */
  type: ExtensionSettingType.Custom;
  default?: any;
};

export enum ExtensionSettingsAdvice {
  None = "none",
  Reload = "reload",
  Restart = "restart"
}

export type ExtensionSettingsManifest = {
  /**
   * A human friendly name for the setting.
   */
  displayName?: string;

  /**
   * A longer description for the setting.
   * Markdown is not supported.
   */
  description?: string;

  /**
   * The "advice" to give upon changing this setting.
   * Can be configured to reload the client, restart the client, or do nothing.
   */
  advice?: ExtensionSettingsAdvice;
} & (
  | BooleanSettingType
  | NumberSettingType
  | StringSettingType
  | MultilineTextInputSettingType
  | SelectSettingType
  | MultiSelectSettingType
  | ListSettingType
  | DictionarySettingType
  | CustomSettingType
);
