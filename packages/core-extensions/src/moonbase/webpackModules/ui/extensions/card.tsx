import { ExtensionCompat } from "@moonlight-mod/core/extension/loader";
import { constants, ExtensionLoadSource, ExtensionTag } from "@moonlight-mod/types";

import ErrorBoundary from "@moonlight-mod/wp/common_ErrorBoundary";
import {
  AngleBracketsIcon,
  Button,
  Card,
  ChannelListIcon,
  DownloadIcon,
  FormSwitch,
  HeartIcon,
  ScienceIcon,
  TabBar,
  Text,
  Tooltip,
  TrashIcon,
  WarningIcon,
  WindowTopOutlineIcon
} from "@moonlight-mod/wp/discord/components/common/index";
import PanelButton from "@moonlight-mod/wp/discord/components/common/PanelButton";
import BuildOverrideClasses from "@moonlight-mod/wp/discord/modules/build_overrides/web/BuildOverride.css";
import DiscoveryClasses from "@moonlight-mod/wp/discord/modules/discovery/web/Discovery.css";
import AppCardClasses from "@moonlight-mod/wp/discord/modules/guild_settings/web/AppCard.css";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";
import MarkupClasses from "@moonlight-mod/wp/discord/modules/messages/web/Markup.css";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";
import { ExtensionState } from "../../../types";
import ExtensionInfo from "./info";
import { doGenericExtensionPopup, doMissingExtensionPopup } from "./popup";
import Settings from "./settings";

export enum ExtensionPage {
  Info,
  Description,
  Changelog,
  Settings
}

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
      onClick={() => {
        window.open(link);
      }}
      tooltipText={tooltip}
    />
  );
}

