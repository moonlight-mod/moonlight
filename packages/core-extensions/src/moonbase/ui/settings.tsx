import {
  ExtensionSettingType,
  ExtensionSettingsManifest,
  MultiSelectSettingType,
  NumberSettingType,
  SelectSettingType
} from "@moonlight-mod/types/config";
import WebpackRequire from "@moonlight-mod/types/discord/require";
import { CircleXIconSVG, MoonbaseExtension } from "../types";

type SettingsProps = {
  ext: MoonbaseExtension;
  name: string;
  setting: ExtensionSettingsManifest;
};

type SettingsComponent = React.ComponentType<SettingsProps>;

export default (require: typeof WebpackRequire) => {
  const React = require("common_react");
  const CommonComponents = require("common_components");
  const Flux = require("common_flux");
  const spacepack = require("spacepack_spacepack").spacepack;

  const { MoonbaseSettingsStore } =
    require("moonbase_stores") as typeof import("../webpackModules/stores");

  const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;

  function useConfigEntry<T>(id: string, name: string) {
    return Flux.useStateFromStores(
      [MoonbaseSettingsStore],
      () => {
        return {
          value: MoonbaseSettingsStore.getExtensionConfig<T>(id, name),
          displayName: MoonbaseSettingsStore.getExtensionConfigName(id, name),
          description: MoonbaseSettingsStore.getExtensionConfigDescription(
            id,
            name
          )
        };
      },
      [id, name]
    );
  }

  function Boolean({ ext, name, setting }: SettingsProps) {
    const { FormSwitch } = CommonComponents;
    const { value, displayName, description } = useConfigEntry<boolean>(
      ext.id,
      name
    );

    return (
      <FormSwitch
        value={value ?? false}
        hideBorder={true}
        onChange={(value: boolean) => {
          MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
        }}
        note={description}
        className={`${Margins.marginReset} ${Margins.marginTop20}`}
      >
        {displayName}
      </FormSwitch>
    );
  }

  function Number({ ext, name, setting }: SettingsProps) {
    const { FormItem, FormText, Slider } = CommonComponents;
    const { value, displayName, description } = useConfigEntry<number>(
      ext.id,
      name
    );

    const castedSetting = setting as NumberSettingType;
    const min = castedSetting.min ?? 0;
    const max = castedSetting.max ?? 100;

    return (
      <FormItem className={Margins.marginTop20} title={displayName}>
        {description && <FormText>{description}</FormText>}
        <Slider
          initialValue={value ?? 0}
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

  function String({ ext, name, setting }: SettingsProps) {
    const { FormItem, FormText, TextInput } = CommonComponents;
    const { value, displayName, description } = useConfigEntry<string>(
      ext.id,
      name
    );

    return (
      <FormItem className={Margins.marginTop20} title={displayName}>
        {description && (
          <FormText className={Margins.marginBottom8}>{description}</FormText>
        )}
        <TextInput
          value={value ?? ""}
          onChange={(value: string) => {
            MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
          }}
        />
      </FormItem>
    );
  }

  function Select({ ext, name, setting }: SettingsProps) {
    const { FormItem, FormText, SingleSelect } = CommonComponents;
    const { value, displayName, description } = useConfigEntry<string>(
      ext.id,
      name
    );

    const castedSetting = setting as SelectSettingType;
    const options = castedSetting.options;

    return (
      <FormItem className={Margins.marginTop20} title={displayName}>
        {description && (
          <FormText className={Margins.marginBottom8}>{description}</FormText>
        )}
        <SingleSelect
          autofocus={false}
          clearable={false}
          value={value ?? ""}
          options={options.map((o) => ({ value: o, label: o }))}
          onChange={(value: string) => {
            MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
          }}
        />
      </FormItem>
    );
  }

  function MultiSelect({ ext, name, setting }: SettingsProps) {
    const { FormItem, FormText, Select, useVariableSelect, multiSelect } =
      CommonComponents;
    const { value, displayName, description } = useConfigEntry<
      string | string[]
    >(ext.id, name);

    const castedSetting = setting as MultiSelectSettingType;
    const options = castedSetting.options;

    return (
      <FormItem className={Margins.marginTop20} title={displayName}>
        {description && (
          <FormText className={Margins.marginBottom8}>{description}</FormText>
        )}
        <Select
          autofocus={false}
          clearable={false}
          closeOnSelect={false}
          options={options.map((o) => ({ value: o, label: o }))}
          {...useVariableSelect({
            onSelectInteraction: multiSelect,
            value: new Set(Array.isArray(value) ? value : [value]),
            onChange: (value: string) => {
              MoonbaseSettingsStore.setExtensionConfig(
                ext.id,
                name,
                Array.from(value)
              );
            }
          })}
        />
      </FormItem>
    );
  }

  const RemoveButtonClasses = spacepack.findByCode("removeButtonContainer")[0]
    .exports;
  const CircleXIcon = spacepack.findByCode(CircleXIconSVG)[0].exports.default;
  function RemoveEntryButton({ onClick }: { onClick: () => void }) {
    const { Tooltip, Clickable } = CommonComponents;
    return (
      <div className={RemoveButtonClasses.removeButtonContainer}>
        <Tooltip text="Remove entry" position="top">
          {(props: any) => (
            <Clickable
              {...props}
              className={RemoveButtonClasses.removeButton}
              onClick={onClick}
            >
              <CircleXIcon width={16} height={16} />
            </Clickable>
          )}
        </Tooltip>
      </div>
    );
  }

  function List({ ext, name, setting }: SettingsProps) {
    const { FormItem, FormText, TextInput, Button, Flex } = CommonComponents;
    const { value, displayName, description } = useConfigEntry<string[]>(
      ext.id,
      name
    );

    const entries = value ?? [];
    const updateConfig = () =>
      MoonbaseSettingsStore.setExtensionConfig(ext.id, name, entries);

    return (
      <FormItem className={Margins.marginTop20} title={displayName}>
        {description && (
          <FormText className={Margins.marginBottom4}>{description}</FormText>
        )}
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
                onChange={(newVal: string) => {
                  entries[i] = newVal;
                  updateConfig();
                }}
              />
              <RemoveEntryButton
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

  function Dictionary({ ext, name, setting }: SettingsProps) {
    const { FormItem, FormText, TextInput, Button, Flex } = CommonComponents;
    const { value, displayName, description } = useConfigEntry<
      Record<string, string>
    >(ext.id, name);

    const entries = Object.entries(value ?? {});
    const updateConfig = () =>
      MoonbaseSettingsStore.setExtensionConfig(
        ext.id,
        name,
        Object.fromEntries(entries)
      );

    return (
      <FormItem className={Margins.marginTop20} title={displayName}>
        {description && (
          <FormText className={Margins.marginBottom4}>{description}</FormText>
        )}
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
                onChange={(newKey: string) => {
                  entries[i][0] = newKey;
                  updateConfig();
                }}
              />
              <TextInput
                size={TextInput.Sizes.MINI}
                value={val}
                onChange={(newValue: string) => {
                  entries[i][1] = newValue;
                  updateConfig();
                }}
              />
              <RemoveEntryButton
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

  function Setting({ ext, name, setting }: SettingsProps) {
    const elements: Partial<Record<ExtensionSettingType, SettingsComponent>> = {
      [ExtensionSettingType.Boolean]: Boolean,
      [ExtensionSettingType.Number]: Number,
      [ExtensionSettingType.String]: String,
      [ExtensionSettingType.Select]: Select,
      [ExtensionSettingType.MultiSelect]: MultiSelect,
      [ExtensionSettingType.List]: List,
      [ExtensionSettingType.Dictionary]: Dictionary
    };
    const element = elements[setting.type];
    if (element == null) return <></>;
    return React.createElement(element, { ext, name, setting });
  }

  return function Settings({ ext }: { ext: MoonbaseExtension }) {
    const { Flex } = CommonComponents;
    return (
      <Flex className="moonbase-settings" direction={Flex.Direction.VERTICAL}>
        <style>
          {".moonbase-settings > :nth-child(2) { margin-top: 0px; }"}
        </style>
        {Object.entries(ext.manifest.settings!).map(([name, setting]) => (
          <Setting ext={ext} key={name} name={name} setting={setting} />
        ))}
      </Flex>
    );
  };
};
