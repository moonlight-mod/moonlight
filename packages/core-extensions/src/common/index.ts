import { ExtensionWebExports } from "@moonlight-mod/types";

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  components: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      "MasonryList:",
      ".flexGutterSmall,"
    ]
  },

  flux: {
    dependencies: [{ ext: "spacepack", id: "spacepack" }, "connectStores:"]
  },

  fluxDispatcher: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      "isDispatching",
      "dispatch"
    ]
  },

  react: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
      /\.?version(?:=|:)/,
      /\.?createElement(?:=|:)/
    ]
  },

  stores: {
    dependencies: [{ ext: "common", id: "flux" }]
  }
};
