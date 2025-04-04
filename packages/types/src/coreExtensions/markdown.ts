// {{{ simple-markdown

export type SingleASTNode = {
  type: string;
  [key: string]: any;
};

export type UntypedASTNode = {
  [key: string]: any;
};

export type ASTNode = SingleASTNode | Array<SingleASTNode>;

export type Parser = (source: string, state?: State | null | undefined) => Array<SingleASTNode>;

export type ParseFunction = (capture: Capture, nestedParse: Parser, state: State) => UntypedASTNode | ASTNode;

export type Capture =
  | (Array<string> & {
      index: number;
    })
  | (Array<string> & {
      index?: number;
    });

export type State = {
  key?: string | number | undefined;
  inline?: boolean | null | undefined;
  [key: string]: any;
};

export type MatchFunction = {
  regex?: RegExp;
} & ((source: string, state: State, prevCapture: string) => Capture | null | undefined);

export type Output<Result> = (node: ASTNode, state?: State | null | undefined) => Result;

export type SingleNodeOutput<Result> = (node: SingleASTNode, nestedOutput: Output<Result>, state: State) => Result;

// }}}

export type ValidFlags = "g" | "i" | "m" | "s" | "u" | "y" | undefined;

export type MarkdownRule = {
  order: number;
  match: MatchFunction;
  parse: ParseFunction;
  react?: SingleNodeOutput<React.ReactNode>;
};

export type SlateRule =
  | {
      type: "skip";
    }
  | {
      type: "verbatim";
    }
  | {
      type: "inlineObject";
    }
  | {
      type: "inlineStyle";
      before: string;
      after: string;
    };

export type Ruleset =
  | "RULES"
  | "CHANNEL_TOPIC_RULES"
  | "VOICE_CHANNEL_STATUS_RULES"
  | "EMBED_TITLE_RULES"
  | "INLINE_REPLY_RULES"
  | "GUILD_VERIFICATION_FORM_RULES"
  | "GUILD_EVENT_RULES"
  | "PROFILE_BIO_RULES"
  | "AUTO_MODERATION_SYSTEM_MESSAGE_RULES"
  | "NATIVE_SEARCH_RESULT_LINK_RULES";

export type Markdown = {
  rules: Record<string, MarkdownRule>;
  slateRules: Record<string, SlateRule>;
  slateDecorators: Record<string, string>;
  ruleBlacklists: Record<Ruleset, Record<string, boolean>>;

  /**
   * Registers a new Markdown rule with simple-markdown.
   * @param name The name of the rule
   * @param markdown A function that returns simple-markdown rules
   * @param slate A function that returns Slate rules
   * @param decorator A decorator name for Slate
   * @see https://www.npmjs.com/package/simple-markdown#adding-a-simple-extension
   * @see https://docs.slatejs.org/
   */
  addRule: (
    name: string,
    markdown: (rules: Record<string, MarkdownRule>) => MarkdownRule,
    slate: (rules: Record<string, SlateRule>) => SlateRule,
    decorator?: string | undefined
  ) => void;

  /**
   * Blacklist a rule from a ruleset.
   * @param ruleset The ruleset name
   * @param name The rule name
   */
  blacklistFromRuleset: (ruleset: Ruleset, name: string) => void;
};
