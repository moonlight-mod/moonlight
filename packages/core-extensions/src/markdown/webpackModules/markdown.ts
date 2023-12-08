import { MarkdownRule, Ruleset, SlateRule } from "../types";

export const rules: Record<string, MarkdownRule> = {};
export const slateRules: Record<string, SlateRule> = {};
export const slateDecorators: Record<string, string> = {};
export const ruleBlacklists: Record<Ruleset, Record<string, boolean>> = {
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
