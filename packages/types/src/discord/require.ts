import { Exports as AppPanels } from "../coreExtensions/appPanels";
import { Exports as Commands } from "../coreExtensions/commands";
import { ErrorBoundaryExports as ErrorBoundary, IconsExports as Icons } from "../coreExtensions/common";
import {
  ChatButtonListExports as ChatButtonList,
  DMListExports as DMList,
  MemberListExports as MemberList,
  MessagesExports as Messages
} from "../coreExtensions/componentEditor";
import { Exports as ContextMenu } from "../coreExtensions/contextMenu";
import { Exports as LinkRedirect } from "../coreExtensions/linkRedirect";
import { Exports as Markdown } from "../coreExtensions/markdown";
import { Exports as Moonbase } from "../coreExtensions/moonbase";
import { Exports as Notices } from "../coreExtensions/notices";
import { Exports as Settings } from "../coreExtensions/settings";
import { Exports as Spacepack } from "../coreExtensions/spacepack";

declare function WebpackRequire(id: string): any;

declare function WebpackRequire(id: "appPanels_appPanels"): AppPanels;

declare function WebpackRequire(id: "commands_commands"): Commands;

declare function WebpackRequire(id: "common_ErrorBoundary"): ErrorBoundary;
declare function WebpackRequire(id: "common_icons"): Icons;

declare function WebpackRequire(id: "componentEditor_chatButtonList"): ChatButtonList;
declare function WebpackRequire(id: "componentEditor_dmList"): DMList;
declare function WebpackRequire(id: "componentEditor_memberList"): MemberList;
declare function WebpackRequire(id: "componentEditor_messages"): Messages;

declare function WebpackRequire(id: "contextMenu_contextMenu"): ContextMenu;

declare function WebpackRequire(id: "linkRedirect_linkRedirect"): LinkRedirect;

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
