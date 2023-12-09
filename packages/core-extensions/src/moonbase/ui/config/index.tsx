import { LogLevel, WebpackRequireType } from "@moonlight-mod/types";
import { CircleXIconSVG } from "../../types";

const logLevels = Object.values(LogLevel).filter(
  (v) => typeof v === "string"
) as string[];

export default (require: WebpackRequireType) => {
  const React = require("common_react");
  const spacepack = require("spacepack_spacepack").spacepack;
  const CommonComponents = require("common_components");
  const {
    FormDivider,
    FormItem,
    FormText,
    FormSwitch,
    TextInput,
    Flex,
    Button,
    SingleSelect,
    Text
  } = CommonComponents;

  const { MoonbaseSettingsStore } =
    require("moonbase_stores") as typeof import("../../webpackModules/stores");

  const FormClasses = spacepack.findByCode("dividerDefault:")[0].exports;
  const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;

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
              <CircleXIcon width={24} height={24} />
            </Clickable>
          )}
        </Tooltip>
      </div>
    );
  }

  function ArrayFormItem({
    config
  }: {
    config: "repositories" | "devSearchPaths";
  }) {
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
              size={TextInput.Sizes.DEFAULT}
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

  return function ConfigPage() {
    return (
      <>
        <Text
          className={Margins.marginBottom20}
          variant="heading-lg/semibold"
          tag="h2"
        >
          Config
        </Text>

        <FormItem title="Repositories">
          <FormText className={Margins.marginBottom4}>
            A list of remote repositories to display extensions from
          </FormText>
          <ArrayFormItem config="repositories" />
        </FormItem>
        <FormDivider className={FormClasses.dividerDefault} />
        <FormItem
          title="Extension search paths"
          className={Margins.marginTop20}
        >
          <FormText className={Margins.marginBottom4}>
            A list of local directories to search for built extensions
          </FormText>
          <ArrayFormItem config="devSearchPaths" />
        </FormItem>
        <FormDivider className={FormClasses.dividerDefault} />
        <FormSwitch
          className={Margins.marginTop20}
          value={MoonbaseSettingsStore.getConfigOption("patchAll")}
          onChange={(value: boolean) => {
            MoonbaseSettingsStore.setConfigOption("patchAll", value);
          }}
          note="Wraps every webpack module in a function, separating them in DevTools"
        >
          Patch all
        </FormSwitch>
        <FormItem title="Log level">
          <SingleSelect
            autofocus={false}
            clearable={false}
            value={MoonbaseSettingsStore.getConfigOption("loggerLevel")}
            options={logLevels.map((o) => ({
              value: o.toLowerCase(),
              label: o[0] + o.slice(1).toLowerCase()
            }))}
            onChange={(v) =>
              MoonbaseSettingsStore.setConfigOption("loggerLevel", v)
            }
          />
        </FormItem>
      </>
    );
  };
};
