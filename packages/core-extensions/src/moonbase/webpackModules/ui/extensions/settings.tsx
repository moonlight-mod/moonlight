import {
  ExtensionSettingType,
  ExtensionSettingsManifest,
  MultiSelectSettingType,
  NumberSettingType,
  SelectOption,
  SelectSettingType
} from "@moonlight-mod/types/config";

import { ExtensionState, MoonbaseExtension } from "../../../types";

import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import React from "@moonlight-mod/wp/react";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";
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

type SettingsProps = {
  ext: MoonbaseExtension;
  name: string;
  setting: ExtensionSettingsManifest;
  disabled: boolean;
};
type SettingsComponent = React.ComponentType<SettingsProps>;

const Margins = spacepack.require("discord/styles/shared/Margins.css");

function markdownify(str: string) {
  return MarkupUtils.parse(str, true, {
    hideSimpleEmbedContent: true,
    allowLinks: true
  });
}

function useConfigEntry<T>(uniqueId: number, name: string) {
  return useStateFromStores(
    [MoonbaseSettingsStore],
    () => {
      return {
        value: MoonbaseSettingsStore.getExtensionConfig<T>(uniqueId, name),
        displayName: MoonbaseSettingsStore.getExtensionConfigName(uniqueId, name),
        description: MoonbaseSettingsStore.getExtensionConfigDescription(uniqueId, name)
      };
    },
    [uniqueId, name]
  );
}

function Boolean({ ext, name, setting, disabled }: SettingsProps) {
  const { FormSwitch } = Components;
  const { value, displayName, description } = useConfigEntry<boolean>(ext.uniqueId, name);

  return (
    <FormSwitch
      value={value ?? false}
      hideBorder={true}
      disabled={disabled}
      onChange={(value: boolean) => {
        MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
      }}
      note={description != null ? markdownify(description) : undefined}
      className={`${Margins.marginReset} ${Margins.marginTop20}`}
    >
      {displayName}
    </FormSwitch>
  );
}

function Number({ ext, name, setting, disabled }: SettingsProps) {
  const { FormItem, FormText, Slider } = Components;
  const { value, displayName, description } = useConfigEntry<number>(ext.uniqueId, name);

  const castedSetting = setting as NumberSettingType;
  const min = castedSetting.min ?? 0;
  const max = castedSetting.max ?? 100;

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText>{markdownify(description)}</FormText>}
      <Slider
        initialValue={value ?? 0}
        disabled={disabled}
        minValue={castedSetting.min ?? 0}
        maxValue={castedSetting.max ?? 100}
        onValueChange={(value: number) => {
          const rounded = Math.max(min, Math.min(max, Math.round(value)));
          MoonbaseSettingsStore.setExtensionConfig(ext.id, name, rounded);
        }}
      />
    </FormItem>
  );
}

function String({ ext, name, setting, disabled }: SettingsProps) {
  const { FormItem, FormText, TextInput } = Components;
  const { value, displayName, description } = useConfigEntry<string>(ext.uniqueId, name);

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText className={Margins.marginBottom8}>{markdownify(description)}</FormText>}
      <TextInput
        value={value ?? ""}
        onChange={(value: string) => {
          if (disabled) return;
          MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
        }}
      />
    </FormItem>
  );
}

function MultilineString({ ext, name, setting, disabled }: SettingsProps) {
  const { FormItem, FormText, TextArea } = Components;
  const { value, displayName, description } = useConfigEntry<string>(ext.uniqueId, name);

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText className={Margins.marginBottom8}>{markdownify(description)}</FormText>}
      <TextArea
        rows={5}
        value={value ?? ""}
        className={"moonbase-resizeable"}
        onChange={(value: string) => {
          if (disabled) return;
          MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
        }}
      />
    </FormItem>
  );
}

function Select({ ext, name, setting, disabled }: SettingsProps) {
  const { FormItem, FormText, SingleSelect } = Components;
  const { value, displayName, description } = useConfigEntry<string>(ext.uniqueId, name);

  const castedSetting = setting as SelectSettingType;
  const options = castedSetting.options;

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText className={Margins.marginBottom8}>{markdownify(description)}</FormText>}
      <SingleSelect
        autofocus={false}
        clearable={false}
        value={value ?? ""}
        options={options.map((o: SelectOption) => (typeof o === "string" ? { value: o, label: o } : o))}
        onChange={(value: string) => {
          if (disabled) return;
          MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
        }}
      />
    </FormItem>
  );
}

function MultiSelect({ ext, name, setting, disabled }: SettingsProps) {
  const { FormItem, FormText, Select, useVariableSelect, multiSelect } = Components;
  const { value, displayName, description } = useConfigEntry<string | string[]>(ext.uniqueId, name);

  const castedSetting = setting as MultiSelectSettingType;
  const options = castedSetting.options;

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText className={Margins.marginBottom8}>{markdownify(description)}</FormText>}
      <Select
        autofocus={false}
        clearable={false}
        closeOnSelect={false}
        options={options.map((o: SelectOption) => (typeof o === "string" ? { value: o, label: o } : o))}
        {...useVariableSelect({
          onSelectInteraction: multiSelect,
          value: value == null ? new Set() : new Set(Array.isArray(value) ? value : [value]),
          onChange: (value: string) => {
            if (disabled) return;
            MoonbaseSettingsStore.setExtensionConfig(ext.id, name, Array.from(value));
          }
        })}
      />
    </FormItem>
  );
}

