import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "window.DiscordErrors=",
    replace: [
      // replace reporting line with update status
      {
        // CvQlAA mapped to ERRORS_ACTION_TO_TAKE
        // FIXME: Better patch find?
        match: /,(\(0,.\.jsx\))\("p",{children:.\.intl\.string\(.\..\.CvQlAA\)}\)/,
        replacement: (_, createElement) =>
          `,${createElement}(require("moonbase_crashScreen").UpdateText,{state:this.state,setState:this.setState.bind(this)})`
      },

      // wrap actions field to display error details
      {
        match: /(?<=return(\(0,.\.jsx\))\(.+?,)action:(.),className:/,
        replacement: (_, createElement, action) =>
          `action:${createElement}(require("moonbase_crashScreen").wrapAction,{action:${action},state:this.state}),className:`
      },

      // add update button
      // +hivLS -> ERRORS_RELOAD
      {
        match: /(?<=\["\+hivLS"\]\)}\),(\(0,.\.jsx\))\(.,{}\))/,
        replacement: (_, createElement) =>
          `,${createElement}(require("moonbase_crashScreen").UpdateButton,{state:this.state,setState:this.setState.bind(this)})`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  stores: {
    dependencies: [{ id: "discord/packages/flux" }, { id: "discord/Dispatcher" }]
  },

  ui: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "react" },
      { id: "discord/components/common/index" },
      { ext: "moonbase", id: "stores" },
      { id: "discord/modules/guild_settings/IntegrationCard.css" },
      "Masks.PANEL_BUTTON",
      '"Missing channel in Channel.openChannelContextMenu"',
      ".forumOrHome]:"
    ]
  },

  settings: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { ext: "settings", id: "settings" },
      { id: "react" },
      { ext: "moonbase", id: "ui" }
    ],
    entrypoint: true
  },

  updates: {
    dependencies: [
      { id: "react" },
      { ext: "moonbase", id: "stores" },
      { ext: "notices", id: "notices" },
      {
        ext: "spacepack",
        id: "spacepack"
      }
    ],
    entrypoint: true
  },

  moonbase: {
    dependencies: [{ ext: "moonbase", id: "stores" }]
  },

  crashScreen: {
    dependencies: [{ id: "react" }]
  }
};
