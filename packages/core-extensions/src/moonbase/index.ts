import type { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "window.DiscordErrors=",
    replace: [
      // replace reporting line with update status
      {
        // CvQlAH mapped to ERRORS_ACTION_TO_TAKE
        // FIXME: Better patch find?
        match: /,(\(0,(\i)\.jsx\))\("p",{children:\i\.intl\.string\(\i\.t\.CvQlAH\)}\)/,
        replacement: (_, createElement, ReactJSX) =>
          `,${createElement}(require("moonbase_crashScreen")?.UpdateText??${ReactJSX}.Fragment,{state:this.state,setState:this.setState.bind(this)})`
      },

      // wrap actions field to display error details
      {
        match: /(?<=return(\(0,\i\.jsx\))\(.+?,)action:(\i),className:/,
        replacement: (_, createElement, action) =>
          `action:require("moonbase_crashScreen")?.wrapAction?${createElement}(require("moonbase_crashScreen").wrapAction,{action:${action},state:this.state}):${action},className:`
      },

      // add update button
      {
        match: /(?<=,onClick:this\._handleSubmitReport}\),(\(0,(\i)\.jsx\))\(\i,{}\))/,
        replacement: (_, createElement, ReactJSX) =>
          `,${createElement}(require("moonbase_crashScreen")?.UpdateButton??${ReactJSX}.Fragment,{state:this.state,setState:this.setState.bind(this)})`
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
      { id: "discord/design/components/TabBar/TabBar" },
      { id: "discord/design/components/Text/Text" },
      { id: "discord/design/components/Heading/Heading" },
      { id: "discord/modules/icons/web/CircleWarningIcon" },
      { id: "discord/design/components/ThemeContextProvider/ThemeContext" },
      { id: "discord/design/components/Modal/web/Modal" },
      { ext: "moonbase", id: "stores" },
      { ext: "moonbase", id: "ThemeDarkIcon" },
      { id: "discord/modules/guild_settings/web/AppCard.css" },
      { ext: "contextMenu", id: "contextMenu" },
      { id: "discord/modules/modals/Modals" },
      "Masks.PANEL_BUTTON",
      '"Missing channel in Channel.openChannelContextMenu"'
    ]
  },

  ThemeDarkIcon: {
    dependencies: [{ ext: "common", id: "icons" }, { id: "react" }]
  },

  settings: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { ext: "settings", id: "settings" },
      { id: "react" },
      { ext: "moonbase", id: "ui" },
      { ext: "contextMenu", id: "contextMenu" },
      { id: "discord/design/components/Text/Text" },
      { id: "discord/design/components/Breadcrumbs/web/Breadcrumbs" },
      { id: "discord/modules/user_settings/redesign/SettingsItemCreators" },
      ':"USER_SETTINGS_MODAL_SET_SECTION"'
    ],
    entrypoint: true
  },

  updates: {
    dependencies: [
      { id: "react" },
      { ext: "moonbase", id: "stores" },
      { ext: "moonbase", id: "ThemeDarkIcon" },
      { ext: "notices", id: "notices" },
      {
        ext: "spacepack",
        id: "spacepack"
      },
      { id: "discord/Constants" },
      { id: "discord/components/common/index" }
    ],
    entrypoint: true
  },

  moonbase: {
    dependencies: [{ ext: "moonbase", id: "stores" }]
  },

  crashScreen: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "react" },
      { ext: "moonbase", id: "stores" },
      { id: "discord/packages/flux" },
      { id: "discord/design/components/Button/web/Button" },
      { id: "discord/design/components/TabBar/TabBar" },
      { id: "discord/modules/discovery/web/Discovery.css" }
    ]
  }
};
