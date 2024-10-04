import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import {
  Text,
  TabBar
} from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { UserSettingsModalStore } from "@moonlight-mod/wp/common_stores";

import ExtensionsPage from "./extensions";
import ConfigPage from "./config";

const { Divider } = spacepack.findByCode(".forumOrHome]:")[0].exports.Z;
const TitleBarClasses = spacepack.findByCode("iconWrapper:", "children:")[0]
  .exports;
const TabBarClasses = spacepack.findByCode("nowPlayingColumn:")[0].exports;
const { setSection, clearSubsection } = spacepack.findByExports(
  "setSection",
  "clearSubsection"
)[0].exports.Z;
const Margins = spacepack.require("discord/styles/shared/Margins.css");

export const pages: {
  id: string;
  name: string;
  element: React.FunctionComponent;
}[] = [
  {
    id: "extensions",
    name: "Extensions",
    element: ExtensionsPage
  },
  {
    id: "config",
    name: "Config",
    element: ConfigPage
  }
];

export function Moonbase(props: { initialTab?: number } = {}) {
  const subsection = useStateFromStores(
    [UserSettingsModalStore],
    () => UserSettingsModalStore.getSubsection() ?? 0
  );
  const setSubsection = React.useCallback(
    (to: string) => {
      if (subsection !== to) setSection("moonbase", to);
    },
    [subsection]
  );

  React.useEffect(
    () => () => {
      // Normally there's an onSettingsClose prop you can set but we don't expose it and I don't care enough to add support for it right now
      clearSubsection("moonbase");
    },
    []
  );

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
          selectedItem={subsection}
          onItemSelect={setSubsection}
          type="top-pill"
          className={TabBarClasses.tabBar}
        >
          {pages.map((page, i) => (
            <TabBar.Item key={page.id} id={i} className={TabBarClasses.item}>
              {page.name}
            </TabBar.Item>
          ))}
        </TabBar>
      </div>

      {React.createElement(pages[subsection].element)}
    </>
  );
}
