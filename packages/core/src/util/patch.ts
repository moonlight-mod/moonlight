import type { PatchReplace } from "@moonlight-mod/types";
import { PatchReplaceType } from "@moonlight-mod/types";

type SingleFind = string | RegExp;
type Find = SingleFind | SingleFind[];

export function processFind<T extends Find>(find: T): T {
  if (Array.isArray(find)) {
    return find.map(processFind) as T;
  }
  else if (find instanceof RegExp) {
    // Add support for \i to match rspack's minified names
    return new RegExp(find.source.replace(/\\i/g, "[A-Za-z_$][\\w$]*"), find.flags) as T;
  }
  else {
    return find;
  }
}

export function processReplace(replace: PatchReplace | PatchReplace[]) {
  if (Array.isArray(replace)) {
    replace.forEach(processReplace);
  }
  else {
    if (replace.type === undefined || replace.type === PatchReplaceType.Normal) {
      replace.match = processFind(replace.match);
    }
  }
}

export function testFind(src: string, find: SingleFind) {
  // indexOf is faster than includes by 0.25% lmao
  return typeof find === "string" ? src.includes(find) : find.test(src);
}
