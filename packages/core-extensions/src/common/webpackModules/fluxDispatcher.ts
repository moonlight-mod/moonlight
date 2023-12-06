import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

module.exports = spacepack.findByExports(
  "isDispatching",
  "dispatch"
)[0].exports.default;
