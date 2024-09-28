import { traverse, is } from "estree-toolkit";
import { getExports, getPropertyGetters, register, magicAST } from "../utils";
import { BlockStatement } from "estree-toolkit/dist/generated/types";

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

// Exports example
/*register({
  name: "ApplicationStoreDirectoryStore",
  find: '"displayName","ApplicationStoreDirectoryStore"',
  process({ ast }) {
    const exports = getExports(ast);
    return Object.keys(exports).length > 0;
  }
});*/

// Patching example
register({
  name: "ImagePreview",
  find: ".Messages.OPEN_IN_BROWSER",
  process({ id, ast, lunast, markDirty }) {
    const getters = getPropertyGetters(ast);
    const replacement = magicAST(`return require("common_react").createElement(
  "div",
  {
    style: {
      color: "white",
    },
  },
  "balls"
)`)!;
    for (const node of Object.values(getters)) {
      const body = node.path.get<BlockStatement>("body");
      body.replaceWith(replacement);
    }
    markDirty();

    return true;
  }
});

register({
  name: "ClipboardUtils",
  find: 'document.queryCommandEnabled("copy")',
  process({ id, ast, lunast }) {
    const getters = getPropertyGetters(ast);
    const fields = [];

    for (const [name, node] of Object.entries(getters)) {
      let isSupportsCopy = false;
      traverse(node.path.node!, {
        MemberExpression(path) {
          if (
            is.identifier(path.node?.property) &&
            path.node?.property.name === "queryCommandEnabled"
          ) {
            isSupportsCopy = true;
            this.stop();
          }
        }
      });

      if (isSupportsCopy) {
        fields.push({
          name: "SUPPORTS_COPY",
          unmapped: name
        });
      } else {
        fields.push({
          name: "copy",
          unmapped: name
        });
      }
    }

    if (fields.length > 0) {
      lunast.addType({
        name: "ClipboardUtils",
        fields
      });
      lunast.addModule({
        name: "ClipboardUtils",
        id,
        type: "ClipboardUtils"
      });
      return true;
    }

    return false;
  }
});
