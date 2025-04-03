import type { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "analyticsTrackingStoreMaker:()=>",
    replace: {
      match: /analyticsTrackingStoreMaker:\(\)=>.+?,/,
      replacement: "analyticsTrackingStoreMaker:()=>()=>{},"
    }
  },
  {
    find: /this\._metrics\.push\(.\),/,
    replace: {
      match: /this\._metrics\.push\(.\),/,
      replacement: ""
    }
  }
];
