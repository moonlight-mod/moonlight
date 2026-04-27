import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";
import type { UserRecord } from "../records/UserRecord";
import type { HTTPUtilsResponse } from "../utils/HTTPUtils";

type Exports = {
  acceptAgreements: (terms?: boolean, privacy?: boolean) => Promise<HTTPUtilsResponse>;
  fetchCurrentUser: () => UserRecord;
  fetchProfile: (
    userId: string,
    options?: {
      type?: "popout" | "modal";
    },
    callback?: (user: any, guildId: string) => void
  ) => Promise<void>;
  getUser: (userId: string) => Promise<UserRecord>;
  setFlag: (flag: number, append: boolean) => Promise<HTTPUtilsResponse>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/actions/UserActionCreators";
  moonmap.register({
    name,
    find: '"setFlag: user cannot be undefined"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "fetchCurrentUser", {
        type: ModuleExportType.Function,
        find: 'type:"CURRENT_USER_UPDATE"'
      });
      moonmap.addExport(name, "acceptAgreements", {
        type: ModuleExportType.Function,
        find: ".USER_ACCEPT_AGREEMENTS"
      });
      moonmap.addExport(name, "setFlag", {
        type: ModuleExportType.Function,
        find: '"setFlag: user cannot be undefined"'
      });
      moonmap.addExport(name, "getUser", {
        type: ModuleExportType.Function,
        find: ".USER("
      });
      moonmap.addExport(name, "fetchProfile", {
        type: ModuleExportType.Function,
        find: "fetchProfile error: "
      });

      // TODO: two new exports

      return true;
    }
  });
});
