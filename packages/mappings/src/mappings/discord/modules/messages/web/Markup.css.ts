import register from "../../../../../registry";
import { mapCssExport } from "../../../../../utils";

type Exports = {
  markup: string;
  inlineFormat: string;
  codeContainer: string;
  codeActions: string;
  blockquoteContainer: string;
  blockquoteDivider: string;
  slateBlockquoteContainer: string;
  roleMention: string;
  rolePopout: string;
  roleHeader: string;
  roleScroller: string;
  timestamp: string;
};
export default Exports;

register((moonmap) => {
  const name = "discord/modules/messages/web/Markup.css";
  moonmap.register({
    name,
    find: ['"markup_', '"inlineFormat_'],
    process({ id }) {
      moonmap.addModule(id, name);

      mapCssExport(moonmap, name, "markup");
      mapCssExport(moonmap, name, "inlineFormat");
      mapCssExport(moonmap, name, "codeContainer");
      mapCssExport(moonmap, name, "codeActions");
      mapCssExport(moonmap, name, "blockquoteContainer");
      mapCssExport(moonmap, name, "blockquoteDivider");
      mapCssExport(moonmap, name, "slateBlockquoteContainer");
      mapCssExport(moonmap, name, "roleMention");
      mapCssExport(moonmap, name, "rolePopout");
      mapCssExport(moonmap, name, "roleHeader");
      mapCssExport(moonmap, name, "roleScroller");
      mapCssExport(moonmap, name, "timestamp");

      return true;
    }
  });
});
