import WebpackRequire from "@moonlight-mod/types/discord/require";
import { DownloadIconSVG, ExtensionState, TrashIconSVG } from "../types";
import { ExtensionLoadSource } from "types/src";
import info from "./info";
import settings from "./settings";

export enum ExtensionPage {
  Info,
  Description,
  Settings
}

export default (require: typeof WebpackRequire) => {
  const React = require("common_react");
  const spacepack = require("spacepack_spacepack").spacepack;
  const CommonComponents = require("common_components");
  const Flux = require("common_flux");

  const { ExtensionInfo } = info(require);
  const { Settings } = settings(require);
  const { MoonbaseSettingsStore } =
    require("moonbase_stores") as typeof import("../webpackModules/stores");

  const UserProfileClasses = spacepack.findByCode(
    "tabBarContainer",
    "topSection"
  )[0].exports;

  const DownloadIcon = spacepack.findByCode(DownloadIconSVG)[0].exports.default;
  const TrashIcon = spacepack.findByCode(TrashIconSVG)[0].exports.default;

  function ExtensionCard({ id }: { id: string }) {
    const [tab, setTab] = React.useState(ExtensionPage.Info);
    const { ext, enabled, busy, update } = Flux.useStateFromStores(
      [MoonbaseSettingsStore],
      () => {
        return {
          ext: MoonbaseSettingsStore.getExtension(id),
          enabled: MoonbaseSettingsStore.getExtensionEnabled(id),
          busy: MoonbaseSettingsStore.busy,
          update: MoonbaseSettingsStore.getExtensionUpdate(id)
        };
      }
    );

    // Why it work like that :sob:
    if (ext == null) return <></>;

    const {
      Card,
      CardClasses,
      Flex,
      Text,
      MarkdownParser,
      Switch,
      TabBar,
      Button
    } = CommonComponents;

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
              <Text variant="text-sm/normal">
                {MarkdownParser.parse(tagline)}
              </Text>
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
                onClick={() => {
                  MoonbaseSettingsStore.installExtension(id);
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
                  // TODO: this needs centering
                  <Button
                    color={Button.Colors.RED}
                    size={Button.Sizes.ICON}
                    submitting={busy}
                    onClick={() => {
                      MoonbaseSettingsStore.deleteExtension(id);
                    }}
                  >
                    <TrashIcon width={27} />
                  </Button>
                )}

                {update !== null && (
                  <Button
                    color={Button.Colors.BRAND}
                    size={Button.Sizes.ICON}
                    submitting={busy}
                    onClick={() => {
                      MoonbaseSettingsStore.installExtension(id);
                    }}
                  >
                    <DownloadIcon width={27} />
                  </Button>
                )}

                <Switch
                  checked={enabled}
                  onChange={() => {
                    MoonbaseSettingsStore.setExtensionEnabled(id, !enabled);
                  }}
                />
              </div>
            )}
          </Flex>
        </div>

        <div className={UserProfileClasses.body}>
          {(description != null || settings != null) && (
            <div
              className={UserProfileClasses.tabBarContainer}
              style={{
                padding: "0 10px"
              }}
            >
              <TabBar
                selectedItem={tab}
                type="top"
                onItemSelect={setTab}
                className={UserProfileClasses.tabBar}
              >
                <TabBar.Item
                  className={UserProfileClasses.tabBarItem}
                  id={ExtensionPage.Info}
                >
                  Info
                </TabBar.Item>

                {description != null && (
                  <TabBar.Item
                    className={UserProfileClasses.tabBarItem}
                    id={ExtensionPage.Description}
                  >
                    Description
                  </TabBar.Item>
                )}

                {settings != null && (
                  <TabBar.Item
                    className={UserProfileClasses.tabBarItem}
                    id={ExtensionPage.Settings}
                  >
                    Settings
                  </TabBar.Item>
                )}
              </TabBar>
            </div>
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
                {MarkdownParser.parse(description ?? "*No description*")}
              </Text>
            )}
            {tab === ExtensionPage.Settings && <Settings ext={ext} />}
          </Flex>
        </div>
      </Card>
    );
  }

  return function Moonbase() {
    const { extensions } = Flux.useStateFromStoresObject(
      [MoonbaseSettingsStore],
      () => {
        return { extensions: MoonbaseSettingsStore.extensions };
      }
    );

    const sorted = Object.values(extensions).sort((a, b) => {
      const aName = a.manifest.meta?.name ?? a.id;
      const bName = b.manifest.meta?.name ?? b.id;
      return aName.localeCompare(bName);
    });

    return (
      <>
        {sorted.map((ext) => (
          <ExtensionCard id={ext.id} key={ext.id} />
        ))}
      </>
    );
  };
};
