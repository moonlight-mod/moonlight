import { ExtensionState } from "../../../types";
import { constants, ExtensionLoadSource, ExtensionTag } from "@moonlight-mod/types";
import { ExtensionCompat } from "@moonlight-mod/core/extension/loader";

import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import React from "@moonlight-mod/wp/react";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";
import IntegrationCard from "@moonlight-mod/wp/discord/modules/guild_settings/IntegrationCard.css";

import ExtensionInfo from "./info";
import Settings from "./settings";
import { doGenericExtensionPopup, doMissingExtensionPopup } from "./popup";

export enum ExtensionPage {
  Info,
  Description,
  Changelog,
  Settings
}

import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";

const {
  BeakerIcon,
  DownloadIcon,
  TrashIcon,
  AngleBracketsIcon,
  ChannelListIcon,
  HeartIcon,
  WindowTopOutlineIcon,
  Tooltip
} = Components;

const PanelButton = spacepack.findByCode("Masks.PANEL_BUTTON")[0].exports.Z;
const TabBarClasses = spacepack.findByCode("tabBar:", "tabBarItem:", "headerContentWrapper:")[0].exports;
const MarkupClasses = spacepack.findByCode("markup:", "inlineFormat:")[0].exports;

const BuildOverrideClasses = spacepack.findByCode("disabledButtonOverride:")[0].exports;

const COMPAT_TEXT_MAP: Record<ExtensionCompat, string> = {
  [ExtensionCompat.Compatible]: "huh?",
  [ExtensionCompat.InvalidApiLevel]: "Incompatible API level",
  [ExtensionCompat.InvalidEnvironment]: "Incompatible platform"
};
const CONFLICTING_TEXT = "This extension is already installed from another source.";

function PanelLinkButton({ icon, tooltip, link }: { icon: React.ReactNode; tooltip: string; link: string }) {
  return (
    <PanelButton
      icon={icon}
      tooltipText={tooltip}
      onClick={() => {
        window.open(link);
      }}
    />
  );
}

