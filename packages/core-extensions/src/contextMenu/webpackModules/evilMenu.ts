import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

let code =
  spacepack.require.m[
    spacepack.findByCode(
      "Menu API only allows Items and groups of Items as children."
    )[0].id
  ].toString();
code = code.replace(/,.=(?=function .\(.\){.+?,.=function)/, ";return ");
code = code.replace(/,(?=__contextMenu)/, ";let ");
const mod = new Function(
  "module",
  "exports",
  "require",
  `(${code}).apply(this, arguments)`
);
const exp: any = {};
mod({}, exp, require);
module.exports = (el: any) => {
  return exp.Menu({
    children: el,
    __contextMenu_evilMenu: true
  });
};
