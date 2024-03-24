import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

module.exports = spacepack.findByCode(
  ["useStateFromStores", ":function"].join(""),
  "Store:"
)[0].exports;
