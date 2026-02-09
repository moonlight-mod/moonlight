import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";
import type { DepGraph } from "../../../dependency-graph";
import type { BasePayload, Interceptor, Listener } from "./_shared";
import type { ActionLogger } from "./LoggingUtils";

// fiery was here :) jan 16th 2025

export type ActionHandler<T extends BasePayload> = (payload: T) => void;

export type ActionHandlerRecord<T extends BasePayload> = {
  name: string;
  band?: string;
  actionHandler: ActionHandler<T>;
  storeDidChange(): void;
};

export declare class Dispatcher<T extends BasePayload> {
  _defaultBand: number;
  _interceptors: Interceptor<T>[];
  _subscriptions: Record<T["type"], Set<Listener<T>>>;
  _waitQueue: T[];
  _processingWaitQueue: boolean;
  _currentDispatchActionType: T["type"] | null;
  _actionHandlers: ActionHandlers<T>;
  _sentryUtils: any | undefined;
  actionLogger: ActionLogger;
  functionCache: Record<T["type"], (payload: T) => void>;

  isDispatching(): boolean;
  dispatch(payload: T): Promise<void>;
  flushWaitQueue(): void;
  _dispatchWithDevtools(payload: T): void;
  _dispatchWithLogging(payload: T): void;
  _dispatch(payload: T, callback: (key: T["type"], callback: () => void) => void): void;
  addInterceptor(interceptor: Interceptor<T>): void;
  wait(payload: T): void;
  subscribe(type: T["type"], listener: Listener<T>): void;
  unsubscribe(type: T["type"], listener: Listener<T>): void;
  register(
    type: T["type"],
    handlers: Record<T["type"], ActionHandler<T>>,
    storeDidChange: () => void,
    band: number | null,
    token?: string
  ): string;
  createToken(): string;
  addDependencies(type: T["type"], dependencies: ActionHandlerRecord<T>[]): void;

  constructor(band?: number, logger?: ActionLogger, unused?: unknown);
}
export declare class ActionHandlers<T extends BasePayload> {
  _orderedActionHandlers: Record<T["type"], ActionHandlerRecord<T>[]>;
  _orderedCallbackTokens: any | null; // TODO
  _lastID: number;
  _dependencyGraph: DepGraph<ActionHandlerRecord<T>>;

  getOrderedActionHandlers(type: T["type"]): Record<T["type"], ActionHandlerRecord<T>[]>;
  register(
    type: T["type"],
    handlers: Record<T["type"], ActionHandler<T>>,
    storeDidChange: () => void,
    band: number,
    token?: string
  ): string;
  createToken(): string;
  addDependencies(type: T["type"], dependencies: ActionHandlerRecord<T>[]): void;
  _validateDependencies(type: T["type"], dependencies: ActionHandlerRecord<T>[]): void;
  _invalidateCaches(): void;
  _bandToken(band: number): string;
  _addToBand(type: T["type"], band: number): void;
  _computeOrderedActionHandlers(type: T["type"]): ActionHandlerRecord<T>[];
  _computeOrderedCallbackTokens(): ActionHandlerRecord<T>[];
}

export type Exports = {
  Dispatcher: typeof Dispatcher;
};
export default Exports;

register((moonmap) => {
  const name = "discord/packages/flux/Dispatcher";
  moonmap.register({
    name,
    find: "Dispatch.dispatch(...) called without an action type",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "Dispatcher", {
        type: ModuleExportType.Function,
        find: "_dispatchWithDevtools("
      });

      return true;
    }
  });
});
