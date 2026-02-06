import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

// It would be nice to have some dynamic typings for keys and values, like with `GlobalEventHandlersEventMap`
declare class ComponentDispatchClass {
  safeDispatch(eventKey: string, ...args: any): this;
  dispatch(eventKey: string, data: any): this;
  dispatchToLastSubscribed(eventKey: string, data: any): this;
  hasSubscribers(eventKey: string): boolean;
  subscribe(eventKey: string, callback: (...args: any) => void): this;
  subscribeOnce(eventKey: string, callback: (...args: any) => void): this;
  // Presumably this `| undefined` is unintentional on Discord's part
  resubscribe(eventKey: string, callback: (...args: any) => void): this | undefined;
  unsubscribe(eventKey: string, callback: (...args: any) => void): this;
  reset(): this;
  dispatchKeyed(primaryKey: string, secondaryKey: string, ...args: any): this;
  subscribeKeyed(primaryKey: string, secondaryKey: string, callback: (...args: any) => void): this;
  unsubscribeKeyed(primaryKey: string, secondaryKey: string, callback: (...args: any) => void): this;
}

type Exports = {
  ComponentDispatcher: ComponentDispatchClass;
  ComponentDispatch: typeof ComponentDispatchClass;
};
export default Exports;

register((moonmap) => {
  const name = "discord/utils/ComponentDispatchUtils";
  moonmap.register({
    name,
    find: "ComponentDispatchUtils",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "ComponentDispatcher", {
        type: ModuleExportType.Key,
        find: "emitter"
      });
      moonmap.addExport(name, "ComponentDispatch", {
        type: ModuleExportType.Function,
        find: "emitter"
      });

      return true;
    }
  });
});
