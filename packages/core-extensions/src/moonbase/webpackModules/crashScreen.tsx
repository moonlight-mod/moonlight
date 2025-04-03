import type { ConfigExtension, DetectedExtension } from "@moonlight-mod/types";
import type { RepositoryManifest } from "../types";
import { Button, TabBar } from "@moonlight-mod/wp/discord/components/common/index";
import DiscoveryClasses from "@moonlight-mod/wp/discord/modules/discovery/web/Discovery.css";
import { useStateFromStores, useStateFromStoresObject } from "@moonlight-mod/wp/discord/packages/flux";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";
import { UpdateState } from "../types";

const MODULE_REGEX = /Webpack-Module\/(\d+)\/(\d+)/g;

const logger = moonlight.getLogger("moonbase/crashScreen");

interface ErrorState {
  error: Error;
  info: {
    componentStack: string;
  };
  __moonlight_update?: UpdateState;
}

interface WrapperProps {
  action: React.ReactNode;
  state: ErrorState;
}

interface UpdateCardProps {
  id: number;
  ext: {
    version: string;
    download: string;
    updateManifest: RepositoryManifest;
  };
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
        <div className="moonbase-crash-extensionCard-version">
          {`v${installed?.manifest?.version ?? "???"} -> v${
            ext.version
          }`}
        </div>
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

function ExtensionDisableCard({ ext }: { ext: DetectedExtension }) {
  function disableWithDependents() {
    const disable: Set<string> = new Set();
    disable.add(ext.id);
    for (const [id, dependencies] of moonlightNode.processedExtensions.dependencyGraph) {
      if (dependencies?.has(ext.id)) disable.add(id);
    }

    const config = structuredClone(moonlightNode.config);
    for (const id in config.extensions) {
      if (!disable.has(id)) continue;
      if (typeof config.extensions[id] === "boolean") config.extensions[id] = false;
      else (config.extensions[id] as ConfigExtension).enabled = false;
    }

    let msg = `Are you sure you want to disable "${ext.manifest.meta?.name ?? ext.id}"`;
    if (disable.size > 1) {
      msg += ` and its ${disable.size - 1} dependent${disable.size - 1 === 1 ? "" : "s"}`;
    }
    msg += "?";

    // eslint-disable-next-line no-alert -- TODO: use ui for this
    if (confirm(msg)) {
      moonlightNode.writeConfig(config);
      window.location.reload();
    }
  }

  return (
    <div className="moonbase-crash-extensionCard">
      <div className="moonbase-crash-extensionCard-meta">
        <div className="moonbase-crash-extensionCard-title">{ext.manifest.meta?.name ?? ext.id}</div>
        <div className="moonbase-crash-extensionCard-version">{`v${ext.manifest.version ?? "???"}`}</div>
      </div>
      <div className="moonbase-crash-extensionCard-button">
        <Button color={Button.Colors.RED} onClick={disableWithDependents}>
          Disable
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

  const causes = React.useMemo(() => {
    const causes: Set<string> = new Set();
    if (state.error.stack) {
      for (const [, , id] of state.error.stack.matchAll(MODULE_REGEX))
        for (const ext of moonlight.patched.get(id) ?? []) causes.add(ext);
    }
    for (const [, , id] of state.info.componentStack.matchAll(MODULE_REGEX))
      for (const ext of moonlight.patched.get(id) ?? []) causes.add(ext);

    for (const [path, id] of Object.entries(moonlight.moonmap.modules)) {
      const MAPPING_REGEX = new RegExp(
        // @ts-expect-error: Only Firefox has RegExp.escape
        `(${RegExp.escape ? RegExp.escape(path) : path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "g"
      );

      if (state.error.stack) {
        for (const match of state.error.stack.matchAll(MAPPING_REGEX))
          if (match) for (const ext of moonlight.patched.get(id) ?? []) causes.add(ext);
      }
      for (const match of state.info.componentStack.matchAll(MAPPING_REGEX))
        if (match) for (const ext of moonlight.patched.get(id) ?? []) causes.add(ext);
    }

    return [...causes];
  }, []);

  return (
    <div className="moonbase-crash-wrapper">
      {action}
      <TabBar
        className={`${DiscoveryClasses.tabBar} moonbase-crash-tabs`}
        onItemSelect={v => setTab(v)}
        selectedItem={tab}
        type="top"
      >
        <TabBar.Item className={DiscoveryClasses.tabBarItem} id="crash">
          Crash details
        </TabBar.Item>
        <TabBar.Item className={DiscoveryClasses.tabBarItem} disabled={updateCount === 0} id="extensions">
          {`Extension updates (${updateCount})`}
        </TabBar.Item>
        <TabBar.Item className={DiscoveryClasses.tabBarItem} disabled={causes.length === 0} id="causes">
          {`Possible causes (${causes.length})`}
        </TabBar.Item>
      </TabBar>
      {tab === "crash"
        ? (
            <div className="moonbase-crash-details-wrapper">
              <pre className="moonbase-crash-details">
                <code>
                  {state.error.stack}
                  {"\n\nComponent stack:"}
                  {state.info.componentStack}
                </code>
              </pre>
            </div>
          )
        : null}
      {tab === "extensions"
        ? (
            <div className="moonbase-crash-extensions">
              {updates.map(([id, ext]) => (
                <ExtensionUpdateCard ext={ext} id={Number(id)} />
              ))}
            </div>
          )
        : null}
      {tab === "causes"
        ? (
            <div className="moonbase-crash-extensions">
              {causes
                .map(ext => moonlightNode.extensions.find(e => e.id === ext)!)
                .map(ext => (
                  <ExtensionDisableCard ext={ext} />
                ))}
            </div>
          )
        : null}
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

  return newVersion == null
    ? null
    : (
        <p>{state.__moonlight_update !== undefined ? updateStrings[state.__moonlight_update] : ""}</p>
      );
}

export function UpdateButton({ state, setState }: { state: ErrorState; setState: (state: ErrorState) => void }) {
  const newVersion = useStateFromStores([MoonbaseSettingsStore], () => MoonbaseSettingsStore.newVersion);
  return newVersion == null
    || state.__moonlight_update === UpdateState.Installed
    || state.__moonlight_update === undefined
    ? null
    : (
        <Button
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
          size={Button.Sizes.LARGE}
        >
          {state.__moonlight_update !== undefined ? buttonStrings[state.__moonlight_update] : ""}
        </Button>
      );
}
