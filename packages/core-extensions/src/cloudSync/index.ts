import type { ExtensionWebExports } from "@moonlight-mod/types";

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  proto: {},

  sync: {
    dependencies: [
      { id: "discord/packages/flux" },
      { id: "discord/Dispatcher" },
      { id: "discord/utils/HTTPUtils" },
      { id: "react" },
      { ext: "notices", id: "notices" },
      { ext: "spacepack", id: "spacepack" },
      { ext: "cloudSync", id: "proto" }
    ],
    entrypoint: true
  }
};

export const patches: ExtensionWebExports["patches"] = [
  {
    find: "UserSettingsProto must not be a string",
    replace: {
      match: /\["USER_SETTINGS_PROTO_UPDATE"\],(\i)=>\{/,
      replacement: `$&require("cloudSync_sync").default.onUserSettingsProtoUpdate($1);`
    }
  }
];
