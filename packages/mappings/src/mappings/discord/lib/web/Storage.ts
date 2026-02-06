import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";

export declare class ObjectStorage {
  storage: Record<string, string>;

  get(key: string, defaultValue: string): any;
  set(key: string, value: any): void;
  remove(key: string): void;
  clear(): void;
  stringify(): string;
  /**
   * This function tries to query `localStorage`, even as a normal ObjectStorage class.
   */
  asyncGetRaw(key: string, defaultValue: string): string;
  /**
   * This function tries to query `localStorage`, even as a normal ObjectStorage class.
   */
  setRaw(key: string, value: string): void;
  getAfterRefresh(key: string): string;
}

type Exports = {
  ObjectStorage: typeof ObjectStorage;
  /**
   * Equivalent to `window.localStorage`. If `window.localStorage` does exist, it is technically a wrapper class without `this.storage`
   */
  impl: ObjectStorage;
};
export default Exports;

register((moonmap) => {
  const name = "discord/lib/web/Storage";
  moonmap.register({
    name,
    find: "=window.localStorage}catch",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "ObjectStorage", {
        type: ModuleExportType.Function,
        find: "this.storage.hasOwnProperty"
      });
      moonmap.addExport(name, "impl", {
        type: ModuleExportType.Key,
        find: "asyncGetRaw"
      });

      return true;
    }
  });
});
