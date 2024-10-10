import { ContextMenu, EvilItemParser } from "../coreExtensions/contextMenu";
import { Markdown } from "../coreExtensions/markdown";
import { Settings } from "../coreExtensions/settings";
import { Spacepack } from "../coreExtensions/spacepack";
import { Notices } from "../coreExtensions/notices";
import { Moonbase } from "../coreExtensions/moonbase";

declare function WebpackRequire(id: string): any;

declare function WebpackRequire(id: "contextMenu_evilMenu"): EvilItemParser;
declare function WebpackRequire(id: "contextMenu_contextMenu"): ContextMenu;

declare function WebpackRequire(id: "markdown_markdown"): Markdown;

declare function WebpackRequire(id: "moonbase_moonbase"): Moonbase;

declare function WebpackRequire(id: "notices_notices"): Notices;

declare function WebpackRequire(id: "settings_settings"): {
  Settings: Settings;
  default: Settings;
};

declare function WebpackRequire(id: "spacepack_spacepack"): {
  default: Spacepack;
  spacepack: Spacepack;
};

export default WebpackRequire;
