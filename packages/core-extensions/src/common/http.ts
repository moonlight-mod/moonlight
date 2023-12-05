import { ExtensionWebpackModule } from "@moonlight-mod/types";

const findHTTP = ["get", "put", "V8APIError"];

export const http: ExtensionWebpackModule = {
  dependencies: [{ ext: "spacepack", id: "spacepack" }],
  run: (module, exports, require) => {
    const spacepack = require("spacepack_spacepack");
    const HTTP = spacepack.findByExports(...findHTTP)[0].exports;
    module.exports = HTTP.ZP ?? HTTP.Z;
  }
};
