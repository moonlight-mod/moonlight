import register from "../../../../registry";

type ChangeListener = () => void;

export declare class ChangeListeners {
  listeners: Set<ChangeListener>;

  add(listener: ChangeListener): void;
  remove(listener: ChangeListener): void;
  addConditional(condition: () => boolean, bool?: boolean): void;

  has(listener: ChangeListener): boolean;
  hasAny(): boolean;
  invokeAll(): void;
}

export type Exports = {
  default: typeof ChangeListeners;
};
export default Exports;

register((moonmap) => {
  const name = "discord/packages/flux/ChangeListeners";
  moonmap.register({
    name,
    find: "invokeAll(){this.listeners.forEach(",
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
