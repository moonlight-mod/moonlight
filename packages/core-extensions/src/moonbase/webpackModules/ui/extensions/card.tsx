import { ExtensionState } from "../../../types";
import { ExtensionLoadSource } from "@moonlight-mod/types";

import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import React from "@moonlight-mod/wp/react";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";
import IntegrationCard from "@moonlight-mod/wp/discord/modules/guild_settings/IntegrationCard.css";

import ExtensionInfo from "./info";
import Settings from "./settings";

export enum ExtensionPage {
  Info,
  Description,
  Settings
}

import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";

const { DownloadIcon, TrashIcon, CircleWarningIcon } = Components;

const PanelButton = spacepack.findByCode("Masks.PANEL_BUTTON")[0].exports.Z;
const TabBarClasses = spacepack.findByExports(
  "tabBar",
  "tabBarItem",
  "headerContentWrapper"
)[0].exports;
const MarkupClasses = spacepack.findByExports("markup", "inlineFormat")[0]
  .exports;

export default function ExtensionCard({ uniqueId }: { uniqueId: number }) {
  const [tab, setTab] = React.useState(ExtensionPage.Info);
  const [restartNeeded, setRestartNeeded] = React.useState(false);

  const { ext, enabled, busy, update, conflicting } = useStateFromStores(
    [MoonbaseSettingsStore],
    () => {
      return {
        ext: MoonbaseSettingsStore.getExtension(uniqueId),
        enabled: MoonbaseSettingsStore.getExtensionEnabled(uniqueId),
        busy: MoonbaseSettingsStore.busy,
        update: MoonbaseSettingsStore.getExtensionUpdate(uniqueId),
        conflicting: MoonbaseSettingsStore.getExtensionConflicting(uniqueId)
      };
    }
  );

  // Why it work like that :sob:
  if (ext == null) return <></>;

  const { Card, Text, FormSwitch, TabBar, Button } = Components;

  const tagline = ext.manifest?.meta?.tagline;
  const settings = ext.manifest?.settings;
  const description = ext.manifest?.meta?.description;
  const enabledDependants = useStateFromStores([MoonbaseSettingsStore], () =>
    Object.keys(MoonbaseSettingsStore.extensions)
      .filter((uniqueId) => {
        const potentialDependant = MoonbaseSettingsStore.getExtension(
          parseInt(uniqueId)
        );

        return (
          potentialDependant.manifest.dependencies?.includes(ext.id) &&
          MoonbaseSettingsStore.getExtensionEnabled(parseInt(uniqueId))
        );
      })
      .map((a) => MoonbaseSettingsStore.getExtension(parseInt(a)))
  );
  const implicitlyEnabled = enabledDependants.length > 0;

  return (
    <Card editable={true} className={IntegrationCard.card}>
      <div className={IntegrationCard.cardHeader}>
        <Flex direction={Flex.Direction.VERTICAL}>
          <Flex direction={Flex.Direction.HORIZONTAL}>
            <Text variant="text-md/semibold">
              {ext.manifest?.meta?.name ?? ext.id}
            </Text>
          </Flex>

          {tagline != null && (
            <Text variant="text-sm/normal">{MarkupUtils.parse(tagline)}</Text>
          )}
        </Flex>

        <Flex
          direction={Flex.Direction.HORIZONTAL}
          align={Flex.Align.END}
          justify={Flex.Justify.END}
        >
          {ext.state === ExtensionState.NotDownloaded ? (
            <Button
              color={Button.Colors.BRAND}
              submitting={busy}
              disabled={conflicting}
              onClick={() => {
                MoonbaseSettingsStore.installExtension(uniqueId);
              }}
            >
              Install
            </Button>
          ) : (
            <div
              // too lazy to learn how <Flex /> works lmao
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}
            >
              {ext.source.type === ExtensionLoadSource.Normal && (
                <PanelButton
                  icon={TrashIcon}
                  tooltipText="Delete"
                  onClick={() => {
                    MoonbaseSettingsStore.deleteExtension(uniqueId);
                  }}
                />
              )}

              {update != null && (
                <PanelButton
                  icon={DownloadIcon}
                  tooltipText="Update"
                  onClick={() => {
                    MoonbaseSettingsStore.installExtension(uniqueId);
                  }}
                />
              )}

              {restartNeeded && (
                <PanelButton
                  icon={() => (
                    <CircleWarningIcon
                      color={Components.tokens.colors.STATUS_DANGER}
                    />
                  )}
                  onClick={() => window.location.reload()}
                  tooltipText="You will need to reload/restart your client for this extension to work properly."
                />
              )}

              <FormSwitch
                value={enabled || implicitlyEnabled}
                disabled={implicitlyEnabled}
                hideBorder={true}
                style={{ marginBottom: "0px" }}
                tooltipNote={
                  implicitlyEnabled
                    ? `This extension is a dependency of the following enabled extension${
                        enabledDependants.length > 1 ? "s" : ""
                      }: ${enabledDependants
                        .map((a) => a.manifest.meta!.name)
                        .join(", ")}`
                    : undefined
                }
                onChange={() => {
                  setRestartNeeded(true);
                  MoonbaseSettingsStore.setExtensionEnabled(uniqueId, !enabled);
                }}
              />
            </div>
          )}
        </Flex>
      </div>

      <div>
        {(description != null || settings != null) && (
          <TabBar
            selectedItem={tab}
            type="top"
            onItemSelect={setTab}
            className={TabBarClasses.tabBar}
            style={{
              padding: "0 20px"
            }}
          >
            <TabBar.Item
              className={TabBarClasses.tabBarItem}
              id={ExtensionPage.Info}
            >
              Info
            </TabBar.Item>

            {description != null && (
              <TabBar.Item
                className={TabBarClasses.tabBarItem}
                id={ExtensionPage.Description}
              >
                Description
              </TabBar.Item>
            )}

            {settings != null && (
              <TabBar.Item
                className={TabBarClasses.tabBarItem}
                id={ExtensionPage.Settings}
              >
                Settings
              </TabBar.Item>
            )}
          </TabBar>
        )}

        <Flex
          justify={Flex.Justify.START}
          wrap={Flex.Wrap.WRAP}
          style={{
            padding: "16px 16px"
          }}
        >
          {tab === ExtensionPage.Info && <ExtensionInfo ext={ext} />}
          {tab === ExtensionPage.Description && (
            <Text
              variant="text-md/normal"
              class={MarkupClasses.markup}
              style={{ width: "100%" }}
            >
              {MarkupUtils.parse(description ?? "*No description*", true, {
                allowHeading: true,
                allowLinks: true,
                allowList: true
              })}
            </Text>
          )}
          {tab === ExtensionPage.Settings && <Settings ext={ext} />}
        </Flex>
      </div>
    </Card>
  );
}
