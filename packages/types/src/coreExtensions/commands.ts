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
  ATTACHMENT = 11,
  BOOLEAN = 5,
  CHANNEL = 7,
  INTEGER = 4,
  MENTIONABLE = 9,
  NUMBER = 10,
  ROLE = 8,
  STRING = 3,
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  USER = 6
}

export type RegisteredCommandOption = {
  name: string;
  displayName: string;
  type: OptionType;
  description: string;
  displayDescription: string;
};

export type MoonlightCommandOption = {
  name: string;
  type: OptionType;
  description: string;
};

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
  options: RegisteredCommandOption[];
  predicate?: (state: CommandPredicateState) => boolean;
  execute: (options: CommandOption[]) => void;
};

export type MoonlightCommand = {
  id: string;
  description: string;
  type: CommandType;
  inputType: InputType;
  options: MoonlightCommandOption[];
  predicate?: (state: CommandPredicateState) => boolean;
  execute: (options: CommandOption[]) => void;
};

export type CommandOption = {
  name: string;
} & ( // TODO: more of these
  | {
      type: Exclude<OptionType, OptionType.STRING>;
      value: any;
    }
  | {
      type: OptionType.STRING;
      value: string;
    }
);

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
  match?: RegExp;
  action: (content: string, context: LegacyContext) => LegacyReturn;
};
