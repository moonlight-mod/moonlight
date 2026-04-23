import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../../../registry";
import type { ModalTransitionState } from "../../../../components/common";

type MediaIdentifier = {
  attachmentId: string; // Snowflake
  type: "attachment"; // FIXME: figure out the other types
};

type MediaMetadata = {
  identifier?: MediaIdentifier;
  message?: any; // Message
};

type MediaItem = {
  type: "VIDEO" | "IMAGE";
  url: string;
  proxyUrl: string;
  original: string;
  width: number;
  height: number;
  contentType: string;
  originalContentType: string;
  sourceMetadata?: MediaMetadata;
};

type MediaModalProps = {
  location?: string;
  contextKey?: string;
  onClose?: () => void;
  items: MediaItem[];
  onIndexChange?: (index: number) => void;
  startingIndex?: number;
  enabledContentHarmTypeFlags?: any;
  shouldHideMediaOptions?: boolean;
  transitionState?: ModalTransitionState;
};

type Exports = {
  openMediaModal: (props: MediaModalProps, stackingBehavior?: any) => void;
  MEDIA_MODAL_KEY: "Media Viewer Modal";
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/media_viewer/web/components/openMediaModal";
  moonmap.register({
    name,
    find: '="Media Viewer Modal"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "openMediaModal", {
        type: ModuleExportType.Function,
        find: ".openModalLazy)"
      });

      moonmap.addExport(name, "MEDIA_MODAL_KEY", {
        type: ModuleExportType.Value,
        find: "Media Viewer Modal"
      });

      return true;
    }
  });
});
