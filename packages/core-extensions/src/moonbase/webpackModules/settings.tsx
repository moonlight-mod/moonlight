import settings from "@moonlight-mod/wp/settings_settings";
import redesign from "@moonlight-mod/wp/settings_redesign";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Moonbase, pages, RestartAdviceMessage, Update } from "@moonlight-mod/wp/moonbase_ui";
import UserSettingsModalActionCreators from "@moonlight-mod/wp/discord/actions/UserSettingsModalActionCreators";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import { Text, Breadcrumbs } from "@moonlight-mod/wp/discord/components/common/index";
import { MenuItem } from "@moonlight-mod/wp/contextMenu_contextMenu";
import {
  createSection,
  createSidebarItem,
  createPane,
  createPanel
} from "@moonlight-mod/wp/discord/modules/user_settings/redesign/SettingsItemCreators";
import ThemeDarkIcon from "@moonlight-mod/wp/moonbase_ThemeDarkIcon";

const notice = {
  stores: [MoonbaseSettingsStore],
  element: () => {
    // Require it here because lazy loading SUX
    const SettingsNotice = spacepack.require("discord/components/common/SettingsNotice").default;
    return (
      <SettingsNotice
        submitting={MoonbaseSettingsStore.submitting}
        onReset={() => {
          MoonbaseSettingsStore.reset();
        }}
        onSave={async () => {
          await MoonbaseSettingsStore.writeConfig();
        }}
      />
    );
  }
};

const oldLocation = MoonbaseSettingsStore.getExtensionConfigRaw<boolean>("moonbase", "oldLocation", false);
const position = oldLocation ? -2 : -9999;

function addSection(id: string, name: string, element: React.FunctionComponent) {
  settings.addSection(`moonbase-${id}`, name, element, null, position, notice);
}

// FIXME: move to component types
type Breadcrumb = {
  id: string;
  label: string;
};

function renderBreadcrumb(crumb: Breadcrumb, last: boolean) {
  return (
    <Text variant="heading-lg/semibold" tag="h2" color={last ? "header-primary" : "header-secondary"}>
      {crumb.label}
    </Text>
  );
}

if (!oldLocation) {
  settings.addDivider(position);
}

if (MoonbaseSettingsStore.getExtensionConfigRaw<boolean>("moonbase", "sections", false)) {
  if (oldLocation) settings.addHeader("moonlight", position);

  const _pages = oldLocation ? pages : pages.reverse();
  for (const page of _pages) {
    addSection(page.id, page.name, () => {
      const breadcrumbs = [
        { id: "moonbase", label: "Moonbase" },
        { id: page.id, label: page.name }
      ];
      return (
        <>
          <Breadcrumbs
            className={Margins.marginBottom20}
            renderCustomBreadcrumb={renderBreadcrumb}
            breadcrumbs={breadcrumbs}
            activeId={page.id}
          >
            {page.name}
          </Breadcrumbs>

          <RestartAdviceMessage />
          <Update />

          <page.element />
        </>
      );
    });
  }

  if (!oldLocation) settings.addHeader("moonlight", position);
} else {
  settings.addSection("moonbase", "moonlight", Moonbase, null, position, notice);

  settings.addSectionMenuItems(
    "moonbase",
    ...pages.map((page, i) => (
      <MenuItem
        key={page.id}
        id={`moonbase-${page.id}`}
        label={page.name}
        action={() => UserSettingsModalActionCreators.open("moonbase", i.toString())}
      />
    ))
  );
}

const redesignTitle = () => "moonlight";
const redesignPane = createPane("moonbase_pane", {
  useTitle: redesignTitle,
  buildLayout: () => [],
  render: Moonbase
});
const redesignPanel = createPanel("moonbase_panel", {
  useTitle: redesignTitle,
  buildLayout: () => [redesignPane],
  notice
});
const redesignSidebarItem = createSidebarItem("moonbase_item", {
  icon: ThemeDarkIcon,
  useTitle: redesignTitle,
  useSearchTerms: () => ["moonlight", "moonbase", "plugins", "extensions", "config"],
  buildLayout: () => [redesignPanel]
});
const redesignSection = createSection("moonbase_section", {
  buildLayout: () => [redesignSidebarItem]
});
redesign.addSection(redesignSection, oldLocation ? "logout" : "profile_panel", oldLocation!);
