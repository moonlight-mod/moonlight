import { ExtensionWebExports } from "@moonlight-mod/types";

import { CircleXIconSVG, DownloadIconSVG, TrashIconSVG } from "./types";

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  stores: {
    dependencies: [
      { ext: "common", id: "flux" },
      { ext: "common", id: "fluxDispatcher" }
    ]
  },

  ui: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { ext: "common", id: "react" },
      { ext: "common", id: "components" },
      { ext: "moonbase", id: "stores" },
      DownloadIconSVG,
      TrashIconSVG,
      CircleXIconSVG,
      "Masks.PANEL_BUTTON",
      "removeButtonContainer:",
      '"Missing channel in Channel.openChannelContextMenu"',
      ".default.HEADER_BAR"
    ]
  },

  moonbase: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { ext: "settings", id: "settings" },
      { ext: "common", id: "react" },
      { ext: "moonbase", id: "ui" }
    ],
    entrypoint: true
  }
};

export const styles = [
  ".moonbase-settings > :first-child { margin-top: 0px; }"
];
