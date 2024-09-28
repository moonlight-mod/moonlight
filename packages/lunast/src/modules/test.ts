import { traverse, is } from "estree-toolkit";
import { getPropertyGetters, register, magicAST } from "../utils";
import { BlockStatement } from "estree-toolkit/dist/generated/types";

// These aren't actual modules yet, I'm just using this as a testbed for stuff

// Exports example
/*register({
  name: "ApplicationStoreDirectoryStore",
  find: '"displayName","ApplicationStoreDirectoryStore"',
  process({ ast }) {
    const exports = getExports(ast);
    return Object.keys(exports).length > 0;
  }
});

register({
  name: "FluxDispatcher",
  find: "addBreadcrumb:",
  process({ id, ast, lunast }) {
    const exports = getExports(ast);
    for (const [name, data] of Object.entries(exports)) {
      if (!is.identifier(data.argument)) continue;
      const binding = data.scope.getOwnBinding(data.argument.name);
      console.log(name, binding);
    }
    return false;
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
    for (const data of Object.values(getters)) {
      if (!is.identifier(data.argument)) continue;

      const node = data.scope.getOwnBinding(data.argument.name);
      if (!node) continue;

      const body = node.path.get<BlockStatement>("body");
      body.replaceWith(replacement);
    }
    markDirty();

    return true;
  }
});

// Remapping example
register({
  name: "ClipboardUtils",
  find: 'document.queryCommandEnabled("copy")',
  process({ id, ast, lunast }) {
    const getters = getPropertyGetters(ast);
    const fields = [];

    for (const [name, data] of Object.entries(getters)) {
      if (!is.identifier(data.argument)) continue;
      const node = data.scope.getOwnBinding(data.argument.name);
      if (!node) continue;

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
