import type { Processor } from "./remap";
import { traverse, is, Scope, Binding } from "estree-toolkit";
// FIXME something's fishy with these types
import type {
  Expression,
  ExpressionStatement,
  ObjectExpression,
  Program,
  ReturnStatement
} from "estree-toolkit/dist/generated/types";
import { parse } from "meriyah";

export const processors: Processor[] = [];

export function register(processor: Processor) {
  processors.push(processor);
}

export function getProcessors() {
  // Clone the array to prevent mutation
  return [...processors];
}

export type ExpressionWithScope = {
  argument: Expression;
  scope: Scope;
};

export function getExports(ast: Program) {
  const ret: Record<string, ExpressionWithScope> = {};

  traverse(ast, {
    $: { scope: true },
    BlockStatement(path) {
      if (path.scope == null) return;

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
          return;
        }
      }

      if (!is.functionExpression(path.parent)) return;

      for (let i = 0; i < path.parent.params.length; i++) {
        const param = path.parent.params[i];
        if (!is.identifier(param)) continue;
        const binding: Binding | undefined = path.scope!.getBinding(param.name);
        if (!binding) continue;

        // module
        if (i === 0) {
          for (const reference of binding.references) {
            if (!is.identifier(reference.node)) continue;
            if (!is.assignmentExpression(reference.parentPath?.parentPath))
              continue;

            const exportsNode = reference.parentPath?.parentPath.node;
            if (!is.memberExpression(exportsNode?.left)) continue;
            if (!is.identifier(exportsNode.left.property)) continue;
            if (exportsNode.left.property.name !== "exports") continue;

            const exports = exportsNode?.right;
            if (!is.objectExpression(exports)) continue;

            for (const property of exports.properties) {
              if (!is.property(property)) continue;
              if (!is.identifier(property.key)) continue;
              if (!is.expression(property.value)) continue;
              ret[property.key.name] = {
                argument: property.value,
                scope: path.scope
              };
            }
          }
        }
        // TODO: exports
        else if (i === 1) {
          for (const reference of binding.references) {
            if (!is.identifier(reference.node)) continue;
            if (reference.parentPath == null) continue;
            if (!is.memberExpression(reference.parentPath.node)) continue;
            if (!is.identifier(reference.parentPath.node.property)) continue;

            const assignmentExpression = reference.parentPath.parentPath?.node;
            if (!is.assignmentExpression(assignmentExpression)) continue;

            ret[reference.parentPath.node.property.name] = {
              argument: assignmentExpression.right,
              scope: path.scope
            };
          }
        }
      }
    }
  });

  return ret;
}

// TODO: util function to resolve the value of an expression
export function getPropertyGetters(ast: Program) {
  const ret: Record<string, ExpressionWithScope> = {};

  traverse(ast, {
    $: { scope: true },
    CallExpression(path) {
      if (path.scope == null) return;
      if (!is.callExpression(path.node)) return;
      if (!is.memberExpression(path.node.callee)) return;
      if (!is.identifier(path.node?.callee?.property)) return;
      if (path.node.callee.property.name !== "d") return;

      const arg = path.node.arguments.find((node): node is ObjectExpression =>
        is.objectExpression(node)
      );
      if (!arg) return;

      for (const property of arg.properties) {
        if (!is.property(property)) continue;
        if (!is.identifier(property.key)) continue;
        if (!is.functionExpression(property.value)) continue;
        if (!is.blockStatement(property.value.body)) continue;

        const returnStatement = property.value.body.body.find(
          (node): node is ReturnStatement => is.returnStatement(node)
        );
        if (!returnStatement || !returnStatement.argument) continue;
        ret[property.key.name] = {
          argument: returnStatement.argument,
          scope: path.scope
        };
      }

      this.stop();
    }
  });

  return ret;
}

// The ESTree types are mismatched with estree-toolkit, but ESTree is a standard so this is fine
export function parseFixed(code: string): Program {
  return parse(code) as any as Program;
}

export function magicAST(code: string) {
  // Wraps code in an IIFE so you can type `return` and all that goodies
  // Might not work for some other syntax issues but oh well
  const tree = parse("(()=>{" + code + "})()");

  const expressionStatement = tree.body[0] as ExpressionStatement;
  if (!is.expressionStatement(expressionStatement)) return null;
  if (!is.callExpression(expressionStatement.expression)) return null;
  if (!is.arrowFunctionExpression(expressionStatement.expression.callee))
    return null;
  if (!is.blockStatement(expressionStatement.expression.callee.body))
    return null;
  return expressionStatement.expression.callee.body;
}
