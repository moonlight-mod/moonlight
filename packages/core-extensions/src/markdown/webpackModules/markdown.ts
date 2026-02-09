import { MarkdownRule, Ruleset, SlateRule } from "@moonlight-mod/types/coreExtensions/markdown";

export const rules: Record<string, (rules: Record<string, MarkdownRule>) => MarkdownRule> = {};
export const slateRules: Record<string, (rules: Record<string, SlateRule>) => SlateRule> = {};
export const slateDecorators: Record<string, string> = {};
export const ruleBlacklists: Record<Ruleset, Record<string, boolean>> = {
  RULES: {},
  CHANNEL_TOPIC_RULES: {},
  VOICE_CHANNEL_STATUS_RULES: {},
  EMBED_TITLE_RULES: {},
  INLINE_REPLY_RULES: {},
  GUILD_VERIFICATION_FORM_RULES: {},
  GUILD_EVENT_RULES: {},
  PROFILE_BIO_RULES: {},
  AUTO_MODERATION_SYSTEM_MESSAGE_RULES: {},
  NATIVE_SEARCH_RESULT_LINK_RULES: {}
};

export function addRule(
  name: string,
  markdown: (rules: Record<string, MarkdownRule>) => MarkdownRule,
  slate: (rules: Record<string, SlateRule>) => SlateRule,
  decorator?: string
) {
  rules[name] = markdown;
  slateRules[name] = slate;
  if (decorator != null) slateDecorators[name] = decorator;
}

export function blacklistFromRuleset(ruleset: Ruleset, name: string) {
  if (ruleBlacklists[ruleset] == null) ruleBlacklists[ruleset] = {};
  ruleBlacklists[ruleset][name] = true;
}

export function _addRules(originalRules: Record<string, MarkdownRule>) {
  for (const name in rules) {
    originalRules[`__moonlight_${name}`] = rules[name](originalRules);
  }

  return originalRules;
}

export function _addSlateRules(originalRules: Record<string, SlateRule>) {
  for (const name in slateRules) {
    originalRules[`__moonlight_${name}`] = slateRules[name](originalRules);
  }

  return originalRules;
}

export function _addSlateDecorators(originalRules: Record<string, string>) {
  for (const name in slateDecorators) {
    originalRules[`__moonlight_${name}`] = slateDecorators[name];
  }

  return originalRules;
}

export function _applyRulesetBlacklist(rulesets: Record<Ruleset, Record<string, MarkdownRule>>) {
  for (const ruleset of Object.keys(rulesets) as Ruleset[]) {
    if (ruleset === "RULES") continue;

    const rules = rulesets[ruleset];
    for (const rule in ruleBlacklists[ruleset] || {}) {
      delete rules[`__moonlight_${rule}`];
    }
  }
}
