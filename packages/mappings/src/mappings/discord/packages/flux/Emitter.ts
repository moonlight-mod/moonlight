import register from "../../../../registry";
import type { Store } from "./Store";

export declare class Emitter {
  changedStores: Set<Store<any>>;
  reactChangedStores: Set<Store<any>>;
  changeSentinel: number;
  isBatchEmitting: boolean;
  isDispatching: boolean;
  isPaused: boolean;
  pauseTimer?: number;

  destroy(): void;
  injectBatchEmitChanges(callback: (callback: () => void) => void): void;
  pause(): void;
  resume(): void;
  batched(callback: () => any): any;
  emit(): void;
  getChangeSentinel(): number;
  getIsPaused(): boolean;
  markChanged(store: Store<any>): void;
  emitNonReactOnce(unused1: unknown, unused2: unknown): void;
  emitReactOnce(): void;

  constructor();
}

type Exports = {
  default: typeof Emitter;
};
export default Exports;

register((moonmap) => {
  const name = "discord/packages/flux/Emitter";
  moonmap.register({
    name,
    find: "Slow batch emitReactChanges took ",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
