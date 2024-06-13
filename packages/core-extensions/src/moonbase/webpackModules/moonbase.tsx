import settings from "@moonlight-mod/wp/settings_settings";
import React from "@moonlight-mod/wp/common_react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Moonbase, pages } from "@moonlight-mod/wp/moonbase_ui";

import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import { MenuItem } from "@moonlight-mod/wp/common_components";

const { open } = spacepack.findByExports("setSection", "clearSubsection")[0]
  .exports.default;

settings.addSection("moonbase", "Moonbase", Moonbase, null, -2, {
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
