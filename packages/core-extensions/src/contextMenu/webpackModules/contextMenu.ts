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
export function _patchMenu(props: MenuProps, items: InternalItem[]) {
  const matches = patches.filter((p) => p.navId === props.navId);
  if (!matches.length) return;

  for (const patch of matches) {
    const idx = items.findIndex((i) => i.key === patch.anchorId);
    if (idx === -1) continue;
    items.splice(idx + 1 - +patch.before, 0, ...parser(patch.item(menuProps)));
  }
}

let menuProps: any;
export function _saveProps(self: any, el: any) {
  menuProps = el.props;

  const original = self.props.closeContextMenu;
  self.props.closeContextMenu = function (...args: any[]) {
    menuProps = undefined;
    return original?.apply(this, args);
  };

  return el;
}

// Unmangle Menu elements
const code =
  spacepack.require.m[
    spacepack.findByCode(
      "Menu API only allows Items and groups of Items as children."
    )[0].id
  ].toString();

let MangledMenu;

const typeRegex = /if\(.\.type===(.)\.(.+?)\).+?type:"(.+?)"/g;
const typeMap: Record<string, string | undefined> = {
  checkbox: "MenuCheckboxItem",
  control: "MenuControlItem",
  groupstart: "MenuGroup",
  customitem: "MenuItem",
  radio: "MenuRadioItem",
  separator: "MenuSeparator"
};

for (const [, modIdent, mangled, type] of code.matchAll(typeRegex)) {
  if (!MangledMenu) {
    const modId = code.match(new RegExp(`${modIdent}=.\\((\\d+?)\\)`))![1];
    MangledMenu = spacepack.require(modId);
  }

  const prop = typeMap[type];
  if (!prop) continue;
  module.exports[prop] = MangledMenu[mangled];
}
