import { ExtensionWebExports } from "@moonlight-mod/types";

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  stores: {
    dependencies: [
      { id: "discord/packages/flux" },
      { id: "discord/Dispatcher" }
    ]
  },

  ui: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "discord/packages/react" },
      { ext: "common", id: "components" },
      { ext: "moonbase", id: "stores" },
      "Masks.PANEL_BUTTON",
      "renderArtisanalHack(){",
      '"Missing channel in Channel.openChannelContextMenu"',
      ".forumOrHome]:"
    ]
  },

  moonbase: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { ext: "settings", id: "settings" },
      { id: "discord/packages/react" },
      { ext: "moonbase", id: "ui" }
    ],
    entrypoint: true
  }
};

export const styles = [
  ".moonbase-settings > :first-child { margin-top: 0px; }",
  "textarea.moonbase-resizeable  { resize: vertical }"
];
