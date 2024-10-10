import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";

enum UpdateState {
  Ready,
  Working,
  Installed,
  Failed
}

const { ThemeDarkIcon, Text, Button } = Components;
const Margins = spacepack.require("discord/styles/shared/Margins.css");
const HelpMessageClasses = spacepack.findByExports("positive", "iconDiv")[0]
  .exports;

const logger = moonlight.getLogger("moonbase/ui/update");

const strings: Record<UpdateState, string> = {
  [UpdateState.Ready]: "A new version of moonlight is available.",
  [UpdateState.Working]: "Updating moonlight...",
  [UpdateState.Installed]: "Updated. Restart Discord to apply changes.",
  [UpdateState.Failed]:
    "Failed to update moonlight. Please use the installer instead."
};

export default function Update() {
  const [state, setState] = React.useState(UpdateState.Ready);
  const newVersion = useStateFromStores(
    [MoonbaseSettingsStore],
    () => MoonbaseSettingsStore.newVersion
  );

  if (newVersion == null) return null;

  // reimpl of HelpMessage but with a custom icon
  return (
    <div
      className={`${Margins.marginBottom20} ${HelpMessageClasses.info} ${HelpMessageClasses.container} moonbase-update-section`}
    >
      <Flex direction={Flex.Direction.HORIZONTAL}>
        <div
          className={HelpMessageClasses.iconDiv}
          style={{
            alignItems: "center"
          }}
        >
          <ThemeDarkIcon
            size="sm"
            color="currentColor"
            className={HelpMessageClasses.icon}
          />
        </div>

        <Text
          variant="text-sm/medium"
          color="currentColor"
          className={HelpMessageClasses.text}
        >
          {strings[state]}
        </Text>
      </Flex>

      <Button
        look={Button.Looks.OUTLINED}
        color={Button.Colors.CUSTOM}
        size={Button.Sizes.TINY}
        disabled={state !== UpdateState.Ready}
        onClick={() => {
          setState(UpdateState.Working);

          MoonbaseSettingsStore.updateMoonlight()
            .then(() => setState(UpdateState.Installed))
            .catch((e) => {
              logger.error(e);
              setState(UpdateState.Failed);
            });
        }}
      >
        Update
      </Button>
    </div>
  );
}
