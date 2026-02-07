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
      match: ".personal_connection_id",
      replacement: ".personal_connection_id || true"
    }
  },

  // Enable further staff-locked options
  {
    find: "shouldShowLurkerModeUpsellPopout:",
    replace: {
      match: /\.useReducedMotion,isStaff:(\i)(,|})/,
      replacement: (_, isStaff, trail) =>
        `.useReducedMotion,isStaff:(moonlight.getConfigOption("experiments","staffSettings")??false)?true:${isStaff}${trail}`
    }
  }
];
