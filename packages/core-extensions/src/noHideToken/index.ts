import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "hideToken:function",
    replace: {
      match: /hideToken:\(\)=>.+?,/,
      replacement: `hideToken:()=>{},`
    }
  }
];
