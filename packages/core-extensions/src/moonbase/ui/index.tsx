import { WebpackRequireType } from "@moonlight-mod/types";
import { MoonbasePage, pageModules } from "..";

export default (require: WebpackRequireType) => {
  const React = require("common_react");
  const spacepack = require("spacepack_spacepack").spacepack;

  const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;

  const { Divider } = spacepack.findByCode(".default.HEADER_BAR")[0].exports
    .default;
  const TitleBarClasses = spacepack.findByCode("iconWrapper:", "children:")[0]
    .exports;
  const TabBarClasses = spacepack.findByCode("nowPlayingColumn:")[0].exports;

  const pages = pageModules(require);

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
            {Object.entries(pages).map(([id, page]) => (
              <TabBar.Item key={id} id={id} className={TabBarClasses.item}>
                {page.name}
              </TabBar.Item>
            ))}
          </TabBar>
        </div>

        {React.createElement(pages[selectedTab].element)}
      </>
    );
  };
};
