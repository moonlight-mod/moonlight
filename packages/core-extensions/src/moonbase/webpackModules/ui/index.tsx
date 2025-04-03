import { UserSettingsModalStore } from "@moonlight-mod/wp/common_stores";
import UserSettingsModalActionCreators from "@moonlight-mod/wp/discord/actions/UserSettingsModalActionCreators";
import { Divider } from "@moonlight-mod/wp/discord/components/common/BaseHeaderBar";
import HeaderBarClasses from "@moonlight-mod/wp/discord/components/common/HeaderBar.css";

import { TabBar, Text } from "@moonlight-mod/wp/discord/components/common/index";
import PeoplePageClasses from "@moonlight-mod/wp/discord/modules/people/web/PeoplePage.css";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";
import React from "@moonlight-mod/wp/react";
import AboutPage from "./about";
import ConfigPage from "./config";
import ExtensionsPage from "./extensions";
import RestartAdviceMessage from "./RestartAdvice";
import Update from "./update";

export const pages: Array<{
  id: string;
  name: string;
  element: React.FunctionComponent;
}> = [
  {
    id: "extensions",
    name: "Extensions",
    element: ExtensionsPage
  },
  {
    id: "config",
    name: "Config",
    element: ConfigPage
  },
  {
    id: "about",
    name: "About",
    element: AboutPage
  }
];

export function Moonbase(_props: { initialTab?: number } = {}) {
  const subsection = useStateFromStores([UserSettingsModalStore], () => UserSettingsModalStore.getSubsection() ?? 0);
  const setSubsection = React.useCallback(
    (to: string) => {
      if (subsection !== to) UserSettingsModalActionCreators.setSection("moonbase", to);
    },
    [subsection]
  );

  React.useEffect(
    () => () => {
      // Normally there's an onSettingsClose prop you can set but we don't expose it and I don't care enough to add support for it right now
      UserSettingsModalActionCreators.clearSubsection("moonbase");
    },
    []
  );

  return (
    <>
      <div className={`${HeaderBarClasses.children} ${Margins.marginBottom20}`}>
        <Text className={HeaderBarClasses.titleWrapper} tag="h2" variant="heading-lg/semibold">
          Moonbase
        </Text>
        <Divider />
        <TabBar
          className={PeoplePageClasses.tabBar}
          onItemSelect={setSubsection}
          selectedItem={subsection}
          type="top-pill"
        >
          {pages.map((page, i) => (
            <TabBar.Item className={PeoplePageClasses.item} id={i} key={page.id}>
              {page.name}
            </TabBar.Item>
          ))}
        </TabBar>
      </div>

      <RestartAdviceMessage />
      <Update />

      {React.createElement(pages[subsection].element)}
    </>
  );
}

export { RestartAdviceMessage, Update };
