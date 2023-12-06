import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const stores: ExtensionWebpackModule = {
  dependencies: [{ ext: "common", id: "flux" }],
  run: (module, exports, require) => {
    const Flux = require("common_flux");

    module.exports = new Proxy(
      {},
      {
        get: function (target, key, receiver) {
          const allStores = Flux.Store.getAll();

          let targetStore;
          for (const store of allStores) {
            const name = store.getName();
            if (name.length === 1) continue; // filter out unnamed stores

            if (name === key) {
              targetStore = store;
              break;
            }
          }

          return targetStore;
        }
      }
    );
  }
};
