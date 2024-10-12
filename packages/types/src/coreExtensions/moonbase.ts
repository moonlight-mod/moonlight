export type CustomComponent = React.FC<{
  value: any;
  setValue: (value: any) => void;
}>;

export type Moonbase = {
  registerConfigComponent: (ext: string, option: string, component: CustomComponent) => void;
};
