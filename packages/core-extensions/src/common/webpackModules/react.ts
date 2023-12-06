import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

module.exports = spacepack.findByCode(
  "__SECRET_INTERNALS_DO_NOT_USE" + "_OR_YOU_WILL_BE_FIRED",
  /\.?version(?:=|:)/,
  /\.?createElement(?:=|:)/
)[0].exports;
