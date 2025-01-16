import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

// spacepack.require.m[moonlight.moonmap.modules["discord/modules/menus/web/Menu"]].toString();
let code =
  spacepack.require.m[
    spacepack.findByCode("Menu API only allows Items and groups of Items as children.")[0].id
  ].toString();

const parserSym = code.match(/(?<=_patchMenu\(.,).+?(?=\()/)![0];

code = code.replace(/(?<=function\(\){return ).(?=})/, parserSym);
const mod = new Function("module", "exports", "require", `(${code}).apply(this, arguments)`);

const exp: any = {};
mod({}, exp, require);

const parser = spacepack.findFunctionByStrings(exp, "Menu API only allows Items and groups of Items as children.")!;
module.exports = parser;
