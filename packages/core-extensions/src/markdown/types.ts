// {{{ simple-markdown

type SingleASTNode = {
  type: string;
  [key: string]: any;
};

type UnTypedASTNode = {
  [key: string]: any;
};

type ASTNode = SingleASTNode | Array<SingleASTNode>;

type Parser = (
  source: string,
  state?: State | null | undefined
) => Array<SingleASTNode>;

type ParseFunction = (
  capture: Capture,
  nestedParse: Parser,
  state: State
) => UnTypedASTNode | ASTNode;

type Capture =
  | (Array<string> & {
      index: number;
    })
  | (Array<string> & {
      index?: number;
    });

type State = {
  key?: string | number | undefined;
  inline?: boolean | null | undefined;
  [key: string]: any;
};

type MatchFunction = {
  regex?: RegExp;
} & ((
  source: string,
  state: State,
  prevCapture: string
) => Capture | null | undefined);

type Output<Result> = (
  node: ASTNode,
  state?: State | null | undefined
) => Result;

type ArrayNodeOutput<Result> = (
  node: Array<SingleASTNode>,
  nestedOutput: Output<Result>,
  state: State
) => Result;

// }}}

export type ValidFlags = "g" | "i" | "m" | "s" | "u" | "y" | undefined;

export type MarkdownRule = {
  order: number;
  match: MatchFunction;
  parse: ParseFunction;
  react: ArrayNodeOutput<React.ReactNode>;
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
  | "CHANNEL_TOPIC_RULES"
  | "VOICE_CHANNEL_STATUS_RULES"
  | "EMBED_TITLE_RULES"
  | "INLINE_REPLY_RULES"
  | "GUILD_VERIFICATION_FORM_RULES"
  | "GUILD_EVENT_RULES"
  | "PROFILE_BIO_RULES"
  | "AUTO_MODERATION_SYSTEM_MESSAGE_RULES"
  | "NATIVE_SEARCH_RESULT_LINK_RULES";
