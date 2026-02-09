import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";
import type { BasePayload } from "./_shared";
import type { ChangeListeners } from "./ChangeListeners";
import type { ActionHandler, Dispatcher } from "./Dispatcher";

export type SyncFunction = () => boolean;
type SyncsWith = {
  func: SyncFunction;
  store: Store<any>;
};

export declare abstract class Store<T extends BasePayload> {
  _changeCallbacks: ChangeListeners;
  _reactChangeCallbacks: ChangeListeners;
  _syncsWith: SyncsWith[];
  _dispatchToken: string;
  _dispatcher: Dispatcher<any>;
  _mustEmitChanges: () => boolean;
  _isInitialized: boolean;
  __getLocalVars(): any; // most discord stores dont add it anymore o7
  addChangeListener: ChangeListeners["add"];
  addConditionalChangeListener: ChangeListeners["addConditional"];
  removeChangeListener: ChangeListeners["remove"];
  addReactChangeListener: ChangeListeners["add"];
  removeReactChangeListener: ChangeListeners["remove"];

  static displayName?: string;
  static initialized: boolean;

  static initialize(): void;
  static destroy(): void;
  static getAll: () => Store<any>[];
  registerActionHandlers(handlers: Record<T["type"], ActionHandler<T>>, band?: number): void;
  getName(): string;
  initializeIfNeeded(): void;
  initialize(): void;
  syncWith(stores: Store<T>[], callback: SyncFunction, timeout?: number): void;
  waitFor(...stores: Store<T>[]): void;
  emitChange(): void;
  getDispatchToken(): string;
  mustEmitChanges(should?: () => boolean): void;

  constructor(dispatcher: Dispatcher<any>, actionHandlers?: Record<T["type"], ActionHandler<T>>, band?: number);
}

export type Exports = {
  Store: typeof Store;
};
export default Exports;

register((moonmap) => {
  const name = "discord/packages/flux/Store";
  moonmap.register({
    name,
    find: "Stores belong to two separate dispatchers.",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "Store", {
        type: ModuleExportType.Function,
        find: "Stores belong to two separate dispatchers."
      });

      return true;
    }
  });
});
