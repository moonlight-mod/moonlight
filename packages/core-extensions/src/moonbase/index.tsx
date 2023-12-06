import { ExtensionWebExports } from "@moonlight-mod/types";
import ui from "./ui";
import { DownloadIconSVG, TrashIconSVG } from "./types";

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  stores: {
    dependencies: [
      { ext: "common", id: "flux" },
      { ext: "common", id: "fluxDispatcher" }
    ]
  },

  moonbase: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { ext: "settings", id: "settings" },
      { ext: "common", id: "react" },
      { ext: "common", id: "components" },
      { ext: "moonbase", id: "stores" },
      DownloadIconSVG,
      TrashIconSVG,
      "Masks.PANEL_BUTTON"
    ],
    entrypoint: true,
    run: (module, exports, require) => {
      const settings = require("settings_settings").Settings;
      const React = require("common_react");
      const spacepack = require("spacepack_spacepack").spacepack;
      const { MoonbaseSettingsStore } =
        require("moonbase_stores") as typeof import("./webpackModules/stores");

      settings.addSection("Moonbase", "Moonbase", ui(require), null, -2, {
        stores: [MoonbaseSettingsStore],
        element: () => {
          // Require it here because lazy loading SUX
          const SettingsNotice =
            spacepack.findByCode("onSaveButtonColor")[0].exports.default;
          return (
            <SettingsNotice
              submitting={MoonbaseSettingsStore.submitting}
              onReset={() => {
                MoonbaseSettingsStore.reset();
              }}
              onSave={() => {
                MoonbaseSettingsStore.writeConfig();
              }}
            />
          );
        }
      });
    }
  }
};
