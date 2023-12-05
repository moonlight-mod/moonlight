import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: /\.displayName="(Developer)?ExperimentStore"/,
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
        match: /(get:function\(\){return .}}}\);).\(\);/,
        replacement: "$1"
      }
    ]
  }
];
