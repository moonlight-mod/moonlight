import { ExtensionCompat } from "@moonlight-mod/core/extension/loader";
import {
  type ExtensionSettingsManifest,
  ExtensionSettingType,
  type MultiSelectSettingType,
  type NumberSettingType,
  type SelectOption,
  type SelectSettingType
} from "@moonlight-mod/types/config";
import ErrorBoundary from "@moonlight-mod/wp/common_ErrorBoundary";
import {
  multiSelect,
  Select as SelectComponent,
  SingleSelect,
  useVariableSelect
} from "@moonlight-mod/wp/discord/components/common/Select";
import Button from "@moonlight-mod/wp/discord/design/components/Button/web/Button";
import Field from "@moonlight-mod/wp/discord/design/components/Form/web/Field";
import FieldSetClasses from "@moonlight-mod/wp/discord/design/components/Form/web/FieldSet.css";
import NumberInputStepper from "@moonlight-mod/wp/discord/design/components/NumberInput/web/NumberInputStepper";
import Slider from "@moonlight-mod/wp/discord/design/components/Slider/web/Slider";
import Stack from "@moonlight-mod/wp/discord/design/components/Stack/Stack";
import Switch from "@moonlight-mod/wp/discord/design/components/Switch/web/ManaSwitch";
import Text from "@moonlight-mod/wp/discord/design/components/Text/Text";
import TextArea from "@moonlight-mod/wp/discord/design/mana/components/TextArea/web/TextArea";
import CircleXIcon from "@moonlight-mod/wp/discord/modules/icons/web/CircleXIcon";
import MarkupUtils from "@moonlight-mod/wp/discord/modules/markup/MarkupUtils";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import TextInput from "@moonlight-mod/wp/discord/uikit/TextInput";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";
import { ExtensionState, type MoonbaseExtension } from "../../../types";

type SettingsProps = {
  ext: MoonbaseExtension;
  name: string;
  setting: ExtensionSettingsManifest;
  disabled: boolean;
};
type SettingsComponent = React.ComponentType<SettingsProps>;

function markdownify(str: string) {
  return MarkupUtils.parse(str, true, {
    hideSimpleEmbedContent: true,
    allowLinks: true
  });
}

function useConfigEntry<T>(uniqueId: number, name: string) {
  return useStateFromStores([MoonbaseSettingsStore], () => {
    return {
      value: MoonbaseSettingsStore.getExtensionConfig<T>(uniqueId, name),
      displayName: MoonbaseSettingsStore.getExtensionConfigName(uniqueId, name),
      description: MoonbaseSettingsStore.getExtensionConfigDescription(uniqueId, name)
    };
  }, [uniqueId, name]);
}

function BooleanSetting({ ext, name, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<boolean>(ext.uniqueId, name);

  return (
    <Switch
      checked={value ?? false}
      disabled={disabled}
      onChange={(value: boolean) => {
        MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value);
      }}
      label={displayName}
      description={description != null ? (markdownify(description) as unknown as string) : undefined}
    />
  );
}

