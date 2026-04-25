import type { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "Menu API only allows Items and groups of Items as children.",
    replace: {
      match: /(function \i\(\i\){let{navId[^}]+?}=(\i),\i=)(function \i\(\i\){return.+? instead`\)},\[\]\)})(\(\i\)),/,
      replacement: (_, func, props, parser, children) =>
        `;let _parser=${parser};exports.__contextMenu_parse=_parser;${func}require("contextMenu_contextMenu")._patchMenu(${props},_parser${children}),`
    }
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
    find: 'location:"expanding_buttons"',
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
