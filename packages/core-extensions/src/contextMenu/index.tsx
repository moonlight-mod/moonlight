import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "Menu API only allows Items and groups of Items as children.",
    replace: [
      {
        match: /(?<=let{navId[^}]+?}=(.),.=).+?(?=,)/,
        replacement: (items, props) => `require("contextMenu_contextMenu")._patchMenu(${props},${items})`
      },
      {
        match: /(?<=})(?=function (\i)\((\i)\){return \i\(\2\)\.)/,
        replacement: (_, name) => `exports.__contextMenu_parse=${name};`
      }
    ]
  },
  {
    find: ".getContextMenu(",
    replace: [
      {
        match: /(?<=let\{[^}]+?\}=.;return ).\({[^}]+?}\)/,
        replacement: (render) => `require("contextMenu_contextMenu")._saveProps(this,${render})`
      }
    ]
  },
  {
    // Special handling for message action popouts
    find: "MESSAGE_POPOUT_MENU_OPENED_DESKTOP,{",
    replace: [
      {
        match: /(?<=function \i\((\i)\){)(?=let{channel:\i,message:\i,canCopy:\i)/,
        replacement: (_, props) => `require("contextMenu_contextMenu")._savePopoutProps(${props});`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  contextMenu: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "discord/modules/menus/web/Menu" },
      "MESSAGE_POPOUT_MENU_OPENED_DESKTOP,{"
    ]
  }
};
