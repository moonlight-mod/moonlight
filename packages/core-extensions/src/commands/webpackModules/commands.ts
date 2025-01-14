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
    if (!legacyCommands) {
      queuedLegacyCommands![id] = command;
    } else {
      legacyCommands[id] = command;
    }
  },

  _getCommands() {
    return [...registeredCommands];
  }
};

export default commands;