export default function ExtensionCard({ uniqueId }: { uniqueId: number }) {
  const { ext, enabled, busy, update, conflicting } = useStateFromStores([MoonbaseSettingsStore], () => {
    return {
      ext: MoonbaseSettingsStore.getExtension(uniqueId),
      enabled: MoonbaseSettingsStore.getExtensionEnabled(uniqueId),
      busy: MoonbaseSettingsStore.busy,
      update: MoonbaseSettingsStore.getExtensionUpdate(uniqueId),
      conflicting: MoonbaseSettingsStore.getExtensionConflicting(uniqueId)
    };
  });

  const [tab, setTab] = React.useState(
    update != null && ext?.changelog != null ? ExtensionPage.Changelog : ExtensionPage.Info
  );

  const { Card, Text, FormSwitch, TabBar, Button } = Components;

  const tagline = ext?.manifest?.meta?.tagline;
  const settings = ext?.settingsOverride ?? ext.manifest?.settings;
  const description = ext?.manifest?.meta?.description;
  const changelog = ext?.changelog;
  const linkButtons = [
    ext?.manifest?.meta?.source && (
      <PanelLinkButton icon={AngleBracketsIcon} tooltip="View source" link={ext.manifest.meta.source} />
    ),
    ext?.source?.url && <PanelLinkButton icon={ChannelListIcon} tooltip="View repository" link={ext.source.url} />,
    ext?.manifest?.meta?.donate && <PanelLinkButton icon={HeartIcon} tooltip="Donate" link={ext.manifest.meta.donate} />
  ].filter((x) => x != null);

  const enabledDependants = useStateFromStores([MoonbaseSettingsStore], () =>
    Object.keys(MoonbaseSettingsStore.extensions)
      .filter((uniqueId) => {
        const potentialDependant = MoonbaseSettingsStore.getExtension(parseInt(uniqueId));

        return (
          potentialDependant.manifest.dependencies?.includes(ext?.id) &&
          MoonbaseSettingsStore.getExtensionEnabled(parseInt(uniqueId))
        );
      })
      .map((a) => MoonbaseSettingsStore.getExtension(parseInt(a)))
  );
  const implicitlyEnabled = enabledDependants.length > 0;

  const hasDuplicateEntry = useStateFromStores([MoonbaseSettingsStore], () =>
    Object.entries(MoonbaseSettingsStore.extensions).some(
      ([otherUniqueId, otherExt]) =>
        otherExt != null && otherExt?.id === ext?.id && parseInt(otherUniqueId) !== uniqueId
    )
  );

  return ext == null ? (
    <></>
  ) : (
    <Card editable={true} className={IntegrationCard.card}>
      <div className={IntegrationCard.cardHeader}>
        <Flex direction={Flex.Direction.VERTICAL}>
          <Flex direction={Flex.Direction.HORIZONTAL} align={Flex.Align.CENTER}>
            <Text variant="text-md/semibold">{ext.manifest?.meta?.name ?? ext.id}</Text>
            {ext.source.type === ExtensionLoadSource.Developer && (
              <Tooltip text="This is a local extension" position="top">
                {(props: any) => <BeakerIcon {...props} class={BuildOverrideClasses.infoIcon} size="xs" />}
              </Tooltip>
            )}
          </Flex>

          {tagline != null && <Text variant="text-sm/normal">{MarkupUtils.parse(tagline)}</Text>}
        </Flex>

        <Flex direction={Flex.Direction.HORIZONTAL} align={Flex.Align.END} justify={Flex.Justify.END}>
          <div
            // too lazy to learn how <Flex /> works lmao
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem"
            }}
          >
            {hasDuplicateEntry && ext?.source?.url && (
              <PanelButton
                icon={WindowTopOutlineIcon}
                tooltipText={`This extension is from the following repository: ${ext.source.url}`}
              />
            )}

            {ext.state === ExtensionState.NotDownloaded ? (
              <Tooltip
                text={conflicting ? CONFLICTING_TEXT : COMPAT_TEXT_MAP[ext.compat]}
                shouldShow={conflicting || ext.compat !== ExtensionCompat.Compatible}
              >
                {(props: any) => (
                  <Button
                    {...props}
                    color={Button.Colors.BRAND}
                    submitting={busy}
                    disabled={ext.compat !== ExtensionCompat.Compatible || conflicting}
                    onClick={async () => {
                      await MoonbaseSettingsStore.installExtension(uniqueId);
                      const deps = await MoonbaseSettingsStore.getDependencies(uniqueId);
                      if (deps != null) {
                        await doMissingExtensionPopup(deps);
                      }

                      // Don't auto enable dangerous extensions
                      if (!ext.manifest?.meta?.tags?.includes(ExtensionTag.DangerZone)) {
                        MoonbaseSettingsStore.setExtensionEnabled(uniqueId, true);
                      }
                    }}
                  >
                    Install
                  </Button>
                )}
              </Tooltip>
            ) : (
              <>
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

                <FormSwitch
                  value={ext.compat === ExtensionCompat.Compatible && (enabled || implicitlyEnabled)}
                  disabled={implicitlyEnabled || ext.compat !== ExtensionCompat.Compatible}
                  hideBorder={true}
                  style={{ marginBottom: "0px" }}
                  // @ts-expect-error fix type later
                  tooltipNote={
                    ext.compat !== ExtensionCompat.Compatible ? (
                      COMPAT_TEXT_MAP[ext.compat]
                    ) : implicitlyEnabled ? (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>{`This extension is a dependency of the following enabled extension${
                          enabledDependants.length > 1 ? "s" : ""
                        }:`}</div>
                        {enabledDependants.map((dep) => (
                          <div>{"• " + (dep.manifest.meta?.name ?? dep.id)}</div>
                        ))}
                      </div>
                    ) : undefined
                  }
                  onChange={() => {
                    const toggle = () => {
                      MoonbaseSettingsStore.setExtensionEnabled(uniqueId, !enabled);
                    };

                    if (enabled && constants.builtinExtensions.includes(ext.id)) {
                      doGenericExtensionPopup(
                        "Built in extension",
                        "This extension is enabled by default. Disabling it might have consequences. Are you sure you want to disable it?",
                        uniqueId,
                        toggle
                      );
                    } else if (!enabled && ext.manifest?.meta?.tags?.includes(ExtensionTag.DangerZone)) {
                      doGenericExtensionPopup(
                        "Dangerous extension",
                        "This extension is marked as dangerous. Enabling it might have consequences. Are you sure you want to enable it?",
                        uniqueId,
                        toggle
                      );
                    } else {
                      toggle();
                    }
                  }}
                />
              </>
            )}
          </div>
        </Flex>
      </div>

      <div>
        {(description != null || changelog != null || settings != null || linkButtons.length > 0) && (
          <Flex>
            <TabBar
              selectedItem={tab}
              type="top"
              onItemSelect={setTab}
              className={TabBarClasses.tabBar}
              style={{
                padding: "0 20px"
              }}
            >
              <Flex direction={Flex.Direction.HORIZONTAL}>
                <TabBar.Item className={TabBarClasses.tabBarItem} id={ExtensionPage.Info}>
                  Info
                </TabBar.Item>

                {description != null && (
                  <TabBar.Item className={TabBarClasses.tabBarItem} id={ExtensionPage.Description}>
                    Description
                  </TabBar.Item>
                )}

                {changelog != null && (
                  <TabBar.Item className={TabBarClasses.tabBarItem} id={ExtensionPage.Changelog}>
                    Changelog
                  </TabBar.Item>
                )}
                {settings != null && (
                  <TabBar.Item className={TabBarClasses.tabBarItem} id={ExtensionPage.Settings}>
                    Settings
                  </TabBar.Item>
                )}
              </Flex>
            </TabBar>

            {linkButtons.length > 0 && (
              <Flex
                align={Flex.Align.CENTER}
                justify={Flex.Justify.END}
                direction={Flex.Direction.HORIZONTAL}
                grow={1}
                className="moonbase-link-buttons"
              >
                {linkButtons}
              </Flex>
            )}
          </Flex>
        )}

        <Flex
          justify={Flex.Justify.START}
          wrap={Flex.Wrap.WRAP}
          style={{
            padding: "16px 16px",
            // This looks wonky in the settings tab
            rowGap: tab === ExtensionPage.Info ? "16px" : undefined
          }}
        >
          {tab === ExtensionPage.Info && <ExtensionInfo ext={ext} />}
          {tab === ExtensionPage.Description && (
            <Text variant="text-md/normal" className={MarkupClasses.markup} style={{ width: "100%" }}>
              {MarkupUtils.parse(description ?? "*No description*", true, {
                allowHeading: true,
                allowLinks: true,
                allowList: true
              })}
            </Text>
          )}
          {tab === ExtensionPage.Changelog && (
            <Text variant="text-md/normal" className={MarkupClasses.markup} style={{ width: "100%" }}>
              {MarkupUtils.parse(changelog ?? "*No changelog*", true, {
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
