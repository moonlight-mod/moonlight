import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const fluxDispatcher: ExtensionWebpackModule = {
  dependencies: [
    { ext: "spacepack", id: "spacepack" },
    "isDispatching",
    "dispatch"
  ],
  run: (module, exports, require) => {
    const spacepack = require("spacepack_spacepack").spacepack;
    module.exports = spacepack.findByExports(
      "isDispatching",
      "dispatch"
    )[0].exports.default;
  }
};
