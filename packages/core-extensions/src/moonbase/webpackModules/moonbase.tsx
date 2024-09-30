import settings from "@moonlight-mod/wp/settings_settings";
import React from "@moonlight-mod/wp/common_react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { Moonbase, pages } from "@moonlight-mod/wp/moonbase_ui";

import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import { Text } from "@moonlight-mod/wp/common_components";

function addSection(name: string, element: React.FunctionComponent) {
  settings.addSection(name, name, element, null, -2, {
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
          disabled={false}
        />
      );
    }
  });
}

if (moonlight.getConfigOption<boolean>("moonbase", "sections")) {
  const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;

  settings.addHeader("Moonbase", -2);
  for (const page of Object.values(pages)) {
    addSection(page.name, () => (
      <>
        <Text
          className={Margins.marginBottom20}
          variant="heading-lg/semibold"
          tag="h2"
        >
          Extensions
        </Text>
        <page.element />
      </>
    ));
  }
} else {
  addSection("Moonbase", Moonbase);
}
