import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../registry";

register((moonmap) => {
  const name = "discord/actions/LayerActionCreators";
  moonmap.register({
    name,
    find: '.dispatch({type:"LAYER_POP_ALL"})',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "pushLayer", {
        type: ModuleExportType.Function,
        find: 'type:"LAYER_PUSH"'
      });
      moonmap.addExport(name, "popLayer", {
        type: ModuleExportType.Function,
        find: 'type:"LAYER_POP"'
      });
      moonmap.addExport(name, "popAllLayers", {
        type: ModuleExportType.Function,
        find: 'type:"LAYER_POP_ALL"'
      });

      return true;
    }
  });
});
