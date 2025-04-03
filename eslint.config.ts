import { defineConfig } from "@flowr/eslint";

export default defineConfig({
  opinionated: false,
  stylistic: {
    quotes: "double",
    indent: 2,
    jsx: true,
    semi: true,
    overrides: {
      "style/comma-dangle": ["error", "never"],
      "petal/if-newline": "off",
      "petal/top-level-function": "off",
      "curly": "off"
    }
  },
  typescript: {
    overrides: {
      "ts/no-explicit-any": "off",
      "ts/no-require-imports": "off",
      "ts/no-use-before-define": "off",
      "ts/class-methods-use-this": "off"
    }
  },
  unicorn: {
    overrides: {
      "unicorn/error-message": "off" // new error used for stacktraces
    }
  },
  javascript: {
    overrides: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["types/*"],
            message: "Use @moonlight-mod/types instead"
          },
          {
            group: ["core/*"],
            message: "Use @moonlight-mod/core instead"
          }
        ]
      }],
      "eqeqeq": ["error", "always", { null: "ignore" }],
      "no-unused-labels": "off",
      "no-useless-escape": "off",
      "no-restricted-globals": "off",
      "array-callback-return": "off",
      "no-labels": "off",
      "no-new-func": "off"
    }
  },
  regexp: false // TODO:
}).append({
  name: "userspace",
  rules: {
    "node/prefer-global/buffer": "off",
    "node/prefer-global/console": "off",
    "node/prefer-global/process": "off",
    "node/prefer-global/text-decoder": "off",
    "node/prefer-global/text-encoder": "off",
    "node/prefer-global/url-search-params": "off",
    "node/prefer-global/url": "off"
  },
  languageOptions: {
    globals: {
      chrome: "readonly"
    }
  }
});
