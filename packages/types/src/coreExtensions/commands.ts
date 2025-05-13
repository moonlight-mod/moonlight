export const APPLICATION_ID = "-3";

export enum CommandType {
  CHAT = 1,
  MESSAGE = 3,
  PRIMARY_ENTRY_POINT = 4,
  USER = 2
}

export enum InputType {
  BOT = 3,
  BUILT_IN = 0,
  BUILT_IN_INTEGRATION = 2,
  BUILT_IN_TEXT = 1,
  PLACEHOLDER = 4
}

export enum OptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
  ATTACHMENT = 11
}

export enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_ANNOUNCEMENT = 5,
  GUILD_STORE = 6,
  ANNOUNCEMENT_THREAD = 10,
  PUBLIC_THREAD = 11,
  PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
  GUILD_DIRECTORY = 14,
  GUILD_FORUM = 15,
  GUILD_MEDIA = 16,
  LOBBY = 17,
  DM_SDK = 18
}

export type RegisteredCommandOption = MoonlightCommandOption & {
  displayName: string;
  displayDescription: string;
};

export type CommandOptionChoice<T> = {
  name: string;
  value: T;
};

type MoonlightCommandOptionBase<T> = {
  type: T;
  name: string;
  description: string;
  required?: T extends OptionType.SUB_COMMAND
    ? never
    : T extends OptionType.SUB_COMMAND_GROUP
      ? never
      : boolean | undefined;
  choices?: T extends OptionType.STRING
    ? CommandOptionChoice<string>[]
    : T extends OptionType.INTEGER
      ? CommandOptionChoice<number>[]
      : T extends OptionType.NUMBER
        ? CommandOptionChoice<number>[]
        : never;
  options?: T extends OptionType.SUB_COMMAND
    ? MoonlightCommandOption[]
    : T extends OptionType.SUB_COMMAND_GROUP
      ? MoonlightCommandOption[]
      : never;
  channelTypes?: T extends OptionType.CHANNEL ? ChannelType[] : never;
  minValue?: T extends OptionType.INTEGER ? number : T extends OptionType.NUMBER ? number : never;
  maxValue?: T extends OptionType.INTEGER ? number : T extends OptionType.NUMBER ? number : never;
  minLength?: T extends OptionType.STRING ? number : never;
  maxLength?: T extends OptionType.STRING ? number : never;
};

// This is bad lol
export type MoonlightCommandOption =
  | MoonlightCommandOptionBase<OptionType.SUB_COMMAND>
  | MoonlightCommandOptionBase<OptionType.SUB_COMMAND_GROUP>
  | MoonlightCommandOptionBase<OptionType.STRING>
  | MoonlightCommandOptionBase<OptionType.INTEGER>
  | MoonlightCommandOptionBase<OptionType.BOOLEAN>
  | MoonlightCommandOptionBase<OptionType.USER>
  | MoonlightCommandOptionBase<OptionType.CHANNEL>
  | MoonlightCommandOptionBase<OptionType.ROLE>
  | MoonlightCommandOptionBase<OptionType.MENTIONABLE>
  | MoonlightCommandOptionBase<OptionType.NUMBER>
  | MoonlightCommandOptionBase<OptionType.ATTACHMENT>;

// TODO: types
export type CommandPredicateState = {
  channel: any;
  guild: any;
};

export type RegisteredCommand = {
  id: string;
  untranslatedName: string;
  displayName: string;
  type: CommandType;
  inputType: InputType;
  applicationId: string; // set to -3!
  untranslatedDescription: string;
  displayDescription: string;
  options?: RegisteredCommandOption[];
  predicate?: (state: CommandPredicateState) => boolean;
  execute: (options: CommandOption[]) => void;
};

export type MoonlightCommand = {
  id: string;
  description: string;

  /**
   * You likely want CHAT
   */
  type: CommandType;

  /**
   * You likely want BUILT_IN (or BUILT_IN_TEXT if you want to send a message)
   */
  inputType: InputType;
  options?: MoonlightCommandOption[];
  predicate?: (state: CommandPredicateState) => boolean;
  execute: (options: CommandOption[]) => any;
};

type CommandOptionBase<T, V> = {
  name: string;
  type: T;
  value: V;
};

// TODO
export type SubCommandCommandOption = CommandOptionBase<OptionType.SUB_COMMAND, CommandOption[]>;
export type SubCommandGroupCommandOption = CommandOptionBase<OptionType.SUB_COMMAND_GROUP, CommandOption[]>;
export type StringCommandOption = CommandOptionBase<OptionType.STRING, string>;
export type IntegerCommandOption = CommandOptionBase<OptionType.INTEGER, number>;
export type BooleanCommandOption = CommandOptionBase<OptionType.BOOLEAN, boolean>;
export type NumberCommandOption = CommandOptionBase<OptionType.NUMBER, number>;

type TypedCommandOptions =
  | SubCommandCommandOption
  | SubCommandGroupCommandOption
  | StringCommandOption
  | IntegerCommandOption
  | BooleanCommandOption
  | NumberCommandOption;
type UntypedCommandOption = CommandOptionBase<Exclude<OptionType, TypedCommandOptions["type"]>, any>;
export type CommandOption = TypedCommandOptions | UntypedCommandOption;

export type AnyScopeRegex = RegExp["exec"] & {
  regex: RegExp;
};

export type Commands = {
  /**
   * Register a command in the internal slash command system
   */
  registerCommand: (command: MoonlightCommand) => void;

  /**
   * Register a legacy command that works via regex
   */
  registerLegacyCommand: (id: string, command: LegacyCommand) => void;

  /**
   * Creates a regular expression that legacy commands can understand
   */
  anyScopeRegex: (regex: RegExp) => AnyScopeRegex;

  /**
   * @private
   */
  _getCommands: () => RegisteredCommand[];
};

export type LegacyContext = {
  channel: any;
  isEdit: boolean;
};

export type LegacyReturn = {
  content: string;
};

export type LegacyCommand = {
  match?: RegExp | { regex: RegExp } | AnyScopeRegex;
  action: (content: string, context: LegacyContext) => LegacyReturn;
};

export type Exports = {
  default: Commands;

  /**
   * @deprecated Use the default export
   */
  commands: Commands;
};
