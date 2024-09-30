import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

const Components = spacepack.findByCode("MasonryList:function")[0].exports;
const MarkdownParser = spacepack.findByCode(
  "parseAutoModerationSystemMessage:"
)[0].exports.Z;
const LegacyText = spacepack.findByCode(".selectable", ".colorStandard")[0]
  .exports.default;
const Flex = Object.values(
  spacepack.findByCode(".flex" + "GutterSmall,")[0].exports
)[0];

const CardClasses = {};
spacepack
  .lazyLoad(
    "renderArtisanalHack",
    /\[(?:.\.e\("\d+?"\),?)+\][^}]+?webpackId:\d+,name:"ChannelSettings"/,
    /webpackId:(\d+),name:"ChannelSettings"/
  )
  .then(() =>
    Object.assign(
      CardClasses,
      spacepack.findByExports("card", "cardHeader", "inModal")[0].exports
    )
  );

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