function NumberSetting({ ext, name, setting, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<number>(ext.uniqueId, name);

  const castedSetting = setting as NumberSettingType;
  const min = castedSetting.min;
  const max = castedSetting.max;

  const onChange = (value: number) => {
    if (disabled) return;
    const rounded = min == null || max == null ? Math.round(value) : Math.max(min, Math.min(max, Math.round(value)));
    MoonbaseSettingsStore.setExtensionConfig(ext.id, name, rounded);
  };

  return min == null || max == null ? (
    <Field
      label={displayName}
      description={description != null ? markdownify(description) : null}
      layout="horizontal"
      disabled={disabled}
    >
      <NumberInputStepper className="moonbase-settings-number-input" value={value ?? 0} onChange={onChange} />
    </Field>
  ) : (
    <Slider
      label={displayName}
      description={description != null ? markdownify(description) : null}
      initialValue={value ?? 0}
      disabled={disabled}
      minValue={min}
      maxValue={max}
      onValueChange={onChange}
      onValueRender={(value: number) => `${Math.round(value)}`}
    />
  );
}

function StringSetting({ ext, name, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<string>(ext.uniqueId, name);

  return (
    <Field label={displayName} description={description != null ? markdownify(description) : null} disabled={disabled}>
      <TextInput
        value={value ?? ""}
        disabled={disabled}
        onChange={(value: string) => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value)}
      />
    </Field>
  );
}

function MultilineStringSetting({ ext, name, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<string>(ext.uniqueId, name);

  return (
    <TextArea
      label={displayName}
      description={description != null ? markdownify(description) : null}
      rows={5}
      value={value ?? ""}
      disabled={disabled}
      className={"moonbase-resizeable"}
      onChange={(value: string) => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value)}
    />
  );
}

function SelectSetting({ ext, name, setting, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<string>(ext.uniqueId, name);

  const castedSetting = setting as SelectSettingType;
  const options = castedSetting.options;

  return (
    <Field label={displayName} description={description != null ? markdownify(description) : null} disabled={disabled}>
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
    </Field>
  );
}

function MultiSelectSetting({ ext, name, setting, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<string | string[]>(ext.uniqueId, name);

  const castedSetting = setting as MultiSelectSettingType;
  const options = castedSetting.options;

  return (
    <Field label={displayName} description={description != null ? markdownify(description) : null} disabled={disabled}>
      <SelectComponent
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
    </Field>
  );
}

function ListSetting({ ext, name, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<string[]>(ext.uniqueId, name);

  const entries = value ?? [];
  const updateConfig = () => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, entries);

  return (
    <fieldset className={FieldSetClasses.fieldset}>
      <Field
        label={displayName}
        description={description != null ? markdownify(description) : null}
        layout="horizontal"
        disabled={disabled}
      >
        <Button
          text="Add new entry"
          variant="active"
          disabled={disabled}
          onClick={() => {
            entries.push("");
            updateConfig();
          }}
        />
      </Field>
      <Stack direction="vertical" gap={4}>
        {entries.map((value, i) => (
          <div key={i} className="moonbase-settings-list-entry">
            <TextInput
              key={`${i}-input`}
              value={value}
              disabled={disabled}
              onChange={(newValue: string) => {
                entries[i] = newValue;
                updateConfig();
              }}
            />
            <Button
              icon={CircleXIcon}
              variant="icon-only"
              aria-label="Remove entry"
              key={`${i}-delete`}
              disabled={disabled}
              onClick={() => {
                entries.splice(i, 1);
                updateConfig();
              }}
            />
          </div>
        ))}
      </Stack>
    </fieldset>
  );
}

function DictionarySetting({ ext, name, disabled }: SettingsProps) {
  const { value, displayName, description } = useConfigEntry<Record<string, string>>(ext.uniqueId, name);

  const entries = Object.entries(value ?? {});
  const updateConfig = () => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, Object.fromEntries(entries));

  return (
    <fieldset className={FieldSetClasses.fieldset}>
      <Field
        label={displayName}
        description={description != null ? markdownify(description) : null}
        layout="horizontal"
        disabled={disabled}
      >
        <Button
          text="Add new entry"
          variant="active"
          disabled={disabled}
          onClick={() => {
            entries.push([`entry-${entries.length}`, ""]);
            updateConfig();
          }}
        />
      </Field>
      <Stack direction="vertical" gap={4}>
        {entries.map(([key, value], i) => (
          <div key={i} className="moonbase-settings-dictionary-entry">
            <TextInput
              key={`${i}-key`}
              value={key}
              disabled={disabled}
              onChange={(newKey: string) => {
                entries[i][0] = newKey;
                updateConfig();
              }}
            />
            <TextInput
              key={`${i}-value`}
              value={value}
              disabled={disabled}
              onChange={(newValue: string) => {
                entries[i][1] = newValue;
                updateConfig();
              }}
            />
            <Button
              icon={CircleXIcon}
              variant="icon-only"
              aria-label="Remove entry"
              key={`${i}-delete`}
              disabled={disabled}
              onClick={() => {
                entries.splice(i, 1);
                updateConfig();
              }}
            />
          </div>
        ))}
      </Stack>
    </fieldset>
  );
}

function CustomSetting({ ext, name }: SettingsProps) {
  const { value, displayName } = useConfigEntry<any>(ext.uniqueId, name);

  const { component: Component } = useStateFromStores([MoonbaseSettingsStore], () => {
    return {
      component: MoonbaseSettingsStore.getExtensionConfigComponent(ext.id, name)
    };
  }, [ext.uniqueId, name]);

  if (Component == null) {
    return (
      <Text variant="text-md/normal">{`Custom setting "${displayName}" is missing a component. Perhaps the extension is not installed?`}</Text>
    );
  }

  return (
    <ErrorBoundary>
      <Component value={value} setValue={(value) => MoonbaseSettingsStore.setExtensionConfig(ext.id, name, value)} />
    </ErrorBoundary>
  );
}

function Setting({ ext, name, setting, disabled }: SettingsProps) {
  const elements: Partial<Record<ExtensionSettingType, SettingsComponent>> = {
    [ExtensionSettingType.Boolean]: BooleanSetting,
    [ExtensionSettingType.Number]: NumberSetting,
    [ExtensionSettingType.String]: StringSetting,
    [ExtensionSettingType.MultilineString]: MultilineStringSetting,
    [ExtensionSettingType.Select]: SelectSetting,
    [ExtensionSettingType.MultiSelect]: MultiSelectSetting,
    [ExtensionSettingType.List]: ListSetting,
    [ExtensionSettingType.Dictionary]: DictionarySetting,
    [ExtensionSettingType.Custom]: CustomSetting
  };
  const element = elements[setting.type];
  if (element == null) return;
  return React.createElement(element, { ext, name, setting, disabled });
}

export default function Settings({ ext }: { ext: MoonbaseExtension }) {
  return (
    <Stack direction="vertical" gap={16}>
      {Object.entries(ext.settingsOverride ?? ext.manifest.settings!).map(([name, setting]) => (
        <Setting
          ext={ext}
          key={name}
          name={name}
          setting={setting}
          disabled={ext.state === ExtensionState.NotDownloaded || ext.compat === ExtensionCompat.InvalidEnvironment}
        />
      ))}
    </Stack>
  );
}
