import { Store } from "@moonlight-mod/wp/discord/packages/flux";

module.exports = new Proxy(
  {},
  {
    get: (target, key, receiver) => {
      const allStores = Store.getAll();

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
