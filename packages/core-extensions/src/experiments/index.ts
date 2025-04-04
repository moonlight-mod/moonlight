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

  // Enable staff help menu
  {
    find: ".HEADER_BAR)",
    replace: {
      match: /&&\((.)\?\(0,/,
      replacement: (_, isStaff) =>
        `&&(((moonlight.getConfigOption("experiments","devtools")??false)?true:${isStaff})?(0,`
    }
  },
  // staff help menu - visual refresh
  {
    find: '("AppTitleBar")',
    replace: {
      match: /{hasBugReporterAccess:(\i)}=\i\.\i\.useExperiment\({location:"HeaderBar"},{autoTrackExposure:!1}\);/,
      replacement: (orig, isStaff) =>
        `${orig}if(moonlight.getConfigOption("experiments","devtools")??false)${isStaff}=true;`
    }
  },
  {
    find: 'navId:"staff-help-popout",',
    replace: {
      match: /isDiscordDeveloper:(\i)}\),/,
      replacement: (_, isStaff) =>
        `isDiscordDeveloper:(moonlight.getConfigOption("experiments","devtools")??false)||${isStaff}}),`
    }
  },

  // Enable further staff-locked options
  {
    find: "shouldShowLurkerModeUpsellPopout:",
    replace: {
      match: /\.useReducedMotion,isStaff:(.),/,
      replacement: (_, isStaff) =>
        `.useReducedMotion,isStaff:(moonlight.getConfigOption("experiments","staffSettings")??false)?true:${isStaff},`
    }
  }
];
