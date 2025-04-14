import { AppPanels } from "../coreExtensions/appPanels";
import { Commands } from "../coreExtensions/commands";
import { ErrorBoundary, Icons } from "../coreExtensions/common";
import { DMList, MemberList, Messages } from "../coreExtensions/componentEditor";
import { ContextMenu, EvilItemParser } from "../coreExtensions/contextMenu";
import { Markdown } from "../coreExtensions/markdown";
import { Moonbase } from "../coreExtensions/moonbase";
import { Notices } from "../coreExtensions/notices";
import { Settings } from "../coreExtensions/settings";
import { Spacepack } from "../coreExtensions/spacepack";

declare function WebpackRequire(id: string): any;

declare function WebpackRequire(id: "appPanels_appPanels"): AppPanels;

declare function WebpackRequire(id: "commands_commands"): Commands;

declare function WebpackRequire(id: "common_ErrorBoundary"): ErrorBoundary;
declare function WebpackRequire(id: "common_icons"): Icons;

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
