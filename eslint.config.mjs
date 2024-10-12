import config from "@moonlight-mod/eslint-config";

export default [
  ...config,
  {
    rules: {
      // baseUrl being set to ./packages/ makes language server suggest "types/src" instead of "@moonlight-mod/types"
      "no-restricted-imports": [
        "error",
        {
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
        }
      ]
    }
  }
];
