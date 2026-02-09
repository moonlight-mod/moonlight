import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../registry";
import type { FriendSourceFlags, SpoilerRenderSetting, StatusTypes } from "../../Constants";

export type UserSetting<T> = {
  getSetting: () => T;
  updateSetting: (value: T) => void;
  useSetting: () => T;
};

export enum AnimateStickers {
  ALWAYS_ANIMATE,
  ANIMATE_ON_INTERACTION,
  NEVER_ANIMATE
}

export type CustomUserThemeSettings = {
  colors: string[];
  gradientColorStops: number[];
  gradientAngle: number;
  baseMix: number;
};
export type ClientThemeSettings = {
  backgroundGradientPresetId?: number;
  customUserThemeSettings?: CustomUserThemeSettings;
};

export type CustomStatus = {
  text: string;
  emojiId: string;
  emojiName: string;
  createdAtMs: string;
  expiresAtMs: string;
  label?: string;
};

export enum DefaultGuildsActivityRestricted {
  OFF,
  ON_FOR_LARGE_GUILDS,
  ON
}

export enum DmSpamFilterV2 {
  DEFAULT_UNSET,
  DISABLED,
  NON_FRIENDS,
  FRIENDS_AND_NON_FRIENDS
}

export enum ExplicitContentFilter {
  UNSET_EXPLICIT_CONTENT_REDACTION,
  SHOW,
  BLUR,
  BLOCK
}

export type ExplicitContentSettings = {
  explicitContentFriendDm: ExplicitContentFilter;
  explicitContentGuilds: ExplicitContentFilter;
  explicitContentNonFriendDm: ExplicitContentFilter;
};

export enum GameActivityNotifications {
  ACTIVITY_NOTIFICATIONS_UNSET,
  ACTIVITY_NOTIFICATIONS_DISABLED,
  ACTIVITY_NOTIFICATIONS_ENABLED,
  ONLY_GAMES_PLAYED
}

export type KeywordFilterSettings = {
  profanity?: boolean;
  sexualContent?: boolean;
  slurs?: boolean;
};

export enum InAppFeedbackType {
  VOICE,
  STREAM,
  VIDEO_BACKGROUND,
  ACTIVITY,
  IN_APP_REPORTS,
  USER_DM_MUTE,
  BLOCK_USER,
  VOICE_FILTER
}
export type InAppFeedbackState = {
  optOutExpiryTime?: string;
};

export enum ReactionNotifications {
  NOTIFICATIONS_ENABLED,
  ONLY_DMS,
  NOTIFICATIONS_DISABLED
}

export enum SlayerSdkReceiveDmsInGame {
  SLAYER_SDK_RECEIVE_IN_GAME_DMS_UNSET,
  SLAYER_SDK_RECEIVE_IN_GAME_DMS_ALL,
  SLAYER_SDK_RECEIVE_IN_GAME_DMS_USERS_WITH_GAME,
  SLAYER_SDK_RECEIVE_IN_GAME_DMS_NONE
}

export type SoundboardSettings = {
  volume: number;
};

export enum UiDensity {
  UNSET_UI_DENSITY,
  COMPACT,
  COZY,
  RESPONSIVE,
  DEFAULT
}

