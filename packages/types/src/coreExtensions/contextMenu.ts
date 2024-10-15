import {
  Menu,
  MenuCheckboxItem,
  MenuControlItem,
  MenuGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuItem,
  MenuElement
} from "@moonlight-mod/mappings/discord/components/common/index";

export type ContextMenu = {
  addItem: (navId: string, item: (props: any) => MenuElement, anchorId: string, before?: boolean) => void;

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

export type EvilItemParser = (el: MenuElement | MenuElement[]) => InternalItem[];

export type { Menu, MenuElement };
