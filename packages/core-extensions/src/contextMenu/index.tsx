import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "Menu API only allows Items and groups of Items as children.",
    replace: [
      {
        match:
          /(?<=let{navId[^}]+?}=(.),(.)=function .\(.\){.+(?=,.=function))/,
        replacement: (_, props, items) =>
          `,__contextMenu=!${props}.__contextMenu_evilMenu&&require("contextMenu_contextMenu")._patchMenu(${props}, ${items})`
      }
    ]
  },
  {
    find: ".getContextMenu(",
    replace: [
      {
        match: /(?<=let\{[^}]+?\}=.;return ).\({[^}]+?}\)/,
        replacement: (render) =>
          `require("contextMenu_contextMenu")._saveProps(this,${render})`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  contextMenu: {
    dependencies: [{ ext: "spacepack", id: "spacepack" }, "MenuGroup:"]
  },
  evilMenu: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      "Menu API only allows Items and groups of Items as children."
    ]
  }
};
