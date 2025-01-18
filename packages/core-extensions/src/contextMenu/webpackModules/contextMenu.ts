import { InternalItem, Menu, MenuElement } from "@moonlight-mod/types/coreExtensions/contextMenu";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import parser from "@moonlight-mod/wp/contextMenu_evilMenu";

// NOTE: We originally had item as a function that returned this, but it didn't
// quite know how to work out the type and thought it was a JSX element (it
// *technically* was). This has less type safety, but a @ts-expect-error has
// zero, so it's better than nothing.
type ReturnType = MenuElement | MenuElement[];

type Patch = {
  navId: string;
  item: React.FC<any>;
  anchor: string | RegExp;
  before: boolean;
};

function addItem<T = any>(navId: string, item: React.FC<T>, anchor: string | RegExp, before = false) {
  if (anchor instanceof RegExp && anchor.flags.includes("g"))
    throw new Error("anchor regular expression should not be global");
  patches.push({ navId, item, anchor, before });
}

const patches: Patch[] = [];
function _patchMenu(props: React.ComponentProps<Menu>, items: InternalItem[]) {
  const matches = patches.filter((p) => p.navId === props.navId);
  if (!matches.length) return items;

  for (const patch of matches) {
    const idx = items.findIndex((i) =>
      typeof patch.anchor === "string" ? i.key === patch.anchor : patch.anchor.test(i.key!)
    );
    if (idx === -1) continue;
    items.splice(idx + 1 - +patch.before, 0, ...parser(patch.item(menuProps) as ReturnType));
  }

  return items;
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

module.exports = {
  patches,
  addItem,
  _patchMenu,
  _saveProps
};

// Unmangle Menu elements
// spacepack.require.m[moonlight.moonmap.modules["discord/modules/menus/web/Menu"]].toString();
const code =
  spacepack.require.m[
    spacepack.findByCode("Menu API only allows Items and groups of Items as children.")[0].id
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
