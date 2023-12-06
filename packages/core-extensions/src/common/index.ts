import { ExtensionWebExports } from "@moonlight-mod/types";

import { react } from "./react";
import { flux } from "./flux";
import { stores } from "./stores";
import { http } from "./http";
import { fluxDispatcher } from "./fluxDispatcher";

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  components: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      "MasonryList:",
      ".flexGutterSmall,"
    ]
  },

  react,
  flux,
  stores,
  http,
  fluxDispatcher
};
