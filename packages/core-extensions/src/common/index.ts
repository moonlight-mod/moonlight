import { ExtensionWebExports } from "@moonlight-mod/types";

import { react } from "./react";
import { flux } from "./flux";
import { stores } from "./stores";
import { http } from "./http";
import { components } from "./components";
import { fluxDispatcher } from "./fluxDispatcher";

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  react,
  flux,
  stores,
  http,
  components,
  fluxDispatcher
};
