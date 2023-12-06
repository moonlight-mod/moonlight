/*
  For tree shaking reasons, sometimes we need to require() instead of an import
  statement at the top of the module (like config, which runs node *and* web).

  require() doesn't seem to carry the types from @types/node, so this allows us
  to requireImport("fs") and still keep the types of fs.

  In the future, I'd like to automate ImportTypes, but I think the type is only
  cemented if import is passed a string literal.
*/

const canRequire = ["path", "fs"] as const;
type CanRequire = (typeof canRequire)[number];

type ImportTypes = {
  path: typeof import("path");
  fs: typeof import("fs");
};

export default function requireImport<T extends CanRequire>(
  type: T
): Awaited<ImportTypes[T]> {
  return require(type);
}
