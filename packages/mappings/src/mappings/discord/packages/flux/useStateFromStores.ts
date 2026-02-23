import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { DependencyList } from "react";
import register from "../../../../registry";
import type { Store } from "./Store";

export type UseStateFromStores = <T>(
  stores: Store<any>[],
  callback: () => T,
  deps?: DependencyList,
  shouldUpdate?: (oldState: T, newState: T) => boolean
) => T;

export type UseStateFromStoresArray = <T>(stores: Store<any>[], callback: () => T, deps?: DependencyList) => T;

export type UseStateFromStoresObject = <T>(stores: Store<any>[], callback: () => T, deps?: DependencyList) => T;

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
