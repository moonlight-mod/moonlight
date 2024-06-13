import { Patch } from "types/src";

export const patches: Patch[] = [
  {
    find: "hideToken:function",
    replace: {
      match: /(?<=hideToken:function\(\){)/,
      replacement: `return()=>{};`
    }
  }
];
