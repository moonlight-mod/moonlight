import React from "@moonlight-mod/wp/common_react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Text, TabBar } from "@moonlight-mod/wp/common_components";

import ExtensionsPage from "./extensions";
import ConfigPage from "./config";

const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;

const { Divider } = spacepack.findByCode(".default.HEADER_BAR")[0].exports
  .default;
const TitleBarClasses = spacepack.findByCode("iconWrapper:", "children:")[0]
  .exports;
const TabBarClasses = spacepack.findByCode("nowPlayingColumn:")[0].exports;

export const pages: Record<
  string,
  {
    name: string;
    element: React.FunctionComponent;
  }
> = {
  extensions: {
    name: "Extensions",
    element: ExtensionsPage
  },
  config: {
    name: "Config",
    element: ConfigPage
  }
};

export function Moonbase() {
  const [selectedTab, setSelectedTab] = React.useState(Object.keys(pages)[0]);

  return (
    <>
      <div className={`${TitleBarClasses.children} ${Margins.marginBottom20}`}>
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
}
