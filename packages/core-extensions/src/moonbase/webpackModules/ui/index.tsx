import ErrorBoundary from "@moonlight-mod/wp/common_ErrorBoundary";
import BaseHeaderBar from "@moonlight-mod/wp/discord/components/common/BaseHeaderBar";
import HeaderBarClasses from "@moonlight-mod/wp/discord/components/common/HeaderBar.css";
import TabBar from "@moonlight-mod/wp/discord/design/components/TabBar/TabBar";
import Text from "@moonlight-mod/wp/discord/design/components/Text/Text";
import PeoplePageClasses from "@moonlight-mod/wp/discord/modules/people/web/PeoplePage.css";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";
import React from "@moonlight-mod/wp/react";
import AboutPage from "./about";
import ConfigPage from "./config";
import ExtensionsPage from "./extensions";
import RestartAdviceMessage from "./RestartAdvice";
import Update from "./update";

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
  },
  {
    id: "about",
    name: "About",
    element: AboutPage
  }
];

export function Moonbase() {
  const [subsection, setSubsection] = React.useState(0);
  const Page = pages[subsection].element;

  return (
    <ErrorBoundary>
      <div className={`${HeaderBarClasses.children} ${Margins.marginBottom20}`} style={{ minHeight: "32px" }}>
        <Text className={HeaderBarClasses.titleWrapper} variant="heading-lg/semibold" tag="h2">
          Moonbase
        </Text>
        <BaseHeaderBar.Divider />
        <TabBar
          selectedItem={subsection}
          onItemSelect={setSubsection}
          type="top-pill"
          className={PeoplePageClasses.tabBar}
        >
          {pages.map((page, i) => (
            <TabBar.Item key={page.id} id={i} className={PeoplePageClasses.item}>
              {page.name}
            </TabBar.Item>
          ))}
        </TabBar>
      </div>

      <RestartAdviceMessage />
      <Update />

      <Page />
    </ErrorBoundary>
  );
}

export { RestartAdviceMessage, Update };
