import {
  APPLICATION_ID,
  Commands,
  LegacyCommand,
  RegisteredCommand
} from "@moonlight-mod/types/coreExtensions/commands";

type LegacyCommands = Record<string, LegacyCommand>;
let legacyCommands: LegacyCommands | undefined;
let queuedLegacyCommands: Record<string, LegacyCommand> | null = {};

const registeredCommands: RegisteredCommand[] = [];

export function _getLegacyCommands(commands: LegacyCommands) {
  legacyCommands = commands;
  if (queuedLegacyCommands != null) {
    for (const [key, value] of Object.entries(queuedLegacyCommands)) {
      legacyCommands[key] = value;
    }
    queuedLegacyCommands = null;
  }
}

export const commands: Commands = {
  registerCommand(command) {
    const registered: RegisteredCommand = {
      ...command,
      untranslatedName: command.id,
      displayName: command.id,
      applicationId: APPLICATION_ID,
      untranslatedDescription: command.description,
      displayDescription: command.description,
      options: command.options.map((o) => ({
        ...o,
        displayName: o.name,
        displayDescription: o.description
      }))
    };
    registeredCommands.push(registered);
  },

  registerLegacyCommand(id, command) {
    if (command.match) {
      if (command.match instanceof RegExp) {
        command.match = this.anyScopeRegex(command.match);
      } else if (command.match.regex && typeof command.match !== "function") {
        command.match = this.anyScopeRegex(command.match.regex);
      }
    }

    if (!legacyCommands) {
      queuedLegacyCommands![id] = command;
    } else {
      legacyCommands[id] = command;
    }
  },

  anyScopeRegex(regex) {
    const out = function (str: string) {
      return regex.exec(str);
    };
    out.regex = regex;
    return out;
  },

  _getCommands() {
    return [...registeredCommands];
  }
};

export default commands;
