import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/spotify/SpotifyActionCreators";
  moonmap.register({
    name,
    find: '"SPOTIFY_SET_PROTOCOL_REGISTERED"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "SpotifyAPI", {
        type: ModuleExportType.Key,
        find: "put"
      });
      moonmap.addExport(name, "getAccessToken", {
        type: ModuleExportType.Function,
        find: ".CONNECTION_ACCESS_TOKEN("
      });
      moonmap.addExport(name, "subscribePlayerStateNotifications", {
        type: ModuleExportType.Function,
        find: ".NOTIFICATIONS_PLAYER,"
      });
      moonmap.addExport(name, "getProfile", {
        type: ModuleExportType.Function,
        find: '"SPOTIFY_PROFILE_UPDATE"'
      });
      moonmap.addExport(name, "getDevices", {
        type: ModuleExportType.Function,
        find: '"SPOTIFY_SET_DEVICES"'
      });
      moonmap.addExport(name, "play", {
        type: ModuleExportType.Function,
        find: '"SPOTIFY_PLAYER_PLAY"'
      });
      moonmap.addExport(name, "pause", {
        type: ModuleExportType.Function,
        find: '"SPOTIFY_PLAYER_PAUSE"'
      });
      moonmap.addExport(name, "fetchIsSpotifyProtocolRegistered", {
        type: ModuleExportType.Function,
        find: '"SPOTIFY_SET_PROTOCOL_REGISTERED"'
      });
      moonmap.addExport(name, "setActiveDevice", {
        type: ModuleExportType.Function,
        find: '"SPOTIFY_SET_ACTIVE_DEVICE"'
      });

      return true;
    }
  });
});
