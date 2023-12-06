import {
  ExtensionSettingType,
  ExtensionSettingsManifest,
  MultiSelectSettingType,
  NumberSettingType,
  SelectSettingType
} from "@moonlight-mod/types/config";
import WebpackRequire from "@moonlight-mod/types/discord/require";
import { MoonbaseExtension } from "../types";

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
      >
        {displayName}
      </FormSwitch>
    );
  }

  function Number({ ext, name, setting }: SettingsProps) {
    const { FormTitle, FormText, Slider } = CommonComponents;
    const { value, displayName, description } = useConfigEntry<number>(
      ext.id,
      name
    );

    const castedSetting = setting as NumberSettingType;
    const min = castedSetting.min ?? 0;
    const max = castedSetting.max ?? 100;

    return (
      <>
        <FormTitle>{displayName}</FormTitle>
        {description && <FormText>{description}</FormText>}
        <Slider
          initialValue={value ?? 0}
          minValue={castedSetting.min ?? 0}
          maxValue={castedSetting.max ?? 100}
          onValueChange={(value: number) => {
            const rounded = Math.max(min, Math.min(max, Math.round(value)));
            MoonbaseSettingsStore.setExtensionConfig(ext.id, name, rounded);
          }}
          className={Margins.marginBottom8}
        />
      </>
    );
  }

  function String({ ext, name, setting }: SettingsProps) {
    const { FormTitle, FormText, TextInput } = CommonComponents;
    const { value, displayName, description } = useConfigEntry<string>(
      ext.id,
      name
    );

    return (
      <>
        <FormTitle>{displayName}</FormTitle>
        {description && (
          <FormText className={Margins.marginBottom8}>{description}</FormText>
        )}
        <TextInput
          value={value ?? ""}
          onChange={(value: string) => {
            MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
          }}
          className={Margins.marginBottom20}
        />
      </>
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
      <FormItem title={displayName}>
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
          // @ts-expect-error SingleSelect and Select are almost the exact same type and yet here it errors wtf
          className={Margins.marginBottom20}
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
      <FormItem title={displayName}>
        {description && (
          <FormText className={Margins.marginBottom8}>{description}</FormText>
        )}
        <Select
          autofocus={false}
          clearable={false}
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
          className={Margins.marginBottom20}
        />
      </FormItem>
    );
  }

  function Dictionary({ ext, name, setting }: SettingsProps) {
    const { FormItem, FormText, TextInput, Button, Flex, Tooltip, Clickable } =
      CommonComponents;
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
      <Flex direction={Flex.Direction.VERTICAL}>
        <label className={ControlClasses.title}>{displayName}</label>
        {entries.map(([key, val], i) => (
          // FIXME: stylesheets
          <div
            key={i}
            style={{
              display: "grid",
              height: "40px",
              gap: "10px",
              gridTemplateColumns: "1fr 1fr 40px"
            }}
          >
            <TextInput
              value={key}
              onChange={(newKey: string) => {
                entries[i][0] = newKey;
                MoonbaseSettingsStore.setExtensionConfig(
                  ext.id,
                  name,
                  Object.fromEntries(entries)
                );
              }}
            />
            <TextInput
              value={val}
              onChange={(newValue: string) => {
                entries[i][1] = newValue;
                MoonbaseSettingsStore.setExtensionConfig(
                  ext.id,
                  name,
                  Object.fromEntries(entries)
                );
              }}
            />
            <Button
              color={Button.Colors.RED}
              size={Button.Sizes.ICON}
              onClick={() => {
                entries.splice(i, 1);
                MoonbaseSettingsStore.setExtensionConfig(
                  ext.id,
                  name,
                  Object.fromEntries(entries)
                );
              }}
            >
              X
            </Button>
          </div>
        ))}

        <Button
          look={Button.Looks.FILLED}
          color={Button.Colors.GREEN}
          onClick={() => {
            entries.push([`entry-${entries.length}`, ""]);
            MoonbaseSettingsStore.setExtensionConfig(
              ext.id,
              name,
              Object.fromEntries(entries)
            );
          }}
        >
          Add new entry
        </Button>
      </Flex>
    );
  }

  function Setting({ ext, name, setting }: SettingsProps) {
    const elements: Partial<Record<ExtensionSettingType, SettingsComponent>> = {
      [ExtensionSettingType.Boolean]: Boolean,
      [ExtensionSettingType.Number]: Number,
      [ExtensionSettingType.String]: String,
      [ExtensionSettingType.Select]: Select,
      [ExtensionSettingType.MultiSelect]: MultiSelect,
      [ExtensionSettingType.Dictionary]: Dictionary
    };
    const element = elements[setting.type];
    if (element == null) return <></>;
    return React.createElement(element, { ext, name, setting });
  }

  function Settings({ ext }: { ext: MoonbaseExtension }) {
    const { Flex } = CommonComponents;
    return (
      <Flex direction={Flex.Direction.VERTICAL}>
        {Object.entries(ext.manifest.settings!).map(([name, setting]) => (
          <Setting ext={ext} key={name} name={name} setting={setting} />
        ))}
      </Flex>
    );
  }

  return {
    Boolean,
    Settings
  };
};
