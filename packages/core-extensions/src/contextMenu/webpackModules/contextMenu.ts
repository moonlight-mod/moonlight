import {
  InternalItem,
  MenuElement,
  MenuProps
} from "@moonlight-mod/types/coreExtensions/contextMenu";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import parser from "@moonlight-mod/wp/contextMenu_evilMenu";

type Patch = {
  navId: string;
  item: (
    props: any
  ) =>
    | React.ReactComponentElement<MenuElement>
    | React.ReactComponentElement<MenuElement>[];
  anchorId: string;
  before: boolean;
};

export function addItem<T>(
  navId: string,
  item: (
    props: T
  ) =>
    | React.ReactComponentElement<MenuElement>
    | React.ReactComponentElement<MenuElement>[],
  anchorId: string,
  before = false
) {
  patches.push({ navId, item, anchorId, before });
}

export const patches: Patch[] = [];
function _patchMenu(props: MenuProps, items: InternalItem[]) {
  const matches = patches.filter((p) => p.navId === props.navId);
  if (!matches.length) return;

  for (const patch of matches) {
    const idx = items.findIndex((i) => i.key === patch.anchorId);
    if (idx === -1) continue;
    items.splice(idx + 1 - +patch.before, 0, ...parser(patch.item(menuProps)));
  }
}

let menuProps: any;
function _saveProps(self: any, el: any) {
  menuProps = el.props;

  const original = self.props.closeContextMenu;
  self.props.closeContextMenu = function (...args: any[]) {
    menuProps = undefined;
    return original?.apply(this, args);
  };

  return el;
}

const MenuElements = spacepack.findByCode("return null", "MenuGroup:")[0]
  .exports;

module.exports = {
  ...MenuElements,
  addItem,
  _patchMenu,
  _saveProps
};
