import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  stores: {
    dependencies: [
      { id: "discord/packages/flux" },
      { id: "discord/Dispatcher" }
    ]
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

  moonbase: {
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
  }
};

export const styles = [
  ".moonbase-settings > :first-child { margin-top: 0px; }",
  "textarea.moonbase-resizeable  { resize: vertical }",
  ".moonbase-updates-notice { background-color: #222034; color: #FFFBA6; }"
];
