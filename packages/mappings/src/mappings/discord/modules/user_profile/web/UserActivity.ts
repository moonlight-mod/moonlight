import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../../registry";

register((moonmap) => {
  const name = "discord/modules/user_profile/web/UserActivity";
  moonmap.register({
    name,
    find: ":null,onOpenSpotifyTrack:",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "UserActivityTypes", {
        type: ModuleExportType.Key,
        find: "PROFILE_V2"
      });

      return true;
    }
  });
});
