import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../../../registry";

enum ModalSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  DYNAMIC = "dynamic"
}

// FIXME: proper types
type Exports = {
  ModalRoot: React.ComponentType<any>;
  ModalHeader: React.ComponentType<any>;
  ModalCloseButton: React.ComponentType<any>;
  ModalContent: React.ComponentType<any>;
  ModalFooter: React.ComponentType<any>;
  ModalSize: ModalSize;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/Modal/web/Modal";
  moonmap.register({
    name,
    find: ".withCircleBackground",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "ModalRoot", {
        type: ModuleExportType.Function,
        find: ",fullscreenOnMobile:"
      });
      moonmap.addExport(name, "ModalHeader", {
        type: ModuleExportType.Function,
        find: "let{headerId:"
      });
      moonmap.addExport(name, "ModalCloseButton", {
        type: ModuleExportType.Function,
        find: ".withCircleBackground"
      });
      moonmap.addExport(name, "ModalContent", {
        type: ModuleExportType.Function,
        find: ",scrollbarType:"
      });
      moonmap.addExport(name, "ModalFooter", {
        type: ModuleExportType.Function,
        find: ".separator??!0"
      });
      moonmap.addExport(name, "ModalSize", {
        type: ModuleExportType.Key,
        find: "DYNAMIC"
      });

      // FIXME: ModalScroller(?), some other type thing (default/subtle) that isnt even used by anything lol

      return true;
    }
  });
});
