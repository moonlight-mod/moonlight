import { ComponentConstructor } from "flux/lib/FluxContainer";
import register from "../../../../registry";
import type { Store } from "./Store";

export type ConnectStores = <T>(stores: Store<any>[], callback: T, context?: any) => ComponentConstructor<T>;

type Exports = {
  default: ConnectStores;
};
export default Exports;

register((moonmap) => {
  const name = "discord/packages/flux/connectStores";
  moonmap.register({
    name,
    find: "=`FluxContainer(",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
