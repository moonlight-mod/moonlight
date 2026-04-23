import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";
import type { UserRecord } from "../records/UserRecord";

type GenericUserToString = (user: UserRecord) => string;
type GenericUserToBool = (user: UserRecord) => boolean;

type StatusProps = {
  isMobile: boolean;
  isVR: boolean;
};

type HumanizeStatus = (
  status: "online" | "idle" | "dnd" | "streaming" | "invisible" | "offline" | "unknown",
  props?: StatusProps
) => string;

type UseDirectMessageRecipient = (channel: any) => UserRecord; // FIXME: ChannelRecord

type AgeRange = {
  minDaysOld?: number;
  maxDaysOld: number;
};

type Exports = {
  default: {
    getName: GenericUserToString;
    useName: GenericUserToString;
    isNameConcealed: (name: string) => boolean;
    getUserTag: GenericUserToString;
    useUserTag: GenericUserToString;
    getUserIsStaff: GenericUserToBool;
    getFormattedName: GenericUserToString;
    getGlobalName: GenericUserToString;
    humanizeStatus: HumanizeStatus;
    useDirectMessageRecipient: UseDirectMessageRecipient;
  };
  nameFromUser: GenericUserToString;
  getName: GenericUserToString;
  useName: GenericUserToString;
  //getGlobalName: GenericUserToString;
  //getFormattedName: GenericUserToString;
  humanizeStatus: HumanizeStatus;
  accountAgeInRange: (user: UserRecord, range: AgeRange) => boolean;
  ageEligibleForPremiumUpsell: GenericUserToBool;
  isNewUser: GenericUserToBool;
  getUserTag: GenericUserToString;
  //useUserTag: GenericUserToString;
  useDirectMessageRecipient: UseDirectMessageRecipient;
  getUserIsStaff: GenericUserToBool;
};
export default Exports;

register((moonmap) => {
  const name = "discord/utils/UserUtils";
  moonmap.register({
    name,
    find: "humanizeStatus:",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "nameFromUser", {
        type: ModuleExportType.Function,
        find: '.username:"???"'
      });
      moonmap.addExport(name, "getName", {
        type: ModuleExportType.Function,
        find: ".hidePersonalInformation,"
      });
      moonmap.addExport(name, "useName", {
        type: ModuleExportType.Function,
        find: ".hidePersonalInformation);"
      });
      // treeshaken
      /*moonmap.addExport(name, "getGlobalName", {
        type: ModuleExportType.Function,
        find: ".global_name;else return"
      });*/
      // inlined
      /*moonmap.addExport(name, "getFormattedName", {
        type: ModuleExportType.Function,
        find: 'return "???";'
      });*/
      moonmap.addExport(name, "humanizeStatus", {
        type: ModuleExportType.Function,
        find: ":{},{isMobile:"
      });
      moonmap.addExport(name, "accountAgeInRange", {
        type: ModuleExportType.Function,
        find: ".createdAt.getTime();return"
      });
      moonmap.addExport(name, "ageEligibleForPremiumUpsell", {
        type: ModuleExportType.Function,
        find: "maxDaysOld:30"
      });
      moonmap.addExport(name, "isNewUser", {
        type: ModuleExportType.Function,
        find: "maxDaysOld:7"
      });
      moonmap.addExport(name, "getUserTag", {
        type: ModuleExportType.Function,
        find: '="auto"!=='
      });
      // inlined
      /*moonmap.addExport(name, "useUserTag", {
        type: ModuleExportType.Function,
        find: ".hidePersonalInformation))"
      });*/
      moonmap.addExport(name, "useDirectMessageRecipient", {
        type: ModuleExportType.Function,
        find: ".getRecipientId()):null"
      });
      moonmap.addExport(name, "getUserIsStaff", {
        type: ModuleExportType.Function,
        find: ".isStaff()"
      });

      return true;
    }
  });
});
