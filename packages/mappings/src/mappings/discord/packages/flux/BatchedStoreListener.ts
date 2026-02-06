import register from "../../../../registry";
import type { Store } from "./Store";

export declare class BatchedStoreListener {
  stores: Store<any>[];
  changeCallback(): void;
  storeVersionHandled: number;
  handleStoreChange(): void;

  attach(name: string): void;
  detatch(): void;

  constructor(stores: Store<any>[], changeCallback: () => void);
}

type Exports = {
  default: typeof BatchedStoreListener;
};
export default Exports;

register((moonmap) => {
  const name = "discord/packages/flux/BatchedStoreListener";
  moonmap.register({
    name,
    find: " tried to load a non-existent store. Either it isn't defined or there is a circular dependency. Loaded ",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
