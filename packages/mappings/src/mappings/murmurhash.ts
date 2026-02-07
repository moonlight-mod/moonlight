import register from "../registry";

// copypasted https://github.com/perezd/node-murmurhash/blob/master/murmurhash.d.ts

type hashfunc = (key: string | Uint8Array, seed?: number) => number;

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 *
 * @param key - ASCII only
 * @param seed - (optional) positive integer
 * @returns 32-bit positive integer hash
 */
type murmurhash = hashfunc;

type Exports = murmurhash & {
  /**
   * JS Implementation of MurmurHash2
   *
   * @param str - ASCII only
   * @param seed - (optional) positive integer
   * @returns 32-bit positive integer hash
   */
  v2: hashfunc;
  v3: murmurhash;
};
export default Exports;

register((moonmap) => {
  const name = "murmurhash";
  moonmap.register({
    name,
    find: [".v2=", ".v3="],
    process({ id }) {
      moonmap.addModule(id, name);

      return true;
    }
  });
});
