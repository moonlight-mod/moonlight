import settings from "@moonlight-mod/wp/settings_settings";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Moonbase, pages, RestartAdviceMessage, Update } from "@moonlight-mod/wp/moonbase_ui";

import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";

const { MenuItem, Text, Breadcrumbs } = Components;

const Margins = spacepack.require("discord/styles/shared/Margins.css");

// discord/actions/UserSettingsModalActionCreators
const { open } = spacepack.findByCode(':"USER_SETTINGS_MODAL_SET_SECTION"')[0].exports.Z;

let SettingsNotice;
const notice = {
  stores: [MoonbaseSettingsStore],
  element: () => {
    // Require it here because lazy loading SUX
    // discord/components/common/SettingsNotice
    SettingsNotice ??= spacepack.findByCode("onSaveButtonColor", "FocusRingScope")[0].exports.Z;
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
  if (oldLocation) settings.addHeader("Moonbase", position);

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

  if (!oldLocation) settings.addHeader("Moonbase", position);
} else {
  settings.addSection("moonbase", "Moonbase", Moonbase, null, position, notice);

  settings.addSectionMenuItems(
    "moonbase",
    ...pages.map((page, i) => (
      <MenuItem key={page.id} id={`moonbase-${page.id}`} label={page.name} action={() => open("moonbase", i)} />
    ))
  );
}
