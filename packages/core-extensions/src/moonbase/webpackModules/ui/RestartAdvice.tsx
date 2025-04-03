import { Button, CircleWarningIcon } from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";
import { RestartAdvice } from "../../types";
import HelpMessage from "./HelpMessage";

const strings: Record<RestartAdvice, string> = {
  [RestartAdvice.NotNeeded]: "how did you even",
  [RestartAdvice.ReloadSuggested]: "A reload might be needed to apply some of the changed options.",
  [RestartAdvice.ReloadNeeded]: "A reload is needed to apply some of the changed options.",
  [RestartAdvice.RestartNeeded]: "A restart is needed to apply some of the changed options."
};

const buttonStrings: Record<RestartAdvice, string> = {
  [RestartAdvice.NotNeeded]: "huh?",
  [RestartAdvice.ReloadSuggested]: "Reload",
  [RestartAdvice.ReloadNeeded]: "Reload",
  [RestartAdvice.RestartNeeded]: "Restart"
};

const actions: Record<RestartAdvice, () => void> = {
  [RestartAdvice.NotNeeded]: () => {},
  [RestartAdvice.ReloadSuggested]: () => window.location.reload(),
  [RestartAdvice.ReloadNeeded]: () => window.location.reload(),
  [RestartAdvice.RestartNeeded]: () => MoonbaseSettingsStore.restartDiscord()
};

export default function RestartAdviceMessage() {
  const restartAdvice = useStateFromStores([MoonbaseSettingsStore], () => MoonbaseSettingsStore.restartAdvice);

  if (restartAdvice === RestartAdvice.NotNeeded) return null;

  return (
    <div className="moonbase-help-message-sticky">
      <HelpMessage icon={CircleWarningIcon} text={strings[restartAdvice]} type="warning">
        <Button color={Button.Colors.YELLOW} onClick={actions[restartAdvice]} size={Button.Sizes.TINY}>
          {buttonStrings[restartAdvice]}
        </Button>
      </HelpMessage>
    </div>
  );
}
