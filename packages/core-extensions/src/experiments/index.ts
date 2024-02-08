import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "isStaffPersonal:",
    replace: {
      match: /&&null!=this\.personalConnectionId/,
      replacement: "||!0"
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
