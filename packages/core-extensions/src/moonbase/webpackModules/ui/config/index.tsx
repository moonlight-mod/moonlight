import { LogLevel } from "@moonlight-mod/types";

const logLevels = Object.values(LogLevel).filter((v) => typeof v === "string") as string[];

import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import {
  FormDivider,
  FormItem,
  FormText,
  FormSwitch,
  SingleSelect,
  Tooltip,
  Clickable
} from "@moonlight-mod/wp/discord/components/common/index";
import { Button } from "@moonlight-mod/wp/discord/uikit/legacy/Button";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import TextInput from "@moonlight-mod/wp/discord/uikit/TextInput";
import { CircleXIcon } from "@moonlight-mod/wp/discord/components/common/index";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";

import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";

let GuildSettingsRoleEditClasses: any;
spacepack
  .lazyLoad(
    "renderArtisanalHack",
    /\[(?:.\.e\("\d+?"\),?)+\][^}]+?webpackId:\d+,name:"GuildSettings"/,
    /webpackId:(\d+),name:"GuildSettings"/
  )
  .then(
    () =>
      (GuildSettingsRoleEditClasses = spacepack.require(
        "discord/modules/guild_settings/roles/web/GuildSettingsRoleEdit.css"
      ))
  );

function RemoveEntryButton({ onClick }: { onClick: () => void }) {
  return (
    <div className={GuildSettingsRoleEditClasses.removeButtonContainer}>
      <Tooltip text="Remove entry" position="top">
        {(props: any) => (
          <Clickable {...props} className={GuildSettingsRoleEditClasses.removeButton} onClick={onClick}>
            <CircleXIcon width={24} height={24} />
          </Clickable>
        )}
      </Tooltip>
    </div>
  );
}

function ArrayFormItem({ config }: { config: "repositories" | "devSearchPaths" }) {
  const items = MoonbaseSettingsStore.getConfigOption(config) ?? [];
  return (
    <Flex
      style={{
        gap: "20px"
      }}
      direction={Flex.Direction.VERTICAL}
    >
      {items.map((val, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            height: "32px",
            gap: "8px",
            gridTemplateColumns: "1fr 32px",
            alignItems: "center"
          }}
        >
          <TextInput
            value={val}
            onChange={(newVal: string) => {
              items[i] = newVal;
              MoonbaseSettingsStore.setConfigOption(config, items);
            }}
          />
          <RemoveEntryButton
            onClick={() => {
              items.splice(i, 1);
              MoonbaseSettingsStore.setConfigOption(config, items);
            }}
          />
        </div>
      ))}

      <Button
        look={Button.Looks.FILLED}
        color={Button.Colors.GREEN}
        size={Button.Sizes.SMALL}
        style={{
          marginTop: "10px"
        }}
        onClick={() => {
          items.push("");
          MoonbaseSettingsStore.setConfigOption(config, items);
        }}
      >
        Add new entry
      </Button>
    </Flex>
  );
}

export default function ConfigPage() {
  return (
    <>
      <div className={Margins.marginTop20}>
        <FormSwitch
          checked={MoonbaseSettingsStore.getExtensionConfigRaw<boolean>("moonbase", "updateChecking", true) ?? true}
          onChange={(value: boolean) => {
            MoonbaseSettingsStore.setExtensionConfig("moonbase", "updateChecking", value);
          }}
          label="Automatic update checking"
          description="Checks for updates to moonlight"
        />
      </div>
      <FormItem title="Repositories">
        <FormText className={Margins.marginBottom4}>A list of remote repositories to display extensions from</FormText>
        <ArrayFormItem config="repositories" />
      </FormItem>
      <FormDivider />
      <FormItem title="Extension search paths" className={Margins.marginTop20}>
        <FormText className={Margins.marginBottom4}>
          A list of local directories to search for built extensions
        </FormText>
        <ArrayFormItem config="devSearchPaths" />
      </FormItem>
      <FormDivider />
      <div className={Margins.marginTop20}>
        <FormSwitch
          checked={MoonbaseSettingsStore.getConfigOption("patchAll") ?? false}
          onChange={(value: boolean) => {
            MoonbaseSettingsStore.setConfigOption("patchAll", value);
          }}
          label="Patch all"
          description="Wraps every webpack module in a function, separating them in DevTools"
        />
      </div>
      <FormItem title="Log level">
        <SingleSelect
          autofocus={false}
          clearable={false}
          value={MoonbaseSettingsStore.getConfigOption("loggerLevel")}
          options={logLevels.map((o) => ({
            value: o.toLowerCase(),
            label: o[0] + o.slice(1).toLowerCase()
          }))}
          onChange={(v) => MoonbaseSettingsStore.setConfigOption("loggerLevel", v)}
        />
      </FormItem>
    </>
  );
}
