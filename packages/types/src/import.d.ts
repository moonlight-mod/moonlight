declare module "@moonlight-mod/wp/appPanels_appPanels" {
  import { CoreExtensions } from "@moonlight-mod/types";
  const AppPanels: CoreExtensions.AppPanels.AppPanels;
  export = AppPanels;
}

declare module "@moonlight-mod/wp/common_stores";

declare module "@moonlight-mod/wp/contextMenu_evilMenu" {
  import { CoreExtensions } from "@moonlight-mod/types";
  const EvilParser: CoreExtensions.ContextMenu.EvilItemParser;
  export = EvilParser;
}
declare module "@moonlight-mod/wp/contextMenu_contextMenu" {
  import { CoreExtensions } from "@moonlight-mod/types";
  const ContextMenu: CoreExtensions.ContextMenu.ContextMenu;
  export = ContextMenu;
}

declare module "@moonlight-mod/wp/markdown_markdown" {
  import { CoreExtensions } from "@moonlight-mod/types";
  const Markdown: CoreExtensions.Markdown.Markdown;
  export = Markdown;
}

declare module "@moonlight-mod/wp/moonbase_moonbase" {
  import { CoreExtensions } from "@moonlight-mod/types";
  const Moonbase: CoreExtensions.Moonbase.Moonbase;
  export = Moonbase;
}

declare module "@moonlight-mod/wp/notices_notices" {
  import { CoreExtensions } from "@moonlight-mod/types";
  const Notices: CoreExtensions.Notices.Notices;
  export = Notices;
}

declare module "@moonlight-mod/wp/settings_settings" {
  import { CoreExtensions } from "@moonlight-mod/types";
  export const Settings: CoreExtensions.Settings.Settings;
  export default Settings;
}

declare module "@moonlight-mod/wp/spacepack_spacepack" {
  import { CoreExtensions } from "@moonlight-mod/types";
  export const spacepack: CoreExtensions.Spacepack.Spacepack;
  export default spacepack;
}
