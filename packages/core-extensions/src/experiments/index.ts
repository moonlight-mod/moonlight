import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "isStaffEnv:",
    replace: {
      match: /.\.isStaff\(\)/,
      replacement: "!0"
    }
  }
];
