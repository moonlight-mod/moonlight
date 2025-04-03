import type { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: `setProperty("--custom-app-panels-height"`,
    replace: [
      {
        match: /\(0,.\.jsx\)\((.\..),{section:/,
        replacement: (prev, el) => `...require("appPanels_appPanels").default.getPanels(${el}),${prev}`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  appPanels: {
    dependencies: [{ id: "react" }]
  }
};
