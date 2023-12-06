import { ExtensionWebpackModule } from "@moonlight-mod/types";

export const components: ExtensionWebpackModule = {
  dependencies: [
    { ext: "spacepack", id: "spacepack" },
    "MasonryList:",
    ".flexGutterSmall,"
    //"ALWAYS_WHITE:",
    //".Messages.SWITCH_ACCOUNTS_TOAST_LOGIN_SUCCESS.format"
  ],
  run: function (module, exports, require) {
    const spacepack = require("spacepack_spacepack").spacepack;

    const Components = spacepack.findByCode("MasonryList:function")[0].exports;
    const MarkdownParser = spacepack.findByCode(
      "parseAutoModerationSystemMessage:"
    )[0].exports.default;
    const LegacyText = spacepack.findByCode(".selectable", ".colorStandard")[0]
      .exports.default;
    const Flex = spacepack.findByCode(".flex" + "GutterSmall,")[0].exports
      .default;
    const CardClasses = spacepack.findByCode("card", "cardHeader", "inModal")[0]
      .exports;
    const ControlClasses = spacepack.findByCode(
      "title",
      "titleDefault",
      "dividerDefault"
    )[0].exports;

    module.exports = {
      ...Components,
      MarkdownParser,
      LegacyText,
      Flex,
      CardClasses,
      ControlClasses
    };
  }
};
