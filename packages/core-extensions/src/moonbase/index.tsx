import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  stores: {
    dependencies: [
      { id: "discord/packages/flux" },
      { id: "discord/Dispatcher" }
    ]
  },

  ui: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { id: "react" },
      { id: "discord/components/common/index" },
      { ext: "moonbase", id: "stores" },
      { id: "discord/modules/guild_settings/IntegrationCard.css" },
      "Masks.PANEL_BUTTON",
      '"Missing channel in Channel.openChannelContextMenu"',
      ".forumOrHome]:"
    ]
  },

  moonbase: {
    dependencies: [
      { ext: "spacepack", id: "spacepack" },
      { ext: "settings", id: "settings" },
      { id: "react" },
      { ext: "moonbase", id: "ui" }
    ],
    entrypoint: true
  },

  updates: {
    dependencies: [
      { id: "discord/Dispatcher" },
      { ext: "moonbase", id: "stores" }
    ],
    entrypoint: true
  },

  updatesNotice: {
    dependencies: [
      { id: "react" },
      { id: "discord/Dispatcher" },
      { id: "discord/components/common/index" },
      { id: "discord/packages/flux" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "moonbase", id: "stores" }
    ]
  }
};

export const patches: Patch[] = [
  {
    find: ".GUILD_RAID_NOTIFICATION:",
    replace: {
      match:
        /(?<=return(\(0,.\.jsx\))\(.+?\);)case .{1,2}\..{1,3}\.GUILD_RAID_NOTIFICATION:/,
      replacement: (orig, createElement) =>
        `case "__moonlight_updates":return${createElement}(require("moonbase_updatesNotice").default,{});${orig}`
    }
  },
  {
    find: '"NoticeStore"',
    replace: [
      {
        match: /\[.{1,2}\..{1,3}\.CONNECT_SPOTIFY\]:{/,
        replacement: (orig: string) =>
          `__moonlight_updates:{predicate:()=>require("moonbase_stores").MoonbaseSettingsStore.shouldShowUpdateNotice()},${orig}`
      },
      {
        match: /=\[(.{1,2}\..{1,3}\.QUARANTINED,)/g,
        replacement: (_, orig) => `=["__moonlight_updates",${orig}`
      }
    ]
  }
];

export const styles = [
  ".moonbase-settings > :first-child { margin-top: 0px; }",
  "textarea.moonbase-resizeable  { resize: vertical }",
  ".moonbase-updates-notice { background-color: #222034; color: #FFFBA6; }"
];
