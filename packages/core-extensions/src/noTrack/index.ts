import { Patch, PatchReplaceType } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "analyticsTrackingStoreMaker:function",
    replace: {
      match: /analyticsTrackingStoreMaker:function\(\){return .}/,
      replacement: "analyticsTrackingStoreMaker:function(){return ()=>{}}"
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
