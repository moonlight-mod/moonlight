import type { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "/^(¯\\\\_\\(ツ\\)_\\/¯)/.exec",
    replace: [
      {
        match: /,(\i)=({RULES:.+?})/,
        replacement: (_, rulesetsVar, rulesets) =>
          `,${rulesetsVar}=require("markdown_markdown")._setupRulesets(${rulesets});`
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
        match: /(originalMatch:\i}=(\i);)(.+?)case"emoticon":(return .+?;)(.+?)case"subtext":{(.+?)}default:/,
        replacement: (_, start, rule, body, plaintextReturn, otherRules, inlineStyleBody) =>
          `${start}if(${rule}.type.startsWith("__moonlight_")){if(__slateRules[${rule}.type].type=="inlineStyle"){${inlineStyleBody}}else{${plaintextReturn}}}${body}case"emoticon":${plaintextReturn}${otherRules}case"subtext":{${inlineStyleBody}}default:`
      }
    ]
  },
  {
    find: "Slate: Unknown decoration attribute: ",
    replace: {
      match: /=({strong:.+?});/,
      replacement: (_, rules) => `=require("markdown_markdown")._addSlateDecorators(${rules});`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  markdown: {}
};
