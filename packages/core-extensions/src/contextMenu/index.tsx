import type { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "Menu API only allows Items and groups of Items as children.",
    replace: [
      {
        match: /(?<=let{navId[^}]+?}=(.),.=).+?(?=,)/,
        replacement: (items, props) => `require("contextMenu_contextMenu")._patchMenu(${props},${items})`
      }
    ]
  },
  {
    find: ".getContextMenu(",
    replace: [
      {
        match: /(?<=let\{[^}]+?\}=.;return ).\({[^}]+?}\)/,
        replacement: render => `require("contextMenu_contextMenu")._saveProps(this,${render})`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  contextMenu: {
    dependencies: [{ ext: "spacepack", id: "spacepack" }, "Menu API only allows Items and groups of Items as children."]
  },
  evilMenu: {
    dependencies: [{ ext: "spacepack", id: "spacepack" }, "Menu API only allows Items and groups of Items as children."]
  }
};
