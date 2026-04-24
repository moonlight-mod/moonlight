import { LogLevel } from "@moonlight-mod/types";

const logLevels = Object.values(LogLevel).filter((v) => typeof v === "string") as string[];

import ErrorBoundary from "@moonlight-mod/wp/common_ErrorBoundary";
import { SingleSelect } from "@moonlight-mod/wp/discord/components/common/Select";
import Button from "@moonlight-mod/wp/discord/design/components/Button/web/Button";
import Field from "@moonlight-mod/wp/discord/design/components/Form/web/Field";
import FieldSetClasses from "@moonlight-mod/wp/discord/design/components/Form/web/FieldSet.css";
import Stack from "@moonlight-mod/wp/discord/design/components/Stack/Stack";
import Switch from "@moonlight-mod/wp/discord/design/components/Switch/web/VoidSwitch";
import CircleXIcon from "@moonlight-mod/wp/discord/modules/icons/web/CircleXIcon";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import TextInput from "@moonlight-mod/wp/discord/uikit/TextInput";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";

function ArrayFormItem({
  label,
  description,
  config
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  config: "repositories" | "devSearchPaths";
}) {
  const items = useStateFromStores([MoonbaseSettingsStore], () => MoonbaseSettingsStore.getConfigOption(config) ?? [], [
    config
  ]);

  return (
    <fieldset className={FieldSetClasses.fieldset}>
      <Field label={label} description={description} layout="horizontal">
        <Button
          text="Add new entry"
          variant="active"
          onClick={() => {
            const newItems = [...items, ""];
            MoonbaseSettingsStore.setConfigOption(config, newItems);
          }}
        />
      </Field>
      <Stack direction="vertical" gap={4}>
        {items.map((val, i) => (
          <div
            key={`${config}-${i}`}
            style={{
              display: "grid",
              gap: "4px",
              gridTemplateColumns: "1fr 40px",
              alignItems: "center"
            }}
          >
            <TextInput
              key={`${config}-${i}-input`}
              value={val}
              onChange={(newVal: string) => {
                const newItems = items.map((v, idx) => (idx === i ? newVal : v));
                MoonbaseSettingsStore.setConfigOption(config, newItems);
              }}
            />
            <Button
              icon={CircleXIcon}
              variant="icon-only"
              aria-label="Remove entry"
              key={`${config}-${i}-delete`}
              onClick={() => {
                const newItems = items.filter((_, idx) => idx !== i);
                MoonbaseSettingsStore.setConfigOption(config, newItems);
              }}
            />
          </div>
        ))}
      </Stack>
    </fieldset>
  );
}

export default function ConfigPage() {
  return (
    <ErrorBoundary>
      <Stack direction="vertical" gap={16}>
        <Switch
          checked={MoonbaseSettingsStore.getExtensionConfigRaw<boolean>("moonbase", "updateChecking", true) ?? true}
          onChange={(value: boolean) => {
            MoonbaseSettingsStore.setExtensionConfig("moonbase", "updateChecking", value);
          }}
          label="Automatic update checking"
          description="Checks for updates to moonlight"
        />
        <ArrayFormItem
          label="Repositories"
          description="A list of remote repositories to display extensions from"
          config="repositories"
        />
        <ArrayFormItem
          label="Extension search paths"
          description="A list of local directories to search for built extensions"
          config="devSearchPaths"
        />
        <Switch
          checked={MoonbaseSettingsStore.getConfigOption("patchAll") ?? false}
          onChange={(value: boolean) => {
            MoonbaseSettingsStore.setConfigOption("patchAll", value);
          }}
          label="Patch all"
          description="Wraps every webpack module in a function, separating them in DevTools"
        />
        <Field label="Log level">
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
        </Field>
      </Stack>
    </ErrorBoundary>
  );
}
