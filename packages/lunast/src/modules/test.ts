import { getExports, register } from "../utils";

// These aren't actual modules yet, I'm just using this as a testbed for stuff
register({
  name: "Margin",
  find: "marginCenterHorz:",
  process({ ast }) {
    const exports = getExports(ast);
    // eslint-disable-next-line no-console
    console.log(exports);
    return Object.keys(exports).length > 0;
  }
});
