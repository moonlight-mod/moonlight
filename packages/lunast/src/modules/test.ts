import { traverse, is } from "estree-toolkit";
import { getPropertyGetters, register, magicAST, getImports } from "../utils";
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
      if (!is.identifier(data.expression)) continue;

      const node = data.scope.getOwnBinding(data.expression.name);
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
      if (!is.identifier(data.expression)) continue;
      const node = data.scope.getOwnBinding(data.expression.name);
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

// Parse all modules to demonstrate speed loss
/*register({
  name: "AllModules",
  process({ id, ast, lunast }) {
    return false;
  }
});*/

// Triggering a processor from another processor
register({
  name: "FluxDispatcherParent",
  find: ["isDispatching", "dispatch", "googlebot"],
  process({ id, ast, lunast, trigger }) {
    const imports = getImports(ast);
    // This is so stupid lol
    const usages = Object.entries(imports)
      .map(([name, data]): [string, number] => {
        if (!is.identifier(data.expression)) return [name, 0];
        const binding = data.scope.getOwnBinding(data.expression.name);
        if (!binding) return [name, 0];
        return [name, binding.references.length];
      })
      .sort(([, a], [, b]) => b! - a!)
      .map(([name]) => name);

    const dispatcher = usages[1].toString();
    trigger(dispatcher, "FluxDispatcher");
    return true;
  }
});

register({
  name: "FluxDispatcher",
  manual: true,
  process({ id, ast, lunast }) {
    lunast.addModule({
      name: "FluxDispatcher",
      id,
      type: "FluxDispatcher"
    });

    lunast.addType({
      name: "FluxDispatcher",
      fields: [
        {
          name: "default",
          unmapped: "Z"
        }
      ]
    });

    return true;
  }
});
