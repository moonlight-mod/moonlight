import { ExtensionWebpackModule } from "@moonlight-mod/types";

const findReact = [
  "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
  /\.?version(?:=|:)/,
  /\.?createElement(?:=|:)/
];

export const react: ExtensionWebpackModule = {
  dependencies: [...findReact, { ext: "spacepack", id: "spacepack" }],
  run: (module, exports, require) => {
    const spacepack = require("spacepack_spacepack");
    module.exports = spacepack.findByCode(...findReact)[0].exports;
  }
};
