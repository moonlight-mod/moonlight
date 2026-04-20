declare module "@moonlight-mod/wp/cloudSync_proto" {
  export * from "src/cloudSync/webpackModules/proto";
}

declare module "@moonlight-mod/wp/cloudSync_sync" {
  import { CloudSyncStore } from "src/cloudSync/webpackModules/sync";

  const _default: CloudSyncStore;
  export default _default;
  export * from "src/cloudSync/webpackModules/sync";
}
