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
  /**
   * Registers a new context menu item for a given context menu type.
   * @param navId The navigation ID for the target context menu (e.g. "user-context", "message")
   * @param item A React component
   * @param anchorId An existing item's ID to anchor the new item to
   * @param before Whether to insert the new item before the anchor item
   */
  addItem: (navId: string, item: React.FC<any>, anchorId: string, before?: boolean) => void;

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
