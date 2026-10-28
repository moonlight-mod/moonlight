import register from "../../../../registry";

//import { mapCssExport } from "../../../../utils";

type Exports = {
  container: string;
  contentsContainer: string;
  copyContainer: string;
  critical: string;
  enterExit: string;
  enterExitClip: string;
  enterExitHidden: string;
  icon: string;
  iconAndTextContainer: string;
  iconContainer: string;
  info: string;
  messageList: string;
  success: string;
  vertical: string;
  warning: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/components/common/HelpMessage.css";
  moonmap.register({
    name,
    find: ['"critical_', '"iconAndTextContainer_'],
    process({ id }) {
      moonmap.addModule(id, name);

      // currently an external module, not mangled
      /*mapCssExport(moonmap, name, "container");
      mapCssExport(moonmap, name, "contentsContainer");
      mapCssExport(moonmap, name, "copyContainer");
      mapCssExport(moonmap, name, "critical");
      mapCssExport(moonmap, name, "enterExit");
      mapCssExport(moonmap, name, "enterExitClip");
      mapCssExport(moonmap, name, "enterExitHidden");
      mapCssExport(moonmap, name, "icon");
      mapCssExport(moonmap, name, "iconAndTextContainer");
      mapCssExport(moonmap, name, "iconContainer");
      mapCssExport(moonmap, name, "info");
      mapCssExport(moonmap, name, "messageList");
      mapCssExport(moonmap, name, "success");
      mapCssExport(moonmap, name, "vertical");
      mapCssExport(moonmap, name, "warning");*/

      return true;
    }
  });
});
