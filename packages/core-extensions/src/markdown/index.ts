import type { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "/^(¯\\\\_\\(ツ\\)_\\/¯)/.exec",
    replace: [
      {
        match: /={newline:(.+?)},(.{1,2})=\(0,/,
        replacement: (_, rules, RULES) => `=require("markdown_markdown")._addRules({newline:${rules}}),${RULES}=(0,`
      },
      {
        match: /(?<=;(.{1,2}\.Z)={RULES:.+?})/,
        replacement: (_, rulesets) => `;require("markdown_markdown")._applyRulesetBlacklist(${rulesets});`
      }
    ]
  },
  {
    find: "then you probably need to add it to this file so that the rich chat box understands it.",
    replace: [
      {
        match: /(.)={link:{(.+?)},(.)=new Set/,
        replacement: (_, rulesDef, rules, syntaxBefore) =>
          `__slateRules,${rulesDef}=__slateRules=require("markdown_markdown")._addSlateRules({link:{${rules}}),${syntaxBefore}=new Set`
      },
      {
        match: /(originalMatch:.}=(.);)(.+?)case"emoticon":(return .+?;)(.+?)case"subtext":{(.+?)}default:/,
        replacement: (_, start, rule, body, plaintextReturn, otherRules, inlineStyleBody) =>
          `${start}if(${rule}.type.startsWith("__moonlight_")){if(__slateRules[${rule}.type].type=="inlineStyle"){${inlineStyleBody}}else{${plaintextReturn}}}${body}case"emoticon":${plaintextReturn}${otherRules}case"subtext":{${inlineStyleBody}}default:`
      }
    ]
  },
  {
    find: "\"Slate: Unknown decoration attribute: \"",
    replace: {
      match: /=({strong:.+?});/,
      replacement: (_, rules) => `=require("markdown_markdown")._addSlateDecorators(${rules});`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  markdown: {}
};
