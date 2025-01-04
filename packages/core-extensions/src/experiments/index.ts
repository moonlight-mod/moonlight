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
  },

  // Enable staff help menu
  // FIXME: either make this actually work live (needs a state hook) or just
  //        wait for #122
  {
    find: ".HEADER_BAR)",
    replace: {
      match: /&&\((.)\?\(0,/,
      replacement: (_, isStaff) =>
        `&&(((moonlight.getConfigOption("experiments","devtools")??false)?true:${isStaff})?(0,`
    }
  },

  // Enable further staff-locked options
  // FIXME: #122, this doesn't work live
  {
    find: "shouldShowLurkerModeUpsellPopout:",
    replace: {
      match: /\.useReducedMotion,isStaff:(.),/,
      replacement: (_, isStaff) =>
        `.useReducedMotion,isStaff:(moonlight.getConfigOption("experiments","staffSettings")??false)?true:${isStaff},`
    }
  }
];
