import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import React from "@moonlight-mod/wp/react";
import { UpdateState } from "../../types";
import HelpMessage from "./HelpMessage";

const { ThemeDarkIcon, Button } = Components;

const logger = moonlight.getLogger("moonbase/ui/update");

const strings: Record<UpdateState, string> = {
  [UpdateState.Ready]: "A new version of moonlight is available.",
  [UpdateState.Working]: "Updating moonlight...",
  [UpdateState.Installed]: "Updated. Restart Discord to apply changes.",
  [UpdateState.Failed]: "Failed to update moonlight. Please use the installer instead."
};

export default function Update() {
  const [state, setState] = React.useState(UpdateState.Ready);
  const newVersion = useStateFromStores([MoonbaseSettingsStore], () => MoonbaseSettingsStore.newVersion);

  if (newVersion == null) return null;

  return (
    <HelpMessage text={strings[state]} className="moonbase-update-section" icon={ThemeDarkIcon}>
      <div className="moonbase-help-message-buttons">
        {state === UpdateState.Installed && (
          <Button
            look={Button.Looks.OUTLINED}
            color={Button.Colors.CUSTOM}
            size={Button.Sizes.TINY}
            onClick={() => {
              MoonbaseSettingsStore.restartDiscord();
            }}
          >
            Restart Discord
          </Button>
        )}

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
    </HelpMessage>
  );
}
