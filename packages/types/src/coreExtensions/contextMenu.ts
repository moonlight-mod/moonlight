// TODO: Deduplicate common props

export type Menu = React.FunctionComponent<{
  navId: string;
  variant?: string;
  hideScrollbar?: boolean;
  className?: string;
  children: React.ReactComponentElement<MenuElement>[];
  onClose?: () => void;
  onSelect?: () => void;
}>;
export type MenuProps = React.ComponentProps<Menu>;

export type MenuElement =
  | MenuSeparator
  | MenuGroup
  | MenuItem
  | MenuCheckboxItem
  | MenuRadioItem
  | MenuControlItem;

export type MenuSeparator = React.FunctionComponent;
export type MenuGroup = React.FunctionComponent<{
  label?: string;
  className?: string;
  color?: string;
  children: React.ReactComponentElement<MenuElement>[];
}>;
export type MenuItem = React.FunctionComponent<
  {
    id: any;
    dontCloseOnActionIfHoldingShiftKey?: boolean;
  } & (
    | {
        label: string;
        subtext?: string;
        color?: string;
        hint?: string;
        disabled?: boolean;
        icon?: any;
        showIconFirst?: boolean;
        imageUrl?: string;

        className?: string;
        focusedClassName?: string;
        subMenuIconClassName?: string;

        action?: () => void;
        onFocus?: () => void;

        iconProps?: any;
        sparkle?: any;

        children?: React.ReactComponentElement<MenuElement>[];
        onChildrenScroll?: any;
        childRowHeight?: any;
        listClassName?: string;
        subMenuClassName?: string;
      }
    | {
        color?: string;
        disabled?: boolean;
        keepItemStyles?: boolean;

        action?: () => void;

        render: any;
        navigable?: boolean;
      }
  )
>;
export type MenuCheckboxItem = React.FunctionComponent<{
  id: any;
  label: string;
  subtext?: string;
  color?: string;
  className?: string;
  focusedClassName?: string;
  disabled?: boolean;
  checked: boolean;
  action?: () => void;
}>;
export type MenuRadioItem = React.FunctionComponent<{
  id: any;
  label: string;
  subtext?: string;
  color?: string;
  disabled?: boolean;
  action?: () => void;
}>;
export type MenuControlItem = React.FunctionComponent<
  {
    id: any;
    label: string;
    color?: string;
    disabled?: boolean;
    showDefaultFocus?: boolean;
  } & (
    | {
        control: any;
      }
    | {
        control?: undefined;
        interactive?: boolean;
        children?: React.ReactComponentElement<MenuElement>[];
      }
  )
>;

export type ContextMenu = {
  addItem: (
    navId: string,
    item: (props: any) => React.ReactComponentElement<MenuElement>,
    anchorId: string,
    before?: boolean
  ) => void;

  MenuCheckboxItem: MenuCheckboxItem;
  MenuControlItem: MenuControlItem;
  MenuGroup: MenuGroup;
  MenuItem: MenuItem;
  MenuRadioItem: MenuRadioItem;
  MenuSeparator: MenuSeparator;
};

export type InternalItem = {
  type: string;
  key?: string;
};

export type InternalSeparator = {
  type: "separator";
  navigable: false;
};
export type InternalGroupStart = {
  type: "groupstart";
  length: number;
  navigable: false;
  props: React.ComponentProps<MenuGroup>;
};
export type InternalGroupEnd = {
  type: "groupend";
} & Omit<InternalGroupStart, "type">;
export type InternalCustomItem = {
  type: "customitem";
  key: any;
  navigable?: boolean;
  render: any;
  props: Extract<React.ComponentProps<MenuItem>, { render: any }>;
};
export type InternalItem_ = {
  type: "item";
  key: any;
  navigable: true;
  label: string;
};

export type EvilItemParser = (
  el:
    | React.ReactComponentElement<MenuElement>
    | React.ReactComponentElement<MenuElement>[]
) => InternalItem[];
