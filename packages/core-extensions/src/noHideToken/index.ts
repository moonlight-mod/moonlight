import { Patch } from "types/src";

export const patches: Patch[] = [
  {
    find: "hideToken(){",
    replace: {
      match: /hideToken\(\)\{.+?},/,
      replacement: `hideToken(){},`
    }
  }
];
