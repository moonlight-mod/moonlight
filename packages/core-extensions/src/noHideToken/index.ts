import type { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "hideToken:()=>",
    replace: {
      match: /hideToken:\(\)=>.+?,/,
      replacement: `hideToken:()=>{},`
    }
  }
];
