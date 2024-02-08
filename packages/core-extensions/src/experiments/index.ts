import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "isStaffEnv:",
    replace: {
      match: /.\.isStaff\(\)/,
      replacement: "!0"
    }
  },
  {
    find: '"scientist:triggered"', // Scientist? Triggered.
    replace: {
      match: /(?<=personal_connection_id\|\|)!1/,
      replacement: "!0"
    }
  }
];
