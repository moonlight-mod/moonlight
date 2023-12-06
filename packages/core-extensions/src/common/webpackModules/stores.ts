import Flux from "@moonlight-mod/wp/common_flux";

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
