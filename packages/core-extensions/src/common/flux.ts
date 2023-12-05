import { ExtensionWebpackModule } from "@moonlight-mod/types";
import { CommonFlux } from "@moonlight-mod/types/coreExtensions";

const findFlux = ["useStateFromStores:function"];

export const flux: ExtensionWebpackModule = {
  dependencies: [{ ext: "spacepack", id: "spacepack" }, ...findFlux],
  run: (module, exports, require) => {
    const spacepack = require("spacepack_spacepack");
    const Flux = spacepack.findByCode(...findFlux)[0].exports;
    module.exports = Flux as CommonFlux;
  }
};
