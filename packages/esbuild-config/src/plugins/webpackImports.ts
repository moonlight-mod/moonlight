import type { Plugin } from "esbuild";

const webpackImports: Plugin = {
  name: "webpack-imports",
  setup: (build) =>
    build.onResolve({ filter: /^@moonlight-mod\/wp\// }, (args) => ({
      path: args.path.replace(/^@moonlight-mod\/wp\//, ""),
      external: true
    }))
};

export default webpackImports;