export default function ExtensionCard({ uniqueId, selectTag }: { uniqueId: number; selectTag: (tag: string) => void }) {
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

  const tagline = ext.manifest?.meta?.tagline;
  const settings = ext.settingsOverride ?? ext.manifest?.settings;
  const description = ext.manifest?.meta?.description;
  const changelog = ext.changelog;
  const linkButtons = [
    ext?.manifest?.meta?.source && (
      <PanelLinkButton icon={<AngleBracketsIcon />} link={ext.manifest.meta.source} tooltip="View source" />
    ),
    ext?.source?.url && <PanelLinkButton icon={<ChannelListIcon />} link={ext.source.url} tooltip="View repository" />,
    ext?.manifest?.meta?.donate && (
      <PanelLinkButton icon={<HeartIcon />} link={ext.manifest.meta.donate} tooltip="Donate" />
    )
  ].filter(x => x != null);

  const enabledDependants = useStateFromStores([MoonbaseSettingsStore], () =>
    Object.keys(MoonbaseSettingsStore.extensions)
      .filter((uniqueId) => {
        const potentialDependant = MoonbaseSettingsStore.getExtension(Number.parseInt(uniqueId));

        return (
          potentialDependant.manifest.dependencies?.includes(ext?.id)
          && MoonbaseSettingsStore.getExtensionEnabled(Number.parseInt(uniqueId))
        );
      })
      .map(a => MoonbaseSettingsStore.getExtension(Number.parseInt(a))));
  const implicitlyEnabled = enabledDependants.length > 0;

  const hasDuplicateEntry = useStateFromStores([MoonbaseSettingsStore], () =>
    Object.entries(MoonbaseSettingsStore.extensions).some(
      ([otherUniqueId, otherExt]) =>
        otherExt != null && otherExt?.id === ext?.id && Number.parseInt(otherUniqueId) !== uniqueId
    ));

  return ext == null
    ? (<></>)
    : (
        <Card className={AppCardClasses.card} editable={true}>
          <div className={AppCardClasses.cardHeader}>
            <Flex direction={Flex.Direction.VERTICAL}>
              <Flex align={Flex.Align.CENTER} direction={Flex.Direction.HORIZONTAL}>
                <Text variant="text-md/semibold">{ext.manifest?.meta?.name ?? ext.id}</Text>
                {ext.source.type === ExtensionLoadSource.Developer && (
                  <Tooltip position="top" text="This is a local extension">
                    {(props: any) => <ScienceIcon {...props} class={BuildOverrideClasses.infoIcon} size="xs" />}
                  </Tooltip>
                )}

                {hasDuplicateEntry && ext?.source?.url && (
                  <Tooltip position="top" text={`This extension is from the following repository: ${ext.source.url}`}>
                    {(props: any) => <WindowTopOutlineIcon {...props} class={BuildOverrideClasses.infoIcon} size="xs" />}
                  </Tooltip>
                )}

                {ext.manifest?.meta?.deprecated && (
                  <Tooltip position="top" text="This extension is deprecated">
                    {(props: any) => <WarningIcon {...props} class={BuildOverrideClasses.infoIcon} size="xs" />}
                  </Tooltip>
                )}
              </Flex>

              {tagline != null && <Text variant="text-sm/normal">{MarkupUtils.parse(tagline)}</Text>}
            </Flex>

            <Flex align={Flex.Align.END} direction={Flex.Direction.HORIZONTAL} justify={Flex.Justify.END}>
              <div
                // too lazy to learn how <Flex /> works lmao
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}
              >
                {ext.state === ExtensionState.NotDownloaded
                  ? (
                      <Tooltip
                        shouldShow={conflicting || ext.compat !== ExtensionCompat.Compatible}
                        text={conflicting ? CONFLICTING_TEXT : COMPAT_TEXT_MAP[ext.compat]}
                      >
                        {(props: any) => (
                          <Button
                            {...props}
                            color={Button.Colors.BRAND}
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
                            submitting={busy}
                          >
                            Install
                          </Button>
                        )}
                      </Tooltip>
                    )
                  : (
                      <>
                        {ext.source.type === ExtensionLoadSource.Normal && (
                          <PanelButton
                            icon={TrashIcon}
                            onClick={() => {
                              MoonbaseSettingsStore.deleteExtension(uniqueId);
                            }}
                            tooltipText="Delete"
                          />
                        )}

                        {update != null && (
                          <PanelButton
                            icon={DownloadIcon}
                            onClick={() => {
                              MoonbaseSettingsStore.installExtension(uniqueId);
                            }}
                            tooltipText="Update"
                          />
                        )}

                        <FormSwitch
                          disabled={implicitlyEnabled || ext.compat !== ExtensionCompat.Compatible}
                          hideBorder={true}
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
                            }
                            else if (!enabled && ext.manifest?.meta?.tags?.includes(ExtensionTag.DangerZone)) {
                              doGenericExtensionPopup(
                                "Dangerous extension",
                                "This extension is marked as dangerous. Enabling it might have consequences. Are you sure you want to enable it?",
                                uniqueId,
                                toggle
                              );
                            }
                            else {
                              toggle();
                            }
                          }}
                          style={{ marginBottom: "0px" }}
                          // @ts-expect-error: fix type later
                          tooltipNote={
                            ext.compat !== ExtensionCompat.Compatible
                              ? (
                                  COMPAT_TEXT_MAP[ext.compat]
                                )
                              : implicitlyEnabled
                                ? (
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                      <div>
                                        {`This extension is a dependency of the following enabled extension${
                                          enabledDependants.length > 1 ? "s" : ""
                                        }:`}
                                      </div>
                                      {enabledDependants.map(dep => (
                                        <div>{`• ${dep.manifest.meta?.name ?? dep.id}`}</div>
                                      ))}
                                    </div>
                                  )
                                : undefined
                          }
                          value={ext.compat === ExtensionCompat.Compatible && (enabled || implicitlyEnabled)}
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
                  className={DiscoveryClasses.tabBar}
                  onItemSelect={setTab}
                  selectedItem={tab}
                  style={{
                    padding: "0 20px"
                  }}
                  type="top"
                >
                  <TabBar.Item className={DiscoveryClasses.tabBarItem} id={ExtensionPage.Info}>
                    Info
                  </TabBar.Item>

                  {description != null && (
                    <TabBar.Item className={DiscoveryClasses.tabBarItem} id={ExtensionPage.Description}>
                      Description
                    </TabBar.Item>
                  )}

                  {changelog != null && (
                    <TabBar.Item className={DiscoveryClasses.tabBarItem} id={ExtensionPage.Changelog}>
                      Changelog
                    </TabBar.Item>
                  )}

                  {settings != null && (
                    <TabBar.Item className={DiscoveryClasses.tabBarItem} id={ExtensionPage.Settings}>
                      Settings
                    </TabBar.Item>
                  )}
                </TabBar>

                <Flex
                  align={Flex.Align.CENTER}
                  className="moonbase-link-buttons"
                  direction={Flex.Direction.HORIZONTAL}
                  grow={1}
                  justify={Flex.Justify.END}
                >
                  {linkButtons.length > 0 && linkButtons}
                </Flex>
              </Flex>
            )}

            <Flex
              justify={Flex.Justify.START}
              style={{
                padding: "16px 16px",
                // This looks wonky in the settings tab
                rowGap: tab === ExtensionPage.Info ? "16px" : undefined
              }}
              wrap={Flex.Wrap.WRAP}
            >
              {tab === ExtensionPage.Info && <ExtensionInfo ext={ext} selectTag={selectTag} />}
              {tab === ExtensionPage.Description && (
                <Text className={MarkupClasses.markup} style={{ width: "100%" }} variant="text-md/normal">
                  {MarkupUtils.parse(description ?? "*No description*", true, {
                    allowHeading: true,
                    allowLinks: true,
                    allowList: true
                  })}
                </Text>
              )}
              {tab === ExtensionPage.Changelog && (
                <Text className={MarkupClasses.markup} style={{ width: "100%" }} variant="text-md/normal">
                  {MarkupUtils.parse(changelog ?? "*No changelog*", true, {
                    allowHeading: true,
                    allowLinks: true,
                    allowList: true
                  })}
                </Text>
              )}
              {tab === ExtensionPage.Settings && (
                <ErrorBoundary>
                  <Settings ext={ext} />
                </ErrorBoundary>
              )}
            </Flex>
          </div>
        </Card>
      );
}
