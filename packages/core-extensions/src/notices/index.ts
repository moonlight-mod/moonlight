import type { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: ".GUILD_RAID_NOTIFICATION:",
    replace: {
      match: /(?<=return(\(0,.\.jsx\))\(.+?\);)case .{1,2}\..{1,3}\.GUILD_RAID_NOTIFICATION:/,
      replacement: (orig, createElement) =>
        `case "__moonlight_notice":return${createElement}(require("notices_component").default,{});${orig}`
    }
  },
  {
    find: "\"NoticeStore\"",
    replace: [
      {
        match: /\[.{1,2}\..{1,3}\.CONNECT_SPOTIFY\]:{/,
        replacement: (orig: string) =>
          `__moonlight_notice:{predicate:()=>require("notices_notices").default.shouldShowNotice()},${orig}`
      },
      {
        match: /=\[(.{1,2}\..{1,3}\.QUARANTINED,)/g,
        replacement: (_, orig) => `=["__moonlight_notice",${orig}`
      }
    ]
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  notices: {
    dependencies: [{ id: "discord/packages/flux" }, { id: "discord/Dispatcher" }]
  },

  component: {
    dependencies: [
      { id: "react" },
      { id: "discord/Dispatcher" },
      { id: "discord/components/common/index" },
      { id: "discord/packages/flux" },
      { ext: "notices", id: "notices" }
    ]
  }
};
