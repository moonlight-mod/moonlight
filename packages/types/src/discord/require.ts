import {
  Spacepack,
  CommonReact,
  CommonFlux,
  Settings,
  CommonComponents,
  CommonFluxDispatcher
} from "../coreExtensions";
import { Markdown } from "../coreExtensions/markdown";

declare function WebpackRequire(id: string): any;
declare function WebpackRequire(id: "spacepack_spacepack"): {
  default: Spacepack;
  spacepack: Spacepack;
};

declare function WebpackRequire(id: "common_components"): CommonComponents;
declare function WebpackRequire(id: "common_flux"): CommonFlux;
declare function WebpackRequire(
  id: "common_fluxDispatcher"
): CommonFluxDispatcher;
declare function WebpackRequire(id: "common_react"): CommonReact;

declare function WebpackRequire(id: "settings_settings"): {
  Settings: Settings;
  default: Settings;
};

declare function WebpackRequire(id: "markdown_markdown"): Markdown;

export default WebpackRequire;
