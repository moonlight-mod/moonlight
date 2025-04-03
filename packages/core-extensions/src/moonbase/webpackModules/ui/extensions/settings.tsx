import type {
  ExtensionSettingsManifest,
  MultiSelectSettingType,
  NumberSettingType,
  SelectOption,
  SelectSettingType
} from "@moonlight-mod/types/config";
import type { MoonbaseExtension } from "../../../types";

import {
  ExtensionSettingType
} from "@moonlight-mod/types/config";
import ErrorBoundary from "@moonlight-mod/wp/common_ErrorBoundary";

import {
  Button,
  CircleXIcon,
  Clickable,
  Select as DiscordSelect,
  FormItem,
  FormSwitch,
  FormText,
  multiSelect,
  NumberInputStepper,
  SingleSelect,
  Slider,
  Text,
  TextArea,
  TextInput,
  Tooltip,
  useVariableSelect
} from "@moonlight-mod/wp/discord/components/common/index";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Flex from "@moonlight-mod/wp/discord/uikit/Flex";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { ExtensionState } from "../../../types";

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

interface SettingsProps {
  ext: MoonbaseExtension;
  name: string;
  setting: ExtensionSettingsManifest;
  disabled: boolean;
}
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

function Boolean({ ext, name, setting: _setting, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<boolean>(ext.uniqueId, name);

  return (
    <FormSwitch
      className={`${Margins.marginReset} ${Margins.marginTop20}`}
      disabled={disabled}
      hideBorder={true}
      note={description != null ? markdownify(description) : undefined}
      onChange={(value: boolean) => {
        MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
      }}
      value={value ?? false}
    >
      {displayName}
    </FormSwitch>
  );
}

function Number({ ext, name, setting, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<number>(ext.uniqueId, name);

  const castedSetting = setting as NumberSettingType;
  const min = castedSetting.min;
  const max = castedSetting.max;

  const onChange = (value: number) => {
    const rounded = min == null || max == null ? Math.round(value) : Math.max(min, Math.min(max, Math.round(value)));
    MoonbaseSettingsStore.setExtensionConfig(ext.id, name, rounded);
  };

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {min == null || max == null
        ? (
            <Flex direction={Flex.Direction.HORIZONTAL} justify={Flex.Justify.BETWEEN}>
              {description && <FormText>{markdownify(description)}</FormText>}
              <NumberInputStepper onChange={onChange} value={value ?? 0} />
            </Flex>
          )
        : (
            <>
              {description && <FormText>{markdownify(description)}</FormText>}
              <Slider
                disabled={disabled}
                initialValue={value ?? 0}
                maxValue={max}
                minValue={min}
                onValueChange={onChange}
                onValueRender={(value: number) => `${Math.round(value)}`}
              />
            </>
          )}
    </FormItem>
  );
}

function String({ ext, name, setting: _setting, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<string>(ext.uniqueId, name);

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText className={Margins.marginBottom8}>{markdownify(description)}</FormText>}
      <TextInput
        disabled={disabled}
        onChange={(value: string) => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value)}
        value={value ?? ""}
      />
    </FormItem>
  );
}

function MultilineString({ ext, name, setting: _setting, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<string>(ext.uniqueId, name);

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText className={Margins.marginBottom8}>{markdownify(description)}</FormText>}
      <TextArea
        className="moonbase-resizeable"
        disabled={disabled}
        onChange={(value: string) => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value)}
        rows={5}
        value={value ?? ""}
      />
    </FormItem>
  );
}

function Select({ ext, name, setting, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<string>(ext.uniqueId, name);

  const castedSetting = setting as SelectSettingType;
  const options = castedSetting.options;

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText className={Margins.marginBottom8}>{markdownify(description)}</FormText>}
      <SingleSelect
        autofocus={false}
        clearable={false}
        onChange={(value: string) => {
          if (disabled) return;
          MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
        }}
        options={options.map((o: SelectOption) => (typeof o === "string" ? { value: o, label: o } : o))}
        value={value ?? ""}
      />
    </FormItem>
  );
}

function MultiSelect({ ext, name, setting, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<string | string[]>(ext.uniqueId, name);

  const castedSetting = setting as MultiSelectSettingType;
  const options = castedSetting.options;

  return (
    <FormItem className={Margins.marginTop20} title={displayName}>
      {description && <FormText className={Margins.marginBottom8}>{markdownify(description)}</FormText>}
      <DiscordSelect
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

function RemoveEntryButton({ onClick, disabled: _disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <div className={GuildSettingsRoleEditClasses.removeButtonContainer}>
      <Tooltip position="top" text="Remove entry">
        {(props: any) => (
          <Clickable {...props} className={GuildSettingsRoleEditClasses.removeButton} onClick={onClick}>
            <CircleXIcon height={16} width={16} />
          </Clickable>
        )}
      </Tooltip>
    </div>
  );
}

function List({ ext, name, setting: _setting, disabled }: SettingsProps) {
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
              disabled={disabled}
              onChange={(newVal: string) => {
                entries[i] = newVal;
                updateConfig();
              }}
              size={TextInput.Sizes.MINI}
              value={val}
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
          className={Margins.marginTop8}
          color={Button.Colors.GREEN}
          disabled={disabled}
          look={Button.Looks.FILLED}
          onClick={() => {
            entries.push("");
            updateConfig();
          }}
          size={Button.Sizes.SMALL}
        >
          Add new entry
        </Button>
      </Flex>
    </FormItem>
  );
}

function Dictionary({ ext, name, setting: _setting, disabled }: SettingsProps) {
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
              disabled={disabled}
              onChange={(newKey: string) => {
                entries[i][0] = newKey;
                updateConfig();
              }}
              size={TextInput.Sizes.MINI}
              value={key}
            />
            <TextInput
              disabled={disabled}
              onChange={(newValue: string) => {
                entries[i][1] = newValue;
                updateConfig();
              }}
              size={TextInput.Sizes.MINI}
              value={val}
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
          className={Margins.marginTop8}
          color={Button.Colors.GREEN}
          disabled={disabled}
          look={Button.Looks.FILLED}
          onClick={() => {
            entries.push([`entry-${entries.length}`, ""]);
            updateConfig();
          }}
          size={Button.Sizes.SMALL}
        >
          Add new entry
        </Button>
      </Flex>
    </FormItem>
  );
}

function Custom({ ext, name, setting: _setting, disabled: _disabled }: SettingsProps) {
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
    return (
      <Text variant="text-md/normal">{`Custom setting "${displayName}" is missing a component. Perhaps the extension is not installed?`}</Text>
    );
  }

  return (
    <ErrorBoundary>
      <Component setValue={value => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value)} value={value} />
    </ErrorBoundary>
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
          disabled={ext.state === ExtensionState.NotDownloaded}
          ext={ext}
          key={name}
          name={name}
          setting={setting}
        />
      ))}
    </Flex>
  );
}
