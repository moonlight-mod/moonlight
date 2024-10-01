import { ExtensionWebExports } from "@moonlight-mod/types";

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  components: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      "MasonryList:",
      ".flexGutterSmall,"
    ]
  },

  stores: {
    dependencies: [
      {
        id: "discord/packages/flux"
      }
    ]
  }
};
