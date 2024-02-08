import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: '.displayName="ExperimentStore"',
    replace: {
      match: "window.GLOBAL_ENV.RELEASE_CHANNEL",
      replacement: '"staging"'
    }
  },
  {
    find: '.displayName="DeveloperExperimentStore"',
    replace: [
      {
        match: /CONNECTION_OPEN:.,OVERLAY_INITIALIZE:.,CURRENT_USER_UPDATE:./,
        replacement: ""
      },
      {
        match: '"production"',
        replacement: '"development"'
      },
      {
        match: /get:\(\)=>./,
        replacement: "get:()=>true"
      }
    ]
  },

  {
    find: ".HEADER_BAR)",
    replace: {
      match:
        /,(.)\?(\(0,.\.jsx\)\(.{1,3}\.default,{}\)):(\(0,.\.jsx\)\(.{1,3}\.default,{}\))\]/,
      replacement: (_, isStaff, StaffHelpButton, HelpButton) =>
        `,(moonlight.getConfigOption("experiments","staffSettings")??${isStaff})?${StaffHelpButton}:${HelpButton}]`
    }
  },
  {
    find: 'title:"Developer Flags"',
    replace: {
      match: /\(null==.\?void 0:.\.isStaff\(\)\)/g,
      replacement: (orig: string) =>
        `(moonlight.getConfigOption("experiments","staffSettings")?true:${orig})`
    }
  }
];
