import { LogLevel } from "@moonlight-mod/types";

import FormSwitchClasses from "@moonlight-mod/wp/discord/components/common/FormSwitch.css";
import {
  Button,
  CircleXIcon,
  Clickable,
  FormDivider,
  FormItem,
  FormSwitch,
  FormText,
  SingleSelect,
  TextInput,
  Tooltip
} from "@moonlight-mod/wp/discord/components/common/index";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";

import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const logLevels = Object.values(LogLevel).filter(v => typeof v === "string") as string[];

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
      <Tooltip position="top" text="Remove entry">
        {(props: any) => (
          <Clickable {...props} className={GuildSettingsRoleEditClasses.removeButton} onClick={onClick}>
            <CircleXIcon height={24} width={24} />
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
      direction={Flex.Direction.VERTICAL}
      style={{
        gap: "20px"
      }}
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
            onChange={(newVal: string) => {
              items[i] = newVal;
              MoonbaseSettingsStore.setConfigOption(config, items);
            }}
            size={TextInput.Sizes.DEFAULT}
            value={val}
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
        color={Button.Colors.GREEN}
        look={Button.Looks.FILLED}
        onClick={() => {
          items.push("");
          MoonbaseSettingsStore.setConfigOption(config, items);
        }}
        size={Button.Sizes.SMALL}
        style={{
          marginTop: "10px"
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
      <FormSwitch
        className={Margins.marginTop20}
        note="Checks for updates to moonlight"
        onChange={(value: boolean) => {
          MoonbaseSettingsStore.setExtensionConfig("moonbase", "updateChecking", value);
        }}
        value={MoonbaseSettingsStore.getExtensionConfigRaw<boolean>("moonbase", "updateChecking", true) ?? true}
      >
        Automatic update checking
      </FormSwitch>
      <FormItem title="Repositories">
        <FormText className={Margins.marginBottom4}>A list of remote repositories to display extensions from</FormText>
        <ArrayFormItem config="repositories" />
      </FormItem>
      <FormDivider className={FormSwitchClasses.dividerDefault} />
      <FormItem className={Margins.marginTop20} title="Extension search paths">
        <FormText className={Margins.marginBottom4}>
          A list of local directories to search for built extensions
        </FormText>
        <ArrayFormItem config="devSearchPaths" />
      </FormItem>
      <FormDivider className={FormSwitchClasses.dividerDefault} />
      <FormSwitch
        className={Margins.marginTop20}
        note="Wraps every webpack module in a function, separating them in DevTools"
        onChange={(value: boolean) => {
          MoonbaseSettingsStore.setConfigOption("patchAll", value);
        }}
        value={MoonbaseSettingsStore.getConfigOption("patchAll") ?? false}
      >
        Patch all
      </FormSwitch>
      <FormItem title="Log level">
        <SingleSelect
          autofocus={false}
          clearable={false}
          onChange={v => MoonbaseSettingsStore.setConfigOption("loggerLevel", v)}
          options={logLevels.map(o => ({
            value: o.toLowerCase(),
            label: o[0] + o.slice(1).toLowerCase()
          }))}
          value={MoonbaseSettingsStore.getConfigOption("loggerLevel")}
        />
      </FormItem>
    </>
  );
}
