import { Spacepack, Settings, CommonComponents } from "../coreExtensions";
import { ContextMenu, EvilItemParser } from "../coreExtensions/contextMenu";
import { Markdown } from "../coreExtensions/markdown";

declare function WebpackRequire(id: string): any;
declare function WebpackRequire(id: "spacepack_spacepack"): {
  default: Spacepack;
  spacepack: Spacepack;
};

declare function WebpackRequire(id: "common_components"): CommonComponents;

declare function WebpackRequire(id: "settings_settings"): {
  Settings: Settings;
  default: Settings;
};

declare function WebpackRequire(id: "markdown_markdown"): Markdown;

declare function WebpackRequire(id: "contextMenu_evilMenu"): EvilItemParser;
declare function WebpackRequire(id: "contextMenu_contextMenu"): ContextMenu;

export default WebpackRequire;
