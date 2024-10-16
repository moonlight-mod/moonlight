import React from "@moonlight-mod/wp/react";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";

const { Button, ButtonSizes } = Components;

const logger = moonlight.getLogger("moonbase/crashScreen");

type ErrorState = {
  error: Error;
  info: {
    componentStack: string;
  };
  __moonlight_update?: UpdateState;
};

enum UpdateState {
  Ready,
  Working,
  Installed,
  Failed
}

const updateStrings: Record<UpdateState, string> = {
  [UpdateState.Ready]: "A new version of moonlight is available.",
  [UpdateState.Working]: "Updating moonlight...",
  [UpdateState.Installed]: "Updated moonlight. Click Reload to apply changes.",
  [UpdateState.Failed]: "Failed to update moonlight. Please use the installer."
};
const buttonStrings: Record<UpdateState, string> = {
  [UpdateState.Ready]: "Update moonlight",
  [UpdateState.Working]: "Updating moonlight...",
  [UpdateState.Installed]: "",
  [UpdateState.Failed]: "Update failed"
};

export function wrapAction(action: React.ReactNode, { error, info }: ErrorState) {
  return (
    <div className="moonbase-crash-wrapper">
      {action}
      <div className="moonbase-crash-details-wrapper">
        <pre className="moonbase-crash-details">
          <code>
            {error.stack}
            {"\n\nComponent stack:"}
            {info.componentStack}
          </code>
        </pre>
      </div>
    </div>
  );
}

export function UpdateText({ state, setState }: { state: ErrorState; setState: (state: ErrorState) => void }) {
  if (!state.__moonlight_update) {
    setState({
      ...state,
      __moonlight_update: UpdateState.Ready
    });
  }
  const newVersion = useStateFromStores([MoonbaseSettingsStore], () => MoonbaseSettingsStore.newVersion);

  return newVersion == null ? null : (
    <p>{state.__moonlight_update !== undefined ? updateStrings[state.__moonlight_update] : ""}</p>
  );
}

export function UpdateButton({ state, setState }: { state: ErrorState; setState: (state: ErrorState) => void }) {
  const newVersion = useStateFromStores([MoonbaseSettingsStore], () => MoonbaseSettingsStore.newVersion);
  return newVersion == null ||
    state.__moonlight_update === UpdateState.Installed ||
    state.__moonlight_update === undefined ? null : (
    <Button
      size={ButtonSizes.LARGE}
      disabled={state.__moonlight_update !== UpdateState.Ready}
      onClick={() => {
        setState({
          ...state,
          __moonlight_update: UpdateState.Working
        });

        MoonbaseSettingsStore.updateMoonlight()
          .then(() => {
            setState({
              ...state,
              __moonlight_update: UpdateState.Installed
            });
          })
          .catch((e) => {
            logger.error(e);
            setState({
              ...state,
              __moonlight_update: UpdateState.Failed
            });
          });
      }}
    >
      {state.__moonlight_update !== undefined ? buttonStrings[state.__moonlight_update] : ""}
    </Button>
  );
}
