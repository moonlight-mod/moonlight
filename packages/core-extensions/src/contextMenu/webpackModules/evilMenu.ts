import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

let code =
  spacepack.require.m[
    spacepack.findByCode(
      "Menu API only allows Items and groups of Items as children."
    )[0].id
  ].toString();
code = code.replace(
  /onSelect:(.)}=(.),.=(.\(.\)),/,
  `onSelect:$1}=$2;return $3;let `
);
const mod = new Function(
  "module",
  "exports",
  "require",
  `(${code}).apply(this, arguments)`
);
const exp: any = {};
mod({}, exp, require);
const Menu = spacepack.findFunctionByStrings(exp, "isUsingKeyboardNavigation")!;
module.exports = (el: any) => {
  return Menu({
    children: el,
    __contextMenu_evilMenu: true
  });
};
