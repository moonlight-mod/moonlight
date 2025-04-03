import type { AppPanels } from "../coreExtensions/appPanels";
import type { Commands } from "../coreExtensions/commands";
import type { DMList, MemberList, Messages } from "../coreExtensions/componentEditor";
import type { ContextMenu, EvilItemParser } from "../coreExtensions/contextMenu";
import type { Markdown } from "../coreExtensions/markdown";
import type { Moonbase } from "../coreExtensions/moonbase";
import type { Notices } from "../coreExtensions/notices";
import type { Settings } from "../coreExtensions/settings";
import type { Spacepack } from "../coreExtensions/spacepack";

declare function WebpackRequire(id: string): any;

declare function WebpackRequire(id: "appPanels_appPanels"): AppPanels;

declare function WebpackRequire(id: "commands_commands"): Commands;

declare function WebpackRequire(id: "componentEditor_dmList"): DMList;
declare function WebpackRequire(id: "componentEditor_memberList"): MemberList;
declare function WebpackRequire(id: "componentEditor_messages"): Messages;

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
