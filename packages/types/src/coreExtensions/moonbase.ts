export type CustomComponentProps = {
  value: any;
  setValue: (value: any) => void;
};

export type CustomComponent = React.FC<CustomComponentProps>;

export type Moonbase = {
  /**
   * Registers a custom component for an extension setting.
   * The extension setting must be of type "custom".
   * @param ext The extension ID
   * @param option The setting ID
   * @param component A React component
   */
  registerConfigComponent: (ext: string, option: string, component: CustomComponent) => void;
};

export type Exports = {
  default: Moonbase;

  /**
   * @deprecated Use the default export
   */
  moonbase: Moonbase;
};
