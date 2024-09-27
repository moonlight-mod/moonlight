import type { Processor } from "./remap";
import { traverse, is } from "estree-toolkit";
// FIXME something's fishy with these types
import type { Program, Property } from "estree-toolkit/dist/generated/types";

export const processors: Processor[] = [];

export function register(processor: Processor) {
  processors.push(processor);
}

export function getProcessors() {
  // Clone the array to prevent mutation
  return [...processors];
}

export function getExports(ast: Program) {
  const ret: Record<string, Property["value"]> = {};

  traverse(ast, {
    $: { scope: true },
    BlockStatement: {
      enter(path) {
        // Walk up to make sure we are indeed the top level
        let parent = path.parentPath;
        while (!is.program(parent)) {
          parent = parent?.parentPath ?? null;
          if (
            parent == null ||
            parent.node == null ||
            ![
              "FunctionExpression",
              "ExpressionStatement",
              "CallExpression",
              "Program"
            ].includes(parent.node.type)
          ) {
            this.stop();
            return;
          }
        }
      },

      leave(path) {
        path.scope?.crawl();
        if (!is.functionExpression(path.parent)) return;

        for (let i = 0; i < path.parent.params.length; i++) {
          const param = path.parent.params[i];
          if (!is.identifier(param)) continue;
          const binding = path.scope?.getBinding(param.name);
          if (!binding) continue;

          // module
          if (i === 0) {
            for (const reference of binding.references) {
              if (!is.identifier(reference.node)) continue;
              if (!is.assignmentExpression(reference.parentPath?.parentPath))
                continue;

              const exports = reference.parentPath?.parentPath.node?.right;
              if (!is.objectExpression(exports)) continue;

              for (const property of exports.properties) {
                if (!is.property(property)) continue;
                if (!is.identifier(property.key)) continue;
                ret[property.key.name] = property.value;
              }
            }
          }
          // TODO: exports
        }
      }
    }
  });

  return ret;
}
