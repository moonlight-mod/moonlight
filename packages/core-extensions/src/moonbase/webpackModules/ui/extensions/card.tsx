import { ExtensionState } from "../../../types";
import { ExtensionLoadSource } from "@moonlight-mod/types";

import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import React from "@moonlight-mod/wp/react";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";

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

const CardClasses: Record<string, string> = {};
spacepack
  .lazyLoad(
    "renderArtisanalHack",
    /\[(?:.\.e\("\d+?"\),?)+\][^}]+?webpackId:\d+,name:"ChannelSettings"/,
    /webpackId:(\d+),name:"ChannelSettings"/
  )
  .then(() =>
    Object.assign(
      CardClasses,
      spacepack.findByExports("card", "cardHeader", "inModal")[0].exports
    )
  );

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

  const { Card, Text, Switch, TabBar, Button } = Components;

  const tagline = ext.manifest?.meta?.tagline;
  const settings = ext.manifest?.settings;
  const description = ext.manifest?.meta?.description;

  return (
    <Card editable={true} className={CardClasses.card}>
      <div className={CardClasses.cardHeader}>
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

              <Switch
                checked={enabled}
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
            <Text variant="text-md/normal">
              {MarkupUtils.parse(description ?? "*No description*")}
            </Text>
          )}
          {tab === ExtensionPage.Settings && <Settings ext={ext} />}
        </Flex>
      </div>
    </Card>
  );
}
