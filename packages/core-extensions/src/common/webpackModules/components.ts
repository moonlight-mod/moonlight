import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const Components = spacepack.findByCode("MasonryList:function")[0].exports;
const MarkdownParser = spacepack.findByCode(
  "parseAutoModerationSystemMessage:"
)[0].exports.default;
const LegacyText = spacepack.findByCode(".selectable", ".colorStandard")[0]
  .exports.default;
const Flex = spacepack.findByCode(".flex" + "GutterSmall,")[0].exports.Flex;
const CardClasses = spacepack.findByCode("card", "cardHeader", "inModal")[0]
  .exports;
const ControlClasses = spacepack.findByCode(
  "title",
  "titleDefault",
  "dividerDefault"
)[0].exports;

// We use CJS export here because merging the exports from Components is annoying as shit
module.exports = {
  ...Components,
  MarkdownParser,
  LegacyText,
  Flex,
  CardClasses,
  ControlClasses
};
