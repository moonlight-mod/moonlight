import { ComponentConstructor } from "flux/lib/FluxContainer";
import type { Store } from "./Store";
import register from "../../../../registry";

export interface ConnectStores {
  <T>(stores: Store<any>[], callback: T, context?: any): ComponentConstructor<T>;
}

type Exports = {
  default: ConnectStores;
};
export default Exports;

register((moonmap) => {
  const name = "discord/packages/flux/connectStores";
  moonmap.register({
    name,
    find: '="FluxContainer(".concat(',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