// FIXME: type component keys
const { CircleXIcon } = Components;

function RemoveEntryButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  const { Tooltip, Clickable } = Components;
  return (
    <div className={GuildSettingsRoleEditClasses.removeButtonContainer}>
      <Tooltip text="Remove entry" position="top">
        {(props: any) => (
          <Clickable {...props} className={GuildSettingsRoleEditClasses.removeButton} onClick={onClick}>
            <CircleXIcon width={16} height={16} />
          </Clickable>
        )}
      </Tooltip>
    </div>
  );
}

function List({ ext, name, setting, disabled }: SettingsProps) {
  const { FormItem, FormText, TextInput, Button } = Components;
  const { value, displayName, description } = useConfigEntry<string[]>(ext.uniqueId, name);

  const entries = value ?? [];
  const updateConfig = () => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, entries);

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText className={Margins.marginBottom4}>{markdownify(description)}</FormText>}
      <Flex direction={Flex.Direction.VERTICAL}>
        {entries.map((val, i) => (
          // FIXME: stylesheets
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
              size={TextInput.Sizes.MINI}
              value={val}
              disabled={disabled}
              onChange={(newVal: string) => {
                entries[i] = newVal;
                updateConfig();
              }}
            />
            <RemoveEntryButton
              disabled={disabled}
              onClick={() => {
                entries.splice(i, 1);
                updateConfig();
              }}
            />
          </div>
        ))}

        <Button
          look={Button.Looks.FILLED}
          color={Button.Colors.GREEN}
          size={Button.Sizes.SMALL}
          disabled={disabled}
          className={Margins.marginTop8}
          onClick={() => {
            entries.push("");
            updateConfig();
          }}
        >
          Add new entry
        </Button>
      </Flex>
    </FormItem>
  );
}

function Dictionary({ ext, name, setting, disabled }: SettingsProps) {
  const { FormItem, FormText, TextInput, Button } = Components;
  const { value, displayName, description } = useConfigEntry<Record<string, string>>(ext.uniqueId, name);

  const entries = Object.entries(value ?? {});
  const updateConfig = () => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, Object.fromEntries(entries));

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText className={Margins.marginBottom4}>{markdownify(description)}</FormText>}
      <Flex direction={Flex.Direction.VERTICAL}>
        {entries.map(([key, val], i) => (
          // FIXME: stylesheets
          <div
            key={i}
            style={{
              display: "grid",
              height: "32px",
              gap: "8px",
              gridTemplateColumns: "1fr 1fr 32px",
              alignItems: "center"
            }}
          >
            <TextInput
              size={TextInput.Sizes.MINI}
              value={key}
              disabled={disabled}
              onChange={(newKey: string) => {
                entries[i][0] = newKey;
                updateConfig();
              }}
            />
            <TextInput
              size={TextInput.Sizes.MINI}
              value={val}
              disabled={disabled}
              onChange={(newValue: string) => {
                entries[i][1] = newValue;
                updateConfig();
              }}
            />
            <RemoveEntryButton
              disabled={disabled}
              onClick={() => {
                entries.splice(i, 1);
                updateConfig();
              }}
            />
          </div>
        ))}

        <Button
          look={Button.Looks.FILLED}
          color={Button.Colors.GREEN}
          size={Button.Sizes.SMALL}
          className={Margins.marginTop8}
          disabled={disabled}
          onClick={() => {
            entries.push([`entry-${entries.length}`, ""]);
            updateConfig();
          }}
        >
          Add new entry
        </Button>
      </Flex>
    </FormItem>
  );
}

function Custom({ ext, name, setting, disabled }: SettingsProps) {
  const { value, displayName } = useConfigEntry<any>(ext.uniqueId, name);

  const { component: Component } = useStateFromStores(
    [MoonbaseSettingsStore],
    () => {
      return {
        component: MoonbaseSettingsStore.getExtensionConfigComponent(ext.id, name)
      };
    },
    [ext.uniqueId, name]
  );

  if (Component == null) {
    const { Text } = Components;
    return (
      <Text variant="text-md/normal">{`Custom setting "${displayName}" is missing a component. Perhaps the extension is not installed?`}</Text>
    );
  }

  return (
    <Component value={value} setValue={(value) => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value)} />
  );
}

function Setting({ ext, name, setting, disabled }: SettingsProps) {
  const elements: Partial<Record<ExtensionSettingType, SettingsComponent>> = {
    [ExtensionSettingType.Boolean]: Boolean,
    [ExtensionSettingType.Number]: Number,
    [ExtensionSettingType.String]: String,
    [ExtensionSettingType.MultilineString]: MultilineString,
    [ExtensionSettingType.Select]: Select,
    [ExtensionSettingType.MultiSelect]: MultiSelect,
    [ExtensionSettingType.List]: List,
    [ExtensionSettingType.Dictionary]: Dictionary,
    [ExtensionSettingType.Custom]: Custom
  };
  const element = elements[setting.type];
  if (element == null) return <></>;
  return React.createElement(element, { ext, name, setting, disabled });
}

export default function Settings({ ext }: { ext: MoonbaseExtension }) {
  return (
    <Flex className="moonbase-settings" direction={Flex.Direction.VERTICAL}>
      {Object.entries(ext.settingsOverride ?? ext.manifest.settings!).map(([name, setting]) => (
        <Setting
          ext={ext}
          key={name}
          name={name}
          setting={setting}
          disabled={ext.state === ExtensionState.NotDownloaded}
        />
      ))}
    </Flex>
  );
}
