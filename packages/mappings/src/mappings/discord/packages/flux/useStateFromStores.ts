import { DependencyList } from "react";
import type { Store } from "./Store";
import register from "../../../../registry";
import { ModuleExportType } from "@moonlight-mod/moonmap";

export interface UseStateFromStores {
  <T>(
    stores: Store<any>[],
    callback: () => T,
    deps?: DependencyList,
    shouldUpdate?: (oldState: T, newState: T) => boolean
  ): T;
}

export interface UseStateFromStoresArray {
  <T>(stores: Store<any>[], callback: () => T, deps?: DependencyList): T;
}

export interface UseStateFromStoresObject {
  <T>(stores: Store<any>[], callback: () => T, deps?: DependencyList): T;
}

register((moonmap) => {
  const name = "discord/packages/flux/useStateFromStores";
  moonmap.register({
    name,
    find: '.attach("useStateFromStores")',
    process({ id }) {
      moonmap.addModule(id, name);

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
        find: /return (.)\((.),(.),(.),(.)\.([^Z])\)/
      });
      moonmap.addExport(name, "useStateFromStoresObject", {
        type: ModuleExportType.Function,
        find: /return (.)\((.),(.),(.),(.)\.Z\)/
      });

      return true;
    }
  });
});
