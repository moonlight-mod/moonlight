import { defineConfig } from '@flowr/eslint';

export default defineConfig({
    opinionated: false,
    stylistic: {
        quotes: 'double',
        indent: 2,
        jsx: true,
        semi: true,
        overrides: {
            'style/comma-dangle': ['error', 'never'],
            'petal/if-newline': 'off',
            'petal/top-level-function': 'off',
            curly: 'off',
        }
    },
    typescript: {
        overrides: {
            'ts/no-explicit-any': 'off',
            'ts/no-require-imports': 'off',
        }
    },
    javascript: {
        overrides: {
            'no-restricted-imports': ['error', {
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
            eqeqeq: ['error', 'always', { null: 'ignore' }],
            'no-unused-labels': 'off',
            'no-useless-escape': 'off'
        },
    },
    regexp: false // TODO:
})
