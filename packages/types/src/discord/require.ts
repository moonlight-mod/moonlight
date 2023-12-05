import {
  Spacepack,
  CommonReact,
  CommonFlux,
  Settings,
  CommonComponents,
  CommonFluxDispatcher
} from "../coreExtensions";

declare function WebpackRequire(id: string): any;
declare function WebpackRequire(id: "spacepack_spacepack"): Spacepack;
declare function WebpackRequire(id: "common_react"): CommonReact;
declare function WebpackRequire(id: "common_flux"): CommonFlux;
declare function WebpackRequire(
  id: "common_fluxDispatcher"
): CommonFluxDispatcher;
declare function WebpackRequire(id: "settings_settings"): Settings;
declare function WebpackRequire(id: "common_components"): CommonComponents;

export default WebpackRequire;
