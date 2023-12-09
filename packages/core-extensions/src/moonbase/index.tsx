import { ExtensionWebExports, WebpackRequireType } from "@moonlight-mod/types";
import extensionsPage from "./ui/extensions";
import configPage from "./ui/config";

import { CircleXIconSVG, DownloadIconSVG, TrashIconSVG } from "./types";
import ui from "./ui";

export enum MoonbasePage {
  Extensions = "extensions",
  Config = "config"
}

export const pageModules: (require: WebpackRequireType) => Record<
  MoonbasePage,
  {
    name: string;
    element: React.FunctionComponent;
  }
> = (require) => ({
  [MoonbasePage.Extensions]: {
    name: "Extensions",
    element: extensionsPage(require)
  },
  [MoonbasePage.Config]: {
    name: "Config",
    element: configPage(require)
  }
});

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
      CircleXIconSVG,
      "Masks.PANEL_BUTTON",
      "removeButtonContainer:",
      '"Missing channel in Channel.openChannelContextMenu"'
    ],
    entrypoint: true,
    run: (module, exports, require) => {
      const settings = require("settings_settings").Settings;
      const React = require("common_react");
      const spacepack = require("spacepack_spacepack").spacepack;
      const { MoonbaseSettingsStore } =
        require("moonbase_stores") as typeof import("./webpackModules/stores");

      const addSection = (name: string, element: React.FunctionComponent) => {
        settings.addSection(name, name, element, null, -2, {
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
      };

      if (moonlight.getConfigOption<boolean>("moonbase", "sections")) {
        const pages = pageModules(require);

        const { Text } = require("common_components");
        const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;

        settings.addHeader("Moonbase", -2);
        for (const page of Object.values(pages)) {
          addSection(page.name, () => (
            <>
              <Text
                className={Margins.marginBottom20}
                variant="heading-lg/semibold"
                tag="h2"
              >
                Extensions
              </Text>
              <page.element />
            </>
          ));
        }
      } else {
        addSection("Moonbase", ui(require));
      }
    }
  }
};

export const styles = [
  ".moonbase-settings > :first-child { margin-top: 0px; }"
];
