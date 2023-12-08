import { WebpackRequireType } from "@moonlight-mod/types";
import extensionsPage from "./extensions";
import configPage from "./config";

export enum MoonbasePage {
  Extensions,
  Config
}

export default (require: WebpackRequireType) => {
  const React = require("common_react");
  const spacepack = require("spacepack_spacepack").spacepack;

  const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;

  const { Divider } = spacepack.findByCode(".default.HEADER_BAR")[0].exports
    .default;
  const TitleBarClasses = spacepack.findByCode("iconWrapper:", "children:")[0]
    .exports;
  const TabBarClasses = spacepack.findByCode("nowPlayingColumn:")[0].exports;

  const ExtensionsPage = extensionsPage(require);
  const ConfigPage = configPage(require);

  return function Moonbase() {
    const { Text, TabBar } = require("common_components");

    const [selectedTab, setSelectedTab] = React.useState(
      MoonbasePage.Extensions
    );

    return (
      <>
        <div
          className={`${TitleBarClasses.children} ${Margins.marginBottom20}`}
        >
          <Text
            className={TitleBarClasses.titleWrapper}
            variant="heading-lg/semibold"
            tag="h2"
          >
            Moonbase
          </Text>
          <Divider />
          <TabBar
            selectedItem={selectedTab}
            onItemSelect={setSelectedTab}
            type="top-pill"
            className={TabBarClasses.tabBar}
          >
            <TabBar.Item
              id={MoonbasePage.Extensions}
              className={TabBarClasses.item}
            >
              Extensions
            </TabBar.Item>
            <TabBar.Item
              id={MoonbasePage.Config}
              className={TabBarClasses.item}
            >
              Config
            </TabBar.Item>
          </TabBar>
        </div>

        {selectedTab === MoonbasePage.Extensions && <ExtensionsPage />}
        {selectedTab === MoonbasePage.Config && <ConfigPage />}
      </>
    );
  };
};
