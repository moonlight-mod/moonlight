import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";

register((moonmap) => {
  const name = "discord/modules/messages/createMessage";
  moonmap.register({
    name,
    find: '"createMessage: author cannot be undefined"',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "userRecordToServer", {
        type: ModuleExportType.Function,
        find: ",global_name:"
      });
      moonmap.addExport(name, "createBotMessage", {
        type: ModuleExportType.Function,
        find: 'username:"Clyde"'
      });

      return true;
    }
  });
});
