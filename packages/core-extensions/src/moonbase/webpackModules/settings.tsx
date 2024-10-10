import settings from "@moonlight-mod/wp/settings_settings";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Moonbase, pages } from "@moonlight-mod/wp/moonbase_ui";

import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";

import Update from "./ui/update";

const { MenuItem, Text, Breadcrumbs } = Components;

const Margins = spacepack.require("discord/styles/shared/Margins.css");

const { open } = spacepack.findByExports("setSection", "clearSubsection")[0]
  .exports.Z;

const notice = {
  stores: [MoonbaseSettingsStore],
  element: () => {
    // Require it here because lazy loading SUX
    const SettingsNotice = spacepack.findByCode(
      "onSaveButtonColor",
      "FocusRingScope"
    )[0].exports.Z;
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

function addSection(
  id: string,
  name: string,
  element: React.FunctionComponent
) {
  settings.addSection(`moonbase-${id}`, name, element, null, -2, notice);
}

// FIXME: move to component types
type Breadcrumb = {
  id: string;
  label: string;
};

function renderBreadcrumb(crumb: Breadcrumb, last: boolean) {
  return (
    <Text
      variant="heading-lg/semibold"
      tag="h2"
      color={last ? "header-primary" : "header-secondary"}
    >
      {crumb.label}
    </Text>
  );
}

if (
  MoonbaseSettingsStore.getExtensionConfigRaw<boolean>(
    "moonbase",
    "sections",
    false
  )
) {
  settings.addHeader("Moonbase", -2);

  for (const page of pages) {
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

          <Update />

          <page.element />
        </>
      );
    });
  }
} else {
  settings.addSection("moonbase", "Moonbase", Moonbase, null, -2, notice);

  settings.addSectionMenuItems(
    "moonbase",
    ...pages.map((page, i) => (
      <MenuItem
        key={page.id}
        id={`moonbase-${page.id}`}
        label={page.name}
        action={() => open("moonbase", i)}
      />
    ))
  );
}
