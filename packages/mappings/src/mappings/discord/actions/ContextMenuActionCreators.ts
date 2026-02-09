import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

export type ContextMenuProps = {
  enableSpellCheck: boolean;
};

type Exports = {
  closeContextMenu: () => void;
  openContextMenu: (
    event: React.SyntheticEvent,
    render: () => React.ReactNode,
    props?: ContextMenuProps,
    renderLazy?: () => React.ReactNode
  ) => void;
  openContextMenuLazy: (
    event: React.SyntheticEvent,
    renderLazy: () => React.ReactNode,
    props?: ContextMenuProps
  ) => void;
};
export default Exports;

register((moonmap) => {
  const name = "discord/actions/ContextMenuActionCreators";
  moonmap.register({
    name,
    find: '.dispatch({type:"CONTEXT_MENU_OPEN"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "closeContextMenu", {
        type: ModuleExportType.Function,
        find: '"CONTEXT_MENU_CLOSE"'
      });
      moonmap.addExport(name, "openContextMenu", {
        type: ModuleExportType.Function,
        find: ".stopPropagation()"
      });
      moonmap.addExport(name, "openContextMenuLazy", {
        type: ModuleExportType.Function,
        find: /.\(.,void 0,.,.\)/
      });

      return true;
    }
  });
});