type Exports = {
  NOTIFICATION_CENTER_ACKED_BEFORE_ID_UNSET: "0";

  ActivityJoiningRestrictedGuildIds: UserSetting<string[]>;
  ActivityRestrictedGuildIds: UserSetting<string[]>;
  AfkTimeout: UserSetting<number>;
  AllowActivityPartyPrivacyFriends: UserSetting<boolean>;
  AllowActivityPartyPrivacyVoiceChannel: UserSetting<boolean>;
  AllowGameFriendDmsInDiscord: UserSetting<boolean>;
  AllowVoiceRecording: UserSetting<boolean>;
  AlwaysDeliver: UserSetting<boolean>;
  AlwaysPreviewVideo: UserSetting<boolean>;
  AnimateEmoji: UserSetting<boolean>;
  AnimateStickers: UserSetting<AnimateStickers>;
  ClientThemeSettings: UserSetting<ClientThemeSettings>;
  ConvertEmoticons: UserSetting<boolean>;
  CustomStatus: UserSetting<CustomStatus | undefined>;
  DefaultGuildsActivityRestricted: UserSetting<DefaultGuildsActivityRestricted>;
  DefaultGuildsRestricted: UserSetting<boolean>;
  DefaultGuildsRestrictedV2: UserSetting<boolean | undefined>;
  DefaultMessageRequestRestricted: UserSetting<boolean | undefined>;
  DeveloperMode: UserSetting<boolean>;
  DisableGamesTab: UserSetting<boolean>;
  DisableStreamPreviews: UserSetting<boolean | undefined>;
  DmSpamFilterV2: UserSetting<DmSpamFilterV2>;
  DropsOptedOut: UserSetting<boolean>;
  EmojiPickerCollapsedSections: UserSetting<string[]>;
  EnableTtsCommand: UserSetting<boolean>;
  ExplicitContentFilter: UserSetting<ExplicitContentFilter>;
  ExplicitContentSettings: UserSetting<ExplicitContentSettings>;
  ExpressionSuggestionsEnabled: UserSetting<boolean>;
  FamilyCenterEnabledV2: UserSetting<boolean | undefined>;
  FocusModeExpiresAtMs: UserSetting<string>;
  FriendSourceFlags: UserSetting<FriendSourceFlags>;
  GameActivityNotifications: UserSetting<GameActivityNotifications>;
  GifAutoPlay: UserSetting<boolean>;
  HideLegacyUsername: UserSetting<boolean>;
  IgnoreProfileSpeedbumpDisabled: UserSetting<boolean>;
  InAppFeedbackStates: UserSetting<Record<InAppFeedbackType, InAppFeedbackState>>;
  IncludeSoundmojiInAutocomplete: UserSetting<boolean>;
  IncludeStickersInAutocomplete: UserSetting<boolean>;
  InlineAttachmentMedia: UserSetting<boolean>;
  InlineEmbedMedia: UserSetting<boolean>;
  InstallShortcutDesktop: UserSetting<boolean>;
  InstallShortcutStartMenu: UserSetting<boolean>;
  KeywordFilterSettings: UserSetting<KeywordFilterSettings>;
  LastReceivedChangelogId: UserSetting<string>;
  MessageDisplayCompact: UserSetting<boolean>;
  MessageRequestRestrictedGuildIds: UserSetting<string[]>;
  NonSpamRetrainingOptIn: UserSetting<boolean | undefined>;
  NotificationCenterAckedBeforeId: UserSetting<string>;
  NotifyFriendsOnGoLive: UserSetting<boolean | undefined>;
  QuietMode: UserSetting<boolean>;
  ReactionNotifications: UserSetting<ReactionNotifications>;
  RenderEmbeds: UserSetting<boolean>;
  RenderReactions: UserSetting<boolean>;
  RenderSpoilers: UserSetting<SpoilerRenderSetting>;
  RestrictedGuildIds: UserSetting<string[]>;
  RtcPanelShowVoiceStates: UserSetting<boolean>;
  ShowCommandSuggestions: UserSetting<boolean>;
  ShowCurrentGame: UserSetting<boolean>;
  SlayerSdkReceiveDmsInGame: UserSetting<SlayerSdkReceiveDmsInGame>;
  SoundboardPickerCollapsedSections: UserSetting<string[]>;
  SoundboardSettings: UserSetting<SoundboardSettings | undefined>;
  SoundmojiVolume: UserSetting<number>;
  Status: UserSetting<StatusTypes>;
  StatusExpiresAtMs: UserSetting<string>;
  StickerPickerCollapsedSections: UserSetting<string[]>;
  TimestampHourCycle: UserSetting<number>;
  TimezoneOffset: UserSetting<number>;
  UiDensity: UserSetting<UiDensity>;
  UseLegacyChatInput: UserSetting<boolean>;
  UseRichChatInput: UserSetting<boolean>;
  UseThreadSidebar: UserSetting<boolean>;
  ViewImageDescriptions: UserSetting<boolean>;
  ViewNsfwCommands: UserSetting<boolean>;
  ViewNsfwGuilds: UserSetting<boolean>;
};
export default Exports;

register((moonmap, lunast) => {
  const name = "discord/modules/user_settings/UserSettings";

  lunast.register({
    name,
    find: '"textAndImages","messageDisplayCompact"',
    process({ id, ast }) {
      moonmap.addModule(id, name);

      const { getPropertyGetters, is } = lunast.utils;
      const propertyGetters = getPropertyGetters(ast);

      // Discord has a "FREQUENT_USER_ACTION" version of ActivityRestrictedGuildIds for whatever reason, and it breaks
      // the processor because duplicate export names
      const mapped = new Set();

      for (const [exportName, binding] of Object.entries(propertyGetters)) {
        if (!is.identifier(binding.expression) && !is.arrowFunctionExpression(binding.expression)) continue;
        const definition =
          is.arrowFunctionExpression(binding.expression) && is.identifier(binding.expression.body)
            ? binding.scope.getOwnBinding(binding.expression.body.name)
            : is.identifier(binding.expression)
              ? binding.scope.getOwnBinding(binding.expression.name)
              : null;

        if (!definition) continue;
        if (!is.variableDeclarator(definition.path.node)) continue;

        const expr = definition.path.node.init;
        if (!is.callExpression(expr)) {
          if (is.literal(expr) && expr.value === "0") {
            moonmap.addExport(name, "NOTIFICATION_CENTER_ACKED_BEFORE_ID_UNSET", {
              type: ModuleExportType.Constant,
              find: exportName
            });
          }
          continue;
        }

        const first = expr.arguments[0];
        let settingName = expr.arguments[is.literal(first) ? 1 : 2];
        if (!is.literal(settingName)) {
          if (is.callExpression(first)) {
            settingName = first.arguments[2];
            if (!is.literal(settingName)) continue;
          } else if (is.objectExpression(first)) {
            const base = first.properties.find(
              (prop) => is.property(prop) && is.identifier(prop.key) && prop.key.name === "baseSetting"
            );
            if (is.property(base) && is.callExpression(base.value)) {
              settingName = base.value.arguments[1];
              if (!is.literal(settingName)) continue;
            } else {
              continue;
            }
          } else {
            continue;
          }
        }
        if (!settingName?.value) continue;

        const niceSettingName = settingName.value.toString().replace(/^(.)/, (_, c) => c.toUpperCase());
        if (mapped.has(niceSettingName)) continue;

        moonmap.addExport(name, niceSettingName, {
          type: ModuleExportType.Constant,
          find: exportName
        });
        mapped.add(niceSettingName);
      }

      return true;
    }
  });
});
