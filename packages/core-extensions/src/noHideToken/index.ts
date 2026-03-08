import type { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "hideToken:()=>",
    replace: {
      match: /hideToken:\(\)=>.+?,/,
      replacement: `hideToken:()=>{},`
    }
  },

  // discord sets devtools callbacks over ipc
  // this just disables the entire callback stuff to prevent needless errors
  {
    find: ".Messages.SELF_XSS_HEADER)",
    replace: {
      match: /null\!=\i&&"0\.0\.0"===\i\.app\.getVersion\(\)/,
      replacement: "true"
    }
  }
];
