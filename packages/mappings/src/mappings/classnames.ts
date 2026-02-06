import register from "../registry";

// copypasted types: https://github.com/JedWatson/classnames/blob/main/index.d.ts
export type Value = string | boolean | undefined | null;
export type Mapping = Record<string, any>;
export type ArgumentArray = Array<Argument>;
export type ReadonlyArgumentArray = ReadonlyArray<Argument>;
export type Argument = Value | Mapping | ArgumentArray | ReadonlyArgumentArray;

/**
 * A simple JavaScript utility for conditionally joining classNames together.
 */
type classNames = (...args: ArgumentArray) => string;

type Exports = classNames & { default: classNames };
export default Exports;

register((moonmap) => {
  const name = "classnames";
  moonmap.register({
    name,
    find: 'define.amd?define("classnames",[],',
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
