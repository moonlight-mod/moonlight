/*
  It seems like Discord maintains their own version of Flux that doesn't match
  the types on NPM. This is a heavy work in progress - if you encounter rough
  edges, please contribute!
*/

import { DependencyList } from "react";
import { Store as FluxStore } from "flux/utils";
import { Dispatcher as FluxDispatcher } from "flux";
import { ComponentConstructor } from "flux/lib/FluxContainer";

export declare abstract class Store<T> extends FluxStore<T> {
  static getAll: () => Store<any>[];
  getName: () => string;
  emitChange: () => void;
}

interface ConnectStores {
  <T>(
    stores: Store<any>[],
    callback: T,
    context?: any
  ): ComponentConstructor<T>;
}

export type FluxDefault = {
  DeviceSettingsStore: any; // TODO
  Emitter: any; // @types/fbemitter
  OfflineCacheStore: any; // TODO
  PersistedStore: any; // TODO
  Store: typeof Store;
  Dispatcher: typeof FluxDispatcher;
  connectStores: ConnectStores;
  initialize: () => void;
  initialized: Promise<boolean>;
  destroy: () => void;
  useStateFromStores: UseStateFromStores;
  useStateFromStoresArray: UseStateFromStoresArray;
  useStateFromStoresObject: UseStateFromStoresObject;
};

interface UseStateFromStores {
  <T>(
    stores: Store<any>[],
    callback: () => T,
    deps?: DependencyList,
    shouldUpdate?: (oldState: T, newState: T) => boolean
  ): T;
}

interface UseStateFromStoresArray {
  <T>(stores: Store<any>[], callback: () => T, deps?: DependencyList): T;
}

interface UseStateFromStoresObject {
  <T>(stores: Store<any>[], callback: () => T, deps?: DependencyList): T;
}
