import { ExtensionWebExports } from "@moonlight-mod/types";

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  stores: {
    dependencies: [{ id: "discord/packages/flux" }]
  },
  ErrorBoundary: {
    dependencies: [{ id: "react" }]
  }
};
