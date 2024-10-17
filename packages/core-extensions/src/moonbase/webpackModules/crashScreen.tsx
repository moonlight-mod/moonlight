import React from "@moonlight-mod/wp/react";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores, useStateFromStoresObject } from "@moonlight-mod/wp/discord/packages/flux";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import { RepositoryManifest, UpdateState } from "../types";

const { Button, TabBar } = Components;
const TabBarClasses = spacepack.findByCode(/\.exports={tabBar:"tabBar_[a-z0-9]+",tabBarItem:"tabBarItem_[a-z0-9]+"}/)[0]
  .exports;

const logger = moonlight.getLogger("moonbase/crashScreen");

type ErrorState = {
  error: Error;
  info: {
    componentStack: string;
  };
  __moonlight_update?: UpdateState;
};

type WrapperProps = {
  action: React.ReactNode;
  state: ErrorState;
};

type UpdateCardProps = {
  id: number;
  ext: {
    version: string;
    download: string;
    updateManifest: RepositoryManifest;
  };
};

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
const extensionButtonStrings: Record<UpdateState, string> = {
  [UpdateState.Ready]: "Update",
  [UpdateState.Working]: "Updating...",
  [UpdateState.Installed]: "Updated",
  [UpdateState.Failed]: "Update failed"
};

function ExtensionUpdateCard({ id, ext }: UpdateCardProps) {
  const [state, setState] = React.useState(UpdateState.Ready);
  const installed = useStateFromStores([MoonbaseSettingsStore], () => MoonbaseSettingsStore.getExtension(id), [id]);

  return (
    <div className="moonbase-crash-extensionCard">
      <div className="moonbase-crash-extensionCard-meta">
        <div className="moonbase-crash-extensionCard-title">
          {ext.updateManifest.meta?.name ?? ext.updateManifest.id}
        </div>
        <div className="moonbase-crash-extensionCard-version">{`v${installed?.manifest?.version ?? "???"} -> v${
          ext.version
        }`}</div>
      </div>
      <div className="moonbase-crash-extensionCard-button">
        <Button
          color={Button.Colors.GREEN}
          disabled={state !== UpdateState.Ready}
          onClick={() => {
            setState(UpdateState.Working);
            MoonbaseSettingsStore.installExtension(id)
              .then(() => setState(UpdateState.Installed))
              .catch(() => setState(UpdateState.Failed));
          }}
        >
          {extensionButtonStrings[state]}
        </Button>
      </div>
    </div>
  );
}

export function wrapAction({ action, state }: WrapperProps) {
  const [tab, setTab] = React.useState("crash");

  const { updates, updateCount } = useStateFromStoresObject([MoonbaseSettingsStore], () => {
    const { updates } = MoonbaseSettingsStore;
    return {
      updates: Object.entries(updates),
      updateCount: Object.keys(updates).length
    };
  });

  return (
    <div className="moonbase-crash-wrapper">
      {action}
      <TabBar
        className={`${TabBarClasses.tabBar} moonbase-crash-tabs`}
        type="top"
        selectedItem={tab}
        onItemSelect={(v) => setTab(v)}
      >
        <TabBar.Item className={TabBarClasses.tabBarItem} id="crash">
          Crash Details
        </TabBar.Item>
        <TabBar.Item className={TabBarClasses.tabBarItem} id="extensions" disabled={updateCount === 0}>
          {`Extension Updates (${updateCount})`}
        </TabBar.Item>
      </TabBar>
      {tab === "crash" ? (
        <div className="moonbase-crash-details-wrapper">
          <pre className="moonbase-crash-details">
            <code>
              {state.error.stack}
              {"\n\nComponent stack:"}
              {state.info.componentStack}
            </code>
          </pre>
        </div>
      ) : null}
      {tab === "extensions" ? (
        <div className="moonbase-crash-extensions">
          {updates.map(([id, ext]) => (
            <ExtensionUpdateCard id={Number(id)} ext={ext} />
          ))}
        </div>
      ) : null}
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
      size={Button.Sizes.LARGE}
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
