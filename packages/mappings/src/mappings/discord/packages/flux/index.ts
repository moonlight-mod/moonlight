import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";
import type { BatchedStoreListener } from "./BatchedStoreListener";
import type { ConnectStores } from "./connectStores";
import type { Dispatcher } from "./Dispatcher";
import type { Emitter } from "./Emitter";
import type { DeviceSettingsStore, OfflineCacheStore, PersistedStore } from "./PersistedStore";
import type { Store } from "./Store";
import type { UseStateFromStores, UseStateFromStoresArray, UseStateFromStoresObject } from "./useStateFromStores";

type Flux = {
  Emitter: typeof Emitter;
  Store: typeof Store;
  PersistedStore: typeof PersistedStore;
  DeviceSettingsStore: typeof DeviceSettingsStore;
  OfflineCacheStore: typeof OfflineCacheStore;
  connectStores: ConnectStores;
  initialize: () => void;
  get initialized(): Promise<boolean>;
};

type Exports = {
  BatchedStoreListener: BatchedStoreListener;
  Dispatcher: typeof Dispatcher;
  Store: typeof Store;
  default: Flux;
  /**
   * This function always returns false.
   */
  statesWillNeverBeEqual(state1: any, state2: any): boolean;
  useStateFromStores: UseStateFromStores;
  useStateFromStoresArray: UseStateFromStoresArray;
  useStateFromStoresObject: UseStateFromStoresObject;
};
export default Exports;

register((moonmap) => {
  const name = "discord/packages/flux";
  moonmap.register({
    name,
    find: ",DeviceSettingsStore:",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "BatchedStoreListener", {
        type: ModuleExportType.Function,
        find: " tried to load a non-existent store."
      });
      moonmap.addExport(name, "Dispatcher", {
        type: ModuleExportType.Function,
        find: "_dispatchWithDevtools("
      });
      moonmap.addExport(name, "Store", {
        type: ModuleExportType.Function,
        find: "registerActionHandlers("
      });
      moonmap.addExport(name, "statesWillNeverBeEqual", {
        type: ModuleExportType.Function,
        find: "{return!1}"
      });
      moonmap.addExport(name, "useStateFromStores", {
        type: ModuleExportType.Function,
        find: '.attach("useStateFromStores")'
      });
      moonmap.addExport(name, "useStateFromStoresArray", {
        type: ModuleExportType.Function,
        find: /return (.)\((.),(.),(.),(.)\.([^A])\)/
      });
      moonmap.addExport(name, "useStateFromStoresObject", {
        type: ModuleExportType.Function,
        find: /return (.)\((.),(.),(.),(.)\.A\)/
      });

      return true;
    }
  });
});
