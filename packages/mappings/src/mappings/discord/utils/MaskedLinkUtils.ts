import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

type Exports = {
  isLinkTrusted: (link: string, unk?: string) => boolean;
  handleClick: (options: { href: string }) => void;
};
export default Exports;

register((moonmap) => {
  const name = "discord/utils/MaskedLinkUtils";
  moonmap.register({
    name,
    find: ".trackAnnouncementMessageLinkClicked({messageId:",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "handleClick", {
        type: ModuleExportType.Function,
        find: ".trackAnnouncementMessageLinkClicked({messageId:"
      });
      moonmap.addExport(name, "isLinkTrusted", {
        type: ModuleExportType.Function,
        find: ".isFriend("
      });

      return true;
    }
  });
});
