import register from "../../../registry";

export declare class BaseRecord {
  toJS(): this;
  set(key: string, value: unknown): this;
  merge(record: this): this;
  update(key: string, defaultValue: unknown, reducer: (value: unknown) => unknown): this;
  update(key: string, reducer: (value: unknown) => unknown): this;
}

type Exports = {
  default: BaseRecord;
};
export default Exports;

register((moonmap) => {
  const name = "discord/lib/BaseRecord";
  moonmap.register({
    name,
    find: ["{toJS(){return", "})):this}merge("],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
