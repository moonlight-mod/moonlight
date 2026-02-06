/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../registry";

export enum ActivityFlags {
  INSTANCE = 1 << 0,
  JOIN = 1 << 1,
  SYNC = 1 << 4,
  PLAY = 1 << 5,
  PARTY_PRIVACY_FRIENDS = 1 << 6,
  PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7,
  EMBEDDED = 1 << 8
}

export enum ActivityTypes {
  PLAYING,
  STREAMING,
  LISTENING,
  WATCHING,
  CUSTOM_STATUS,
  COMPETING,
  HANG_STATUS
}

export enum AnalyticsLocations {
  ACTIVITY_PANEL = "Activity Panel",
  ACTIVITY_RPC = "Activity RPC",
  ACTIVITY_SHELF = "Activity Shelf",
  ADD_FRIENDS_TO_DM = "Add Friends to DM",
  APPLICATION_CONTEXT_MENU_PLAY = "Application Context Menu Play",
  APPLICATION_CONTEXT_MENU_TOGGLE_INSTALL = "Application Context Menu Toggle Install",
  APPLICATION_LIBRARY = "Application Library",
  APPLICATION_LIBRARY_UPDATES = "Application Library Updates",
  APPLICATION_STORE = "Application Store",
  APPLICATION_STORE_HEADER = "Application Store Header",
  APPLICATION_STORE_HERO = "Application Store Hero",
  APPLICATION_STORE_LISTING_BACK_BUTTON = "Application Store Listing Back Button",
  APPLICATION_STORE_LISTING_DETAILS = "Application Store Listing Details",
  APPLICATION_STORE_PAYMENT_MODAL = "Application Store Purchase Modal",
  APPLICATION_STORE_PREMIUM_CAROUSEL = "Application Store Premium Carousel",
  APPLICATION_STORE_RELATED_CONTENT = "Application Store Related Content",
  APPLICATION_STORE_TILE = "Application Store Tile",
  APPLICATION_STORE_WARNING = "Application Store Warning",
  APPLICATION_TEST_MODE_NOTICE = "Application Test Mode Notice",
  APP_DIRECTORY_PROFILE = "App Directory Profile",
  APP_STOREFRONT = "app storefront",
  APP_SUBSCRIPTIONS_MANAGEMENT = "app subscriptions management",
  BITE_SIZE_POPOUT = "Bite Size Popout",
  BOT_PROFILE_POPOUT = "Bot Profile Popout",
  CAROUSEL_PROMOTION_UNIT = "Carousel Promotion Unit",
  CHANNEL_CALL = "Channel Call",
  CHECKOUT_RECOVERY_NAGBAR = "Checkout Recovery Nagbar",
  CLAN_ADOPT_IDENTITY_MODAL = "clan adopt identity modal",
  CLAN_DISCOVERY_CARD = "clan discovery card",
  CLAN_SETUP_MODAL = "clan setup modal",
  CONNECTIONS_EMPTY_STATE = "Connections User Settings Empty State",
  CONSOLE_LAN_DETECTION_ACTION_SHEET = "Console LAN Detection Action Sheet",
  CONTEXT_MENU = "Context Menu",
  CREATE_JOIN_GUILD_MODAL = "Create or Join Guild Modal",
  DEEP_LINK = "Deep Link",
  E2EE_USER_VERIFY_MODAL = "E2EE User Verify Modal",
  EXTERNAL_INVITE_LINK_MODAL = "External Invite Link Modal",
  FRIEND_ANNIVERSARIES_ACTION_BUTTON = "Friend Anniversaries Action Button",
  FRIEND_ANNIVERSARIES_ACTION_BUTTON_COACHMARK = "Friend Anniversaries Action Button Coachmark",
  FRIEND_ANNIVERSARIES_CHAT = "Friend Anniversaries Chat",
  GAME_MODAL = "Game Modal",
  GAME_POPOUT = "Game Popout",
  GO_LIVE_MODAL = "Go Live Modal",
  GUILD_CHANNEL_LIST = "Guild Channel List",
  GUILD_CREATE_INVITE_SUGGESTION = "Guild Create Invite Suggestion",
  GUILD_INTEGRATION_SETTINGS = "Guild Integration Settings",
  HOME_BUTTON = "Home Button",
  HOME_NAVIGATION = "Home Navigation",
  HUB_PROGRESS = "Hub Progress",
  INBOUND_PARTNER_PROMOTION_REDEMPTION_MODAL = "Inbound Partner Promotion Redemption Modal",
  INTENT_DISCOVERY = "Intent Discovery",
  INTERACTION_RESPONSE = "Interaction Response",
  IN_APPLICATION_PURCHASE_FALLBACK = "In-Application Purchase - App",
  IN_APPLICATION_PURCHASE_OVERLAY = "In-Application Purchase - Overlay",
  LARGE_SERVER_INTENT_DISCOVERY = "Large Game Server Intent Discovery",
  LOCKED_OVERLAY = "Locked Overlay",
  MANAGE_ACCOUNTS_MODAL = "Manage Accounts Modal",
  MESSAGE_EMBED = "Message Embed",
  NITRO_BASIC_UPSELL = "Nitro Basic Upsell",
  NOTIFICATION_CENTER = "Notification Center",
  OVERLAY_NUDGE = "Overlay Nudge",
  PARTNER_PROMOTIONS_CLAIM_MODAL = "Partner Promotions Claim Modal",
  PROFILE_MODAL_MUTUALS = "Profile Modal Mutuals",
  PROFILE_MODAL_RELATIONS = "Profile Modal Relations",
  PROFILE_MODAL_TABS = "Profile Modal Tabs",
  PROFILE_PANEL = "Profile Panel",
  PROFILE_POPOUT = "Profile Popout",
  PROMOTION_CARD = "Promotion Card",
  QUICK_LAUNCHER = "Quick Launcher",
  QUICK_SWITCHER = "Quick Switcher",
  REGISTRATION = "Registration",
  RELINK_UPSELL = "Relink Upsell",
  REPEAT_GIFT_PURCHASE_BUTTON = "Repeat Gift Purchase Button",
  ROLE_SUBSCRIPTIONS_TAB = "Role Subscriptions Tab",
  ROLE_SUBSCRIPTION_GATED_CHANNEL = "Role Subscription Gated Channel",
  SHARE_NEWS_MODAL = "Share News Modal",
  SIMPLIFIED_USER_PROFILE = "Simplified User Profile",
  STANDALONE_MANAGE_SUBSCRIPTIONS = "Standalone Manage Subscriptions",
  STREAM = "Stream",
  TRAY_CONTEXT_MENU = "Tray Context Menu",
  UNCANCEL_WINBACK_MODAL = "Premium Uncancel Winback Modal",
  UNLOCKED_OVERLAY = "Unlocked Overlay",
  URI_SCHEME = "URI Scheme",
  USER_ACTIVITY_ACTIONS = "User Activity Actions",
  USER_SETTINGS = "User Settings",
  VOICE_PANEL = "Voice Panel"
}

export enum ChannelLayouts {
  FULL_SCREEN = "full-screen",
  MINIMUM = "minimum",
  NORMAL = "normal",
  NO_CHAT = "no-chat"
}

export enum ChannelModes {
  VIDEO = "video",
  VOICE = "voice"
}

export enum ChannelStreamTypes {
  DIVIDER = "DIVIDER",
  DIVIDER_NEW_MESSAGES = "DIVIDER_NEW_MESSAGES",
  DIVIDER_TIME_STAMP = "DIVIDER_TIME_STAMP",
  FORUM_POST_ACTION_BAR = "FORUM_POST_ACTION_BAR",
  JUMP_TARGET = "JUMP_TARGET",
  MESSAGE = "MESSAGE",
  MESSAGE_GROUP = "MESSAGE_GROUP",
  MESSAGE_GROUP_BLOCKED = "MESSAGE_GROUP_BLOCKED",
  MESSAGE_GROUP_IGNORED = "MESSAGE_GROUP_IGNORED",
  MESSAGE_GROUP_SPAMMER = "MESSAGE_GROUP_SPAMMER",
  THREAD_STARTER_MESSAGE = "THREAD_STARTER_MESSAGE"
}

export enum ChannelTypes {
  GUILD_TEXT,
  DM,
  GUILD_VOICE,
  GROUP_DM,
  GUILD_CATEGORY,
  GUILD_ANNOUNCEMENT,
  GUILD_STORE,
  ANNOUNCEMENT_THREAD = 10,
  PUBLIC_THREAD,
  PRIVATE_THREAD,
  GUILD_STAGE_VOICE,
  GUILD_DIRECTORY,
  GUILD_FORUM,
  GUILD_MEDIA,
  LOBBY,
  DM_SDK,
  UNKNOWN = 10000
}

export enum ComponentActions {
  BLUR_INPUT = "BLUR_INPUT",
  BOTTOM_CHANNEL_SCREEN_DRAG_START = "BOTTOM_CHANNEL_SCREEN_DRAG_START",
  CALL_ACCEPT = "CALL_ACCEPT",
  CALL_DECLINE = "CALL_DECLINE",
  CALL_START = "CALL_START",
  CAROUSEL_NEXT = "CAROUSEL_NEXT",
  CAROUSEL_PREV = "CAROUSEL_PREV",
  CLEAR_TEXT = "CLEAR_TEXT",
  CLOSE_GIF_PICKER = "CLOSE_GIF_PICKER",
  CONNECTIONS_CALLBACK_ERROR = "CONNECTIONS_CALLBACK_ERROR",
  CONTEXT_MENU_CLOSE = "CONTEXT_MENU_CLOSE",
  DDR_ARROW_DOWN = "DDR_ARROW_DOWN",
  DDR_ARROW_UP = "DDR_ARROW_UP",
  EMPHASIZE_NOTICE = "EMPHASIZE_NOTICE",
  EMPHASIZE_SLOWMODE_COOLDOWN = "EMPHASIZE_SLOWMODE_COOLDOWN",
  FAVORITE_GIF = "FAVORITE_GIF",
  FOCUS_ATTACHMENT_AREA = "FOCUS_ATTACHMENT_AREA",
  FOCUS_CHANNEL_TEXT_AREA = "FOCUS_CHANNEL_TEXT_AREA",
  FOCUS_CHAT_BUTTON = "FOCUS_CHAT_BUTTON",
  FOCUS_COMPOSER_TITLE = "FOCUS_COMPOSER_TITLE",
  FOCUS_FRIEND_SEARCH = "FOCUS_FRIEND_SEARCH",
  FOCUS_MESSAGES = "FOCUS_MESSAGES",
  FOCUS_SEARCH = "FOCUS_SEARCH",
  GLOBAL_CLIPBOARD_PASTE = "GLOBAL_CLIPBOARD_PASTE",
  HIDE_APP_LAUNCHER_BUTTON_APP_INSTALLED_EDUCATION = "HIDE_APP_LAUNCHER_BUTTON_APP_INSTALLED_EDUCATION",
  HIDE_CHANNEL_DETAILS = "HIDE_CHANNEL_DETAILS",
  IFRAME_MOUNT = "IFRAME_MOUNT",
  IFRAME_UNMOUNT = "IFRAME_UNMOUNT",
  INSERT_TEXT = "INSERT_TEXT",
  LAST_NITRO_HOST_LEFT = "LAST_NITRO_HOST_LEFT",
  LAUNCH_PAD_HIDE = "LAUNCH_PAD_HIDE",
  LAUNCH_PAD_SHOW = "LAUNCH_PAD_SHOW",
  LAYER_POP_COMPLETE = "LAYER_POP_COMPLETE",
  LAYER_POP_ESCAPE_KEY = "LAYER_POP_ESCAPE_KEY",
  LAYER_POP_START = "LAYER_POP_START",
  MANUAL_IFRAME_RESIZING = "MANUAL_IFRAME_RESIZING",
  MARK_TOP_INBOX_CHANNEL_READ = "MARK_TOP_INBOX_CHANNEL_READ",
  MEDIA_KEYBOARD_GIFT_SELECTED = "MEDIA_KEYBOARD_GIFT_SELECTED",
  MEDIA_MODAL_CLOSE = "MEDIA_MODAL_CLOSE",
  MODAL_CAROUSEL_NEXT = "MODAL_CAROUSEL_NEXT",
  MODAL_CAROUSEL_PREV = "MODAL_CAROUSEL_PREV",
  MODAL_CLOSE = "MODAL_CLOSE",
  MODAL_SUBMIT = "MODAL_SUBMIT",
  NAVIGATOR_READY = "NAVIGATOR_READY",
  OPEN_APP_LAUNCHER = "OPEN_APP_LAUNCHER",
  OPEN_EMBEDDED_ACTIVITY = "OPEN_EMBEDDED_ACTIVITY",
  OPEN_EXPRESSION_PICKER = "OPEN_EXPRESSION_PICKER",
  OPEN_THREAD_NOTIFICATION_SETTINGS = "OPEN_THREAD_NOTIFICATION_SETTINGS",
  OVERLAY_V3_SHOW_WIDGETS = "OVERLAY_V3_SHOW_WIDGETS",
  PERFORM_SEARCH = "PERFORM_SEARCH",
  POPOUT_CLOSE = "POPOUT_CLOSE",
  POPOUT_HIDE = "POPOUT_HIDE",
  POPOUT_SHOW = "POPOUT_SHOW",
  PREMIUM_SUBSCRIPTION_CREATED = "PREMIUM_SUBSCRIPTION_CREATED",
  PREPEND_TEXT = "PREPEND_TEXT",
  QUICKSWITCHER_RESULT_FOCUS = "QUICKSWITCHER_RESULT_FOCUS",
  RELEASE_ACTIVITY_WEB_VIEW = "RELEASE_ACTIVITY_WEB_VIEW",
  REMEASURE_TARGET = "REMEASURE_TARGET",
  SCROLLTO_CHANNEL = "SCROLLTO_CHANNEL",
  SCROLLTO_PRESENT = "SCROLLTO_PRESENT",
  SCROLL_PAGE_DOWN = "SCROLL_PAGE_DOWN",
  SCROLL_PAGE_UP = "SCROLL_PAGE_UP",
  SEARCH_RESULTS_CLOSE = "SEARCH_RESULTS_CLOSE",
  SEARCH_TABS_RESET = "SEARCH_TABS_RESET",
  SELECT_ACTIVITY = "SELECT_ACTIVITY",
  SET_SEARCH_QUERY = "SET_SEARCH_QUERY",
  SHAKE_APP = "SHAKE_APP",
  SHOW_ACTIVITIES_CHANNEL_SELECTOR = "SHOW_ACTIVITIES_CHANNEL_SELECTOR",
  SHOW_ACTIVITY_DETAILS = "SHOW_ACTIVITY_DETAILS",
  SHOW_APP_LAUNCHER_BUTTON_APP_INSTALLED_EDUCATION = "SHOW_APP_LAUNCHER_BUTTON_APP_INSTALLED_EDUCATION",
  SHOW_CHANNEL_DETAILS = "SHOW_CHANNEL_DETAILS",
  SHOW_OAUTH2_MODAL = "SHOW_OAUTH2_MODAL",
  SHOW_TEXT_IN_VOICE_POPOUT_COMING_SOON_TIP = "SHOW_TEXT_IN_VOICE_POPOUT_COMING_SOON_TIP",
  TEXTAREA_BLUR = "TEXTAREA_BLUR",
  TEXTAREA_FOCUS = "TEXTAREA_FOCUS",
  TOGGLE_CALL_CONTROL_DRAWER = "TOGGLE_CALL_CONTROL_DRAWER",
  TOGGLE_CHANNEL_PINS = "TOGGLE_CHANNEL_PINS",
  TOGGLE_DM_CREATE = "TOGGLE_DM_CREATE",
  TOGGLE_EMOJI_POPOUT = "TOGGLE_EMOJI_POPOUT",
  TOGGLE_FOR_LATER = "TOGGLE_FOR_LATER",
  TOGGLE_GIF_PICKER = "TOGGLE_GIF_PICKER",
  TOGGLE_GUILD_FEED_FEATURED_ITEMS = "TOGGLE_GUILD_FEED_FEATURED_ITEMS",
  TOGGLE_INBOX = "TOGGLE_INBOX",
  TOGGLE_SOUNDBOARD = "TOGGLE_SOUNDBOARD",
  TOGGLE_STICKER_PICKER = "TOGGLE_STICKER_PICKER",
  UPLOAD_FILE = "UPLOAD_FILE",
  VIDEO_EMBED_PLAYBACK_STARTED = "VIDEO_EMBED_PLAYBACK_STARTED",
  VOICE_MESSAGE_BUTTON_PRESSED = "VOICE_MESSAGE_RECORDING_PRESSED",
  VOICE_MESSAGE_PLAYBACK_STARTED = "VOICE_MESSAGE_PLAYBACK_STARTED",
  VOICE_PANEL_CLOSE = "VOICE_PANEL_CLOSE",
  VOICE_PANEL_OPEN = "VOICE_PANEL_OPEN",
  VOICE_PANEL_PIP_CONTENT_READY = "VOICE_PANEL_PIP_CONTENT_READY",
  VOICE_PANEL_TIV_CLOSE = "VOICE_PANEL_TIV_CLOSE",
  WAVE_EMPHASIZE = "WAVE_EMPHASIZE"
}

type DEFAULT_ROLE_COLOR = 10070709;

export type Endpoints = {
  USER: <U extends string>(userId: U) => `/users/${U}`;
  USER_RELAUIONSHIPS: <U extends string = "@me">(userId?: U) => `/users/${U}/relationships`;
  USER_RELAUIONSHIP: <U extends string>(userId: U) => `/users/@me/relationships/${U}`;
  USER_BULK_RELAUIONSHIPS: "/users/@me/relationships/bulk";
  USER_PROFILE: <U extends string>(userId: U) => `/users/${U}/profile`;
  USER_GUILD_PROFILE: <G extends string, U extends string>(guildId: G, userId: U) => `/users/${U}/profile`;
  USER_CHANNELS: "/users/@me/channels";
  DM_CHANNEL: <C extends string>(channelId: C) => `/users/@me/dms/${C}`;
  USER_SETTINGS_PROTO: <T extends number>(type: T) => `/users/@me/settings-proto/${T}`;
  USER_ACTIVITY_METADATA: <U extends string, S extends string, A extends string = "0">(
    userId: U,
    session: S,
    appId?: A
  ) => `/users/${U}/sessions/${S}/activities/${A}/metadata`;
  USER_ACTIVITY_JOIN: <U extends string, S extends string, A extends string>(
    userId: U,
    session: S,
    appId: A
  ) => `/users/${U}/sessions/${S}/activities/${A}/1`;
  USER_ACTIVITY_STATISTICS: "/users/@me/activities/statistics/applications";
  APPLICATION_ACTIVITY_STATISTICS: <A extends string>(appId: A) => `/activities/statistics/applications/${A}`;
  ACTIVITIES: "/activities";
  NETWORKING_TOKEN: "/networking/token";
  USER_GAMES_NOTIFICATIONS: "/users/@me/settings/game-notifications";
  USER_GAMES_NOTIFICATIONS_OVERRIDES: "/users/@me/settings/game-notifications/overrides";
  UNVERIFIED_APPLICATIONS: "/unverified-applications";
  UNVERIFIED_APPLICATIONS_ICONS: "/unverified-applications/icons";
  GUILD_FEATURE_ACK: <G extends string, A extends string, T extends string>(
    guildId: G,
    ack: A,
    type: T
  ) => `/guilds/${G}/ack/${A}/${T}`;
  USER_NON_CHANNEL_ACK: <A extends string, T extends string>(ack: A, type: T) => `/users/@me/${T}/${A}/ack`;
  BULK_ACK: "/read-states/ack-bulk";
  DM_SETTINGS_UPSELL_ACK: <G extends string>(guildId: G) => `/users/@me/guilds/${G}/member/ack-dm-upsell-settings`;
  GUILD_CHANNELS: <G extends string>(guildId: G) => `/guilds/${G}/channels`;
  GUILD_MEMBERS: <G extends string>(guildId: G) => `/guilds/${G}/members`;
  GUILD_MEMBER: <G extends string, U extends string>(guildId: G, userId: U) => `/guilds/${G}/members/${U}`;
  GUILD_MEMBER_NICK: <G extends string, U extends string>(guildId: G, userId: U) => `/guilds/${G}/members/${U}/nick`;
  GUILD_MEMBER_AVATAR: <G extends string, U extends string, A extends string, E extends string>(
    guildId: G,
    userId: U,
    avatar: A,
    extension: E
  ) => `/guilds/${G}/users/${U}/avatars/${A}.${E}`;
  SET_GUILD_MEMBER: <G extends string>(guildId: G) => `/guilds/${G}/members/@me`;
  GUILD_JOIN: <G extends string>(guildId: G) => `/guilds/${G}/members/@me`;
  GUILD_LEAVE: <G extends string>(guildId: G) => `/users/@me/guilds/${G}`;
  GUILD_INTEGRATIONS: <G extends string>(guildId: G) => `/guilds/${G}/integrations`;
  GUILD_INTEGRATION: <G extends string, I extends string>(
    guildId: G,
    integration: I
  ) => `/guilds/${G}/integrations/${I}`;
  GUILD_INTEGRATION_SYNC: <G extends string, I extends string>(
    guildId: G,
    integration: I
  ) => `/guilds/${G}/integrations/${I}/sync`;
  GUILD_MIGRATE_COMMAND_SCOPE: <G extends string>(guildId: G) => `/guilds/${G}/migrate-comand-scope`;
  GUILD_BANS_SEARCH: <G extends string>(guildId: G) => `/guilds/${G}/bans/search`;
  GUILD_BANS: <G extends string>(guildId: G) => `/guilds/${G}/bans`;
  GUILD_BAN: <G extends string, U extends string>(guildId: G, userId: U) => `/guilds/${G}/bans/${U}`;
  GUILD_ROLES: <G extends string>(guildId: G) => `/guilds/${G}/roles`;
  GUILD_ROLE_MEMBER_COUNTS: <G extends string>(guildId: G) => `/guilds/${G}/roles/member-counts`;
  GUILD_ROLE_CONNECTIONS_CONFIGURATIONS: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/roles/connections-configurations`;
  GUILD_ROLE: <G extends string, R extends string>(guildId: G, roleId: R) => `/guilds/${G}/roles/${R}`;
  GUILD_ROLE_MEMBERS: <G extends string, R extends string>(guildId: G, roleId: R) => `/guilds/${G}/roles/${R}/members`;
  GUILD_ROLE_CONNECTIONS_ELIGIBILITY: <G extends string, R extends string>(
    guildId: G,
    roleId: R
  ) => `/guilds/${G}/roles/${R}/connections/eligibility`;
  GUILD_ROLE_CONNECTIONS_ASSIGN: <G extends string, R extends string>(
    guildId: G,
    roleId: R
  ) => `/guilds/${G}/roles/${R}/connections/assign`;
  GUILD_ROLE_CONNECTIONS_UNASSIGN: <G extends string, R extends string>(
    guildId: G,
    roleId: R
  ) => `/guilds/${G}/roles/${R}/connections/unassign`;
  GUILD_ONBOARDING: <G extends string>(guildId: G) => `/guilds/${G}/onboarding`;
  GUILD_ONBOARDING_PROMPT: <G extends string, P extends string>(
    guildId: G,
    prompt: P
  ) => `/guilds/${G}/onboarding-prompts/${P}`;
  GUILD_ONBOARDING_RESPONSES: <G extends string>(guildId: G) => `/guilds/${G}/onboarding-responses`;
  ROLE_ICON: <R extends string, I extends string>(roleId: R, icon: I) => `/roles/${R}/icons/${I}.png`;
  GUILD_INSTANT_INVITES: <G extends string>(guildId: G) => `/guilds/${G}/invites`;
  GUILD_WIDGET: <G extends string>(guildId: G) => `/guilds/${G}/widget`;
  GUILD_VANITY_URL: <G extends string>(guildId: G) => `/guilds/${G}/vanity-url`;
  GUILD_MFA: <G extends string>(guildId: G) => `/guilds/${G}/mfa`;
  GUILD_PRUNE: <G extends string>(guildId: G) => `/guilds/${G}/prune`;
  GUILD_ICON: <G extends string, I extends string, E extends string = "jpg">(
    guildId: G,
    icon: I,
    extension?: E
  ) => `/guilds/${G}/icons/${I}.${E}`;
  GUILD_TEMPLATE_ICON: <G extends string, I extends string, E extends string = "jpg">(
    guildId: G,
    icon: I,
    extension?: E
  ) => `/templates/${G}/icons/${I}.${E}`;
  GUILD_DISCOVERY_CHECKLIST: <G extends string>(guildId: G) => `/guilds/${G}/discovery-checklist`;
  GUILD_DISCOVERY_REQUIREMENTS: <G extends string>(guildId: G) => `/guilds/${G}/discovery-requirements`;
  GUILD_EMOJIS: <G extends string>(guildId: G) => `/guilds/${G}/emojis`;
  GUILD_EMOJI: <G extends string, E extends string>(guildId: G, emojiId: E) => `/guilds/${G}/emojis/${E}`;
  GUILD_AUDIT_LOG: <G extends string>(guildId: G) => `/guilds/${G}/audit-logs`;
  GUILD_ANALYTICS_OVERVIEW: <G extends string>(guildId: G) => `/guilds/${G}/analytics/overview`;
  GUILD_ANALYTICS_ENGAGEMENT_OVERVIEW: <G extends string>(guildId: G) => `/guilds/${G}/analytics/engagement/overview`;
  GUILD_ANALYTICS_GROWTH_ACTIVATION_OVERVIEW: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/analytics/growth-activation/overview`;
  GUILD_ANALYTICS_GROWTH_ACTIVATION_RETENTION: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/analytics/growth-activation/retention`;
  GUILD_TOP_GAMES: <G extends string>(guildId: G) => `/guilds/${G}/top-games`;
  GUILD_TOP_READ_CHANNELS: <G extends string>(guildId: G) => `/guilds/${G}/top-read-channels`;
  EMOJI: <I extends string, E extends string>(emojiId: I, extension: E) => `/emojis/${I}.${E}`;
  EMOJI_GUILD_DATA: <E extends string>(emojiId: E) => `/emojis/${E}/guild`;
  EMOJI_SOURCE_DATA: <E extends string>(emojiId: E) => `/emojis/${E}/source`;
  TOP_EMOJIS_FOR_GUILD: <G extends string>(guildId: G) => `/guilds/${G}/top-emojis`;
  GUILD_SPLASH: <G extends string, S extends string>(guildId: G, splash: S) => `/guilds/${G}/splashes/${S}.jpg`;
  GUILD_DISCOVERY_SPLASH: <G extends string, S extends string>(
    guildId: G,
    splash: S
  ) => `/guilds/${G}/discovery-splashes/${S}.jpg`;
  GUILD_BANNER: <G extends string, B extends string, E extends string>(
    guildId: G,
    banner: B,
    extension: E
  ) => `/guilds/${G}/icons/${B}.${E}`;
  GUILD_HOME_SETTINGS: <G extends string>(guildId: G) => `/guilds/${G}/new-member-welcome`;
  RESOURCE_CHANNEL: <G extends string, I extends string>(guildId: G, id: I) => `/guilds/${G}/resource-channels/${I}`;
  NEW_MEMBER_ACTION: <G extends string, I extends string>(guildId: G, id: I) => `/guilds/${G}/new-member-actions/${I}`;
  GUILD_RESOURCE_CHANNELS_ICON: <G extends string, I extends string, E extends string = "jpg">(
    guildId: G,
    icon: I,
    extension?: E
  ) => `/guilds/${G}/avatars/${I}.${E}`;
  GUILD_NEW_MEMBER_ACTIONS_ICON: <G extends string, I extends string, E extends string = "jpg">(
    guildId: G,
    icon: I,
    extension?: E
  ) => `/guilds/${G}/avatars/${I}.${E}`;
  GUILD_MEMBER_ACTIONS: <G extends string>(guildId: G) => `/guilds/${G}/new-member-actions`;
  GUILD_MEMBER_ACTION_UPDATE: <G extends string, A extends string>(
    guildId: G,
    action: A
  ) => `/guilds/${G}/new-member-actions/${A}`;
  GUILD_HOME_HEADER: <G extends string, H extends string>(
    guildId: G,
    header: H
  ) => `/guilds/${G}/home-headers/${H}.jpg`;
  GUILD_WELCOME_SCREEN: <G extends string>(guildId: G) => `/guilds/${G}/welcome-screen`;
  GUILD_MEMBER_VERIFICATION: <G extends string>(guildId: G) => `/guilds/${G}/member-verification`;
  GUILD_JOIN_REQUESTS_BY_ID: <I extends string>(id: I) => `/join-requests/${I}`;
  GUILD_JOIN_REQUESTS: <G extends string>(guildId: G) => `/guilds/${G}/requests`;
  USER_JOIN_REQUEST_GUILDS: "/users/@me/join-request-guilds";
  GUILD_MEMBER_REQUEST_TO_JOIN: <G extends string>(guildId: G) => `/guilds/${G}/requests/@me`;
  GUILD_MEMBER_JOIN_REQUEST_COOLDOWN: <G extends string>(guildId: G) => `/guilds/${G}/requests/@me/cooldown`;
  GUILD_JOIN_REQUEST: <G extends string, I extends string>(guildId: G, id: I) => `/guilds/${G}/requests/${I}`;
  GUILD_JOIN_REQUEST_ID: <G extends string, I extends string>(guildId: G, id: I) => `/guilds/${G}/requests/id/${I}`;
  GUILD_JOIN_REQUEST_ACK: <G extends string, I extends string>(guildId: G, id: I) => `/guilds/${G}/requests/${I}/ack`;
  GUILD_JOIN_REQUEST_INTERVIEW: <I extends string>(id: I) => `/join-requests/${I}/interview`;
  GUILDS: "/guilds";
  GUILD: <G extends string>(guildId: G) => `/guilds/${G}`;
  GUILD_BASIC: <G extends string>(guildId: G) => `/guilds/${G}/basic`;
  GUILD_PINCODE: <G extends string>(guildId: G) => `/guilds/${G}/pincode`;
  GUILD_DELETE: <G extends string>(guildId: G) => `/guilds/${G}/delete`;
  CHANNELS: "/channels";
  CHANNEL: <C extends string>(channelId: C) => `/channels/${C}`;
  THREAD_MEMBER: <C extends string, U extends string = "@me">(
    channelId: C,
    userId?: U
  ) => `/channels/${C}/thread-members/${U}`;
  THREAD_MEMBER_SETTINGS: <C extends string>(channelId: C) => `/channels/${C}/thread-members/@me/settings`;
  ALL_ARCHIVED_THREADS: <C extends string, T extends string>(
    channelId: C,
    type: T
  ) => `/channels/${C}/threads/archived/${T}`;
  MY_ARCHIVED_THREADS: <C extends string>(channelId: C) => `/channels/${C}/users/@me/threads/archived/private`;
  THREAD_SEARCH: <C extends string>(channelId: C) => `/channels/${C}/threads/search`;
  FORUM_POSTS: <C extends string>(channelId: C) => `/channels/${C}/post-data`;
  VOICE_CHANNEL_NOTIFICATIONS: <C extends string>(channelId: C) => `/channels/${C}/voice-push`;
  PARTNER_REQUIREMENTS: <I extends string>(id: I) => `/partners/${I}/requirements`;
  AVATAR: <U extends string, A extends string, E extends string = "jpg">(
    userId: U,
    avatar: A,
    extension?: E
  ) => `/users/${U}/avatars/${A}.${E}`;
  USER_BANNER: <U extends string, B extends string, E extends string>(
    userId: U,
    banner: B,
    extension: E
  ) => `/users/${U}/banners/${B}.${E}`;
  AVATAR_DECORATION_PRESETS: <P extends string, E extends string = "png">(
    preset: P,
    extension?: E
  ) => `/avatar-decoration-presets/${P}.${E}`;
  USER_PROFILE_EFFECTS: "/user-profile-effects";
  COLLECTIBLES_CATEGORIES: "/collectibles-categories";
  COLLECTIBLES_CLAIM: "/users/@me/claim-premium-collectibles-product";
  COLLECTIBLES_PURCHASES: "/users/@me/collectibles-purchases";
  COLLECTIBLES_PRODUCTS: <I extends string>(id: I) => `/collectibles-products/${I}`;
  COLLECTIBLES_VALID_GIFT_RECIPIENT: "/users/@me/valid-collectibles-gift-recipient";
  COLLECTIBLES_MARKETING: "/users/@me/collectibles-marketing";
  COLLECTIBLES_SHOP_HOME: "/collectibles-shop-home";
  CONSUMABLE_FETCH_PRICE: <I extends string>(id: I) => `/store/consumable/pricing/${I}`;
  CONSUME_HD_STREAMING_POTION: "/users/@me/consumable/hd-streaming";
  FETCH_HD_STREAMING_ENTITLEMENT: "/users/@me/consumable/hd-streaming";
  CONSUME_MESSAGE_CONFETTI_POTION: "/users/@me/consumable/confetti";
  FETCH_MESSAGE_CONFETTI_ENTITLEMENT: "/users/@me/consumable/confetti";
  GUILD_MEMBER_BANNER: <G extends string, U extends string, B extends string, E extends string = "png">(
    guildId: G,
    userId: U,
    banner: B,
    extension?: E
  ) => `/guilds/${G}/users/${U}/banners/${B}.${E}`;
  MESSAGES: <C extends string>(channelId: C) => `/channels/${C}/messages`;
  MESSAGES_GREET: <C extends string>(channelId: C) => `/channels/${C}/greet`;
  MESSAGE: <C extends string, M extends string>(channelId: C, messageId: M) => `/channels/${C}/messages/${M}`;
  MESSAGE_ACK: <C extends string, M extends string>(channelId: C, messageId: M) => `/channels/${C}/messages/${M}/ack`;
  MESSAGE_CREATE_ATTACHMENT_UPLOAD: <C extends string>(channelId: C) => `/channels/${C}/attachments`;
  UPDATE_VOICE_CHANNEL_STATUS: <C extends string>(channelId: C) => `/channels/${C}/voice-status`;
  MESSAGE_DELETE_UPLOAD: <I extends string>(id: I) => `/attachments/${I}`;
  MESSAGE_CROSSPOST: <C extends string, M extends string>(
    channelId: C,
    messageId: M
  ) => `/channels/${C}/messages/${M}/crosspost`;
  MESSAGE_LOG_PRIVATE_CHANNELS: "/messages-log/private-channels/get";
  MESSAGE_LOG_GUILD_CHANNELS: "/messages-log/guild-channels/get";
  BACKGROUND_SYNC: "/users/@me/background-sync";
  MESSAGE_PREVIEWS: "/channels/preload-messages";
  GUILD_FEED_MESSAGE_REMOVE: <C extends string, M extends string>(
    channelId: C,
    messageId: M
  ) => `/channels/${C}/messages/${M}/hide-guild-feed`;
  GUILD_FEED_MESSAGE_SET_PREFERENCE: <G extends string>(guildId: G) => `/guilds/${G}/guild-feed/preference`;
  GUILD_FEED_FEATURE_ITEM: <G extends string>(guildId: G) => `/guilds/${G}/guild-feed/feature`;
  GUILD_FEED_MARK_SEEN: <G extends string>(guildId: G) => `/guilds/${G}/guild-feed/mark-seen`;
  PINS_ACK: <C extends string>(channelId: C) => `/channels/${C}/pins/ack`;
  PINS: <C extends string>(channelId: C) => `/channels/${C}/pins`;
  PIN: <C extends string, M extends string>(channelId: C, messageId: M) => `/channels/${C}/pins/${M}`;
  INSTANT_INVITES: <C extends string>(channelId: C) => `/channels/${C}/invites`;
  TYPING: <C extends string>(channelId: C) => `/channels/${C}/typing`;
  CHANNEL_PERMISSIONS_OVERWRITE: <C extends string, P extends string>(
    channelId: C,
    permission: P
  ) => `/channels/${C}/permissions/${P}`;
  CHANNEL_RECIPIENTS: <C extends string>(channelId: C) => `/channels/${C}/recipients`;
  CHANNEL_RECIPIENT: <C extends string, U extends string>(channelId: C, userId: U) => `/channels/${C}/recipients/${U}`;
  CHANNEL_RECIPIENT_ME: <C extends string>(channelId: C) => `/channels/${C}/recipients/@me`;
  CHANNEL_RECIPIENT_REJECT_BATCH: () => "/channels/recipients/@me/batch-reject";
  CHANNEL_ICON: <C extends string, I extends string>(channelId: C, icon: I) => `/channels/${C}/icons/${I}.jpg`;
  CHANNEL_CONVERT: <C extends string>(channelId: C) => `/channels/${C}/convert`;
  CHANNEL_ACK: <C extends string>(channelId: C) => `/channels/${C}/messages/ack`;
  CHANNEL_STORE_LISTING: <C extends string>(channelId: C) => `/channels/${C}/store-listing`;
  CHANNEL_STORE_LISTING_SKU: <C extends string, S extends string>(
    channelId: C,
    skuId: S
  ) => `/channels/${C}/store-listings/${S}`;
  CHANNEL_ENTITLEMENT_GRANT: <C extends string>(channelId: C) => `/channels/${C}/store-listing/entitlement-grant`;
  CHANNEL_FOLLOWERS: <C extends string>(channelId: C) => `/channels/${C}/followers`;
  CHANNEL_FOLLOWER_STATS: <C extends string>(channelId: C) => `/channels/${C}/follower-stats`;
  CHANNEL_FOLLOWER_MESSAGE_STATS: <C extends string>(channelId: C) => `/channels/${C}/follower-message-stats`;
  CHANNEL_INTEGRATIONS: <C extends string>(channelId: C) => `/channels/${C}/integrations`;
  CHANNEL_INTEGRATION: <C extends string, I extends string>(
    channelId: C,
    integration: I
  ) => `/channels/${C}/integrations/${I}`;
  CHANNEL_SAFETY_WARNINGS_ACK: <C extends string>(channelId: C) => `/channels/${C}/safety-warnings/ack`;
  CHANNEL_BLOCKED_USER_WARNING_ACK: <C extends string>(channelId: C) => `/channels/${C}/blocked-user-warning-dismissal`;
  FORUM_TAGS: <C extends string>(channelId: C) => `/channels/${C}/tags`;
  FORUM_TAG: <C extends string, T extends string>(channelId: C, tag: T) => `/channels/${C}/tags/${T}`;
  FRIEND_FINDER: "/friend-finder/find-friends";
  FRIEND_SUGGESTIONS: "/friend-suggestions";
  FRIEND_SUGGESTION: <I extends string>(id: I) => `/friend-suggestions/${I}`;
  TUTORIAL_INDICATORS: "/tutorial/indicators";
  TUTORIAL_INDICATORS_SUPPRESS: "/tutorial/indicators/suppress";
  TUTORIAL_INDICATOR: <I extends string>(id: I) => `/tutorial/indicators/${I}`;
  USERS: "/users";
  ME: "/users/@me";
  GRAVITY_ATTACHMENTS: "/users/@me/gravity-attachments";
  GRAVITY_ATTACHMENTS_UPLOAD: "/users/@me/gravity-attachments-upload";
  GRAVITY_ITEMS_DEHYDRATED: "/users/@me/gravity-icymi";
  GRAVITY_ITEMS_DEHYDRATED_LEGACY: "/users/@me/gravity-icymi-legacy";
  GRAVITY_RECOMMENDED_GUILDS: "/gravity-recommended-guilds";
  GRAVITY_ITEMS_NEGATIVE: "/users/@me/gravity-icymi-negative";
  GRAVITY_ITEMS_HYDRATE: "/gravity-content";
  GRAVITY_CUSTOM_GUILD_SCORES: "/gravity-custom-guild-score";
  GRAVITY_CUSTOM_SCORES: "/gravity-custom-channel-scores";
  GRAVITY_JOIN_GUILD: "/guilds/gravity-join";
  GRAVITY_TOPIC_GUILDS: "/gravity-topic-guilds";
  POMELO_SUGGESTIONS: "/users/@me/pomelo-suggestions";
  POMELO_SUGGESTIONS_UNAUTHED: "/unique-username/username-suggestions-unauthed";
  POMELO_ATTEMPT: "/users/@me/pomelo-attempt";
  POMELO_ATTEMPT_UNAUTHED: "/unique-username/username-attempt-unauthed";
  POMELO_CREATE: "/users/@me/pomelo";
  DELETE_ACCOUNT: "/users/@me/delete";
  DISABLE_ACCOUNT: "/users/@me/disable";
  DEVICES: "/users/@me/devices";
  DEVICES_SYNC_TOKEN: "/users/@me/devices/sync-token";
  DEVICES_SYNC: "/users/@me/devices/sync";
  SETTINGS: "/users/@me/settings";
  SETTINGS_CONSENT: "/users/@me/consent";
  PHONE: "/users/@me/phone";
  PHONE_VERIFY_NO_PASSWORD: "/users/@me/phone/verify";
  PHONE_REVERIFY: "/users/@me/phone/reverify";
  FRIEND_INVITES: "/users/@me/invites";
  VERIFY_PHONE: "/phone-verifications/verify";
  VERIFY_PHONE_FOR_TICKET: "/phone-verifications/validate-support-ticket";
  RESEND_PHONE: "/phone-verifications/resend";
  CONNECTIONS: "/users/@me/connections";
  CONNECTIONS_AUTHORIZE: <I extends string>(id: I) => `/connections/${I}/authorize`;
  CONNECTIONS_SESSION_HANDOFF: <I extends string>(id: I) => `/connections/${I}/callback/session-handoff`;
  CONNECTIONS_CALLBACK: <I extends string>(id: I) => `/connections/${I}/callback`;
  CONNECTION: <C extends string, I extends string>(connection: C, id: I) => `/users/@me/connections/${C}/${I}`;
  CONNECTION_REFRESH: <C extends string, I extends string>(
    connection: C,
    id: I
  ) => `/users/@me/connections/${C}/${I}/refresh`;
  CONNECTION_SYNC_CONTACTS: "/users/@me/connections/contacts/@me/external-friend-list-entries";
  CONNECTION_ACCESS_TOKEN: <C extends string, I extends string>(
    connection: C,
    id: I
  ) => `/users/@me/connections/${C}/${I}/access-token`;
  CONNECTIONS_LINK_DISPATCH_AUTH_CALLBACK: <I extends string>(id: I) => `/connections/${I}/link-dispatch-auth-callback`;
  XBOX_HANDOFF: "/consoles/xbox-handoff";
  NOTES: "/users/@me/notes";
  NOTE: <I extends string>(id: I) => `/users/@me/notes/${I}`;
  MENTIONS: "/users/@me/mentions";
  MENTIONS_MESSAGE_ID: <I extends string>(id: I) => `/users/@me/mentions/${I}`;
  CAPTCHA: "/users/@me/captcha/verify";
  CAPTCHA_TEST: "/captcha/decider";
  AGE_ASSURANCE_TEST: "/age-verification/test";
  EXPERIMENTS: "/experiments";
  LOGIN: "/auth/login";
  LOGIN_MFA: <I extends string>(id: I) => `/auth/mfa/${I}`;
  LOGIN_SMS_SEND: "/auth/mfa/sms/send";
  REMOTE_AUTH_INITIALIZE: "/users/@me/remote-auth";
  REMOTE_AUTH_CANCEL: "/users/@me/remote-auth/cancel";
  REMOTE_AUTH_LOGIN: "/users/@me/remote-auth/login";
  REMOTE_AUTH_FINISH: "/users/@me/remote-auth/finish";
  LOGOUT: "/auth/logout";
  REGISTER: "/auth/register";
  REGISTER_PHONE: "/auth/register/phone";
  MFA_WEBAUTHN_CREDENTIALS: "/users/@me/mfa/webauthn/credentials";
  WEBAUTHN_CONDITIONAL_UI_CHALLENGE: "/auth/conditional/start";
  WEBAUTHN_CONDITIONAL_UI_LOGIN: "/auth/conditional/finish";
  WEBAUTHN_PASSWORDLESS_CHALLENGE: "/auth/passwordless/start";
  MFA_WEBAUTHN_CREDENTIAL: <I extends string>(id: I) => `/users/@me/mfa/webauthn/credentials/${I}`;
  INVITE: <I extends string>(id: I) => `/invites/${I}`;
  UNRESOLVED_GUILD_TEMPLATE: <I extends string>(id: I) => `/guilds/templates/${I}`;
  GUILD_TEMPLATES: <G extends string>(guildId: G) => `/guilds/${G}/templates`;
  GUILD_TEMPLATE: <G extends string, T extends string>(guildId: G, templateId: T) => `/guilds/${G}/templates/${T}`;
  TRACK: "/science";
  METRICS: "/metrics";
  METRICS_V2: "/metrics/v2";
  SSO: "/sso";
  SSO_TOKEN: "/sso-token";
  VERIFY: "/auth/verify";
  AUTHORIZE_IP: "/auth/authorize-ip";
  AUTHORIZE_PAYMENT: "/billing/verify-purchase-request";
  VERIFY_RESEND: "/auth/verify/resend";
  FORGOT_PASSWORD: "/auth/forgot";
  RESET_PASSWORD: "/auth/reset";
  REGIONS: <G>(guildId?: G) => G extends string ? `/guilds/${G}/regions` : "/voice/regions";
  DEBUG_LOG: <I extends string, II extends string>(id: I, id2: II) => `/debug-logs/${I}/${II}`;
  DEBUG_LOGS: <I extends string>(id: I) => `/debug-logs/multi/${I}`;
  REPORT_V2: "/reports";
  STAGE_REPORT: <C extends string, M extends string>(
    channelId: C,
    messageId: M
  ) => `/reports/channels/${C}/messages/${M}`;
  REPORT_OPTIONS: "/report/options";
  INTEGRATIONS: "/integrations";
  INTEGRATION_JOIN: <I extends string>(id: I) => `/integrations/${I}/join`;
  INTEGRATION_SEARCH: <I extends string>(id: I) => `/integrations/${I}/search`;
  INTEGRATION_APPLICATION_IDS_FOR_MY_GUILDS: "/users/@me/guilds/integration-application-ids";
  USER_GUILD_SETTINGS_BULK: "/users/@me/guilds/settings";
  USER_GUILD_SETTINGS: <I extends string>(id: I) => `/users/@me/guilds/${I}/settings`;
  APPLICATIONS_DETECTABLE: "/applications/detectable";
  APPLICATIONS_GAMES_SUPPLEMENTAL: "/applications/games-supplemental";
  APPLICATION_ICON: <A extends string, I extends string>(appId: A, icon: I) => `/applications/${A}/app-icons/${I}.png`;
  APPLICATION_RPC: <I extends string>(id: I) => `/oauth2/applications/${I}/rpc`;
  APPLICATION_ASSETS: <I extends string>(id: I) => `/oauth2/applications/${I}/assets`;
  APPLICATION_EXTERNAL_ASSETS: <I extends string>(id: I) => `/applications/${I}/external-assets`;
  OWNED_APPLICATION_BRANCHES: <I extends string>(id: I) => `/applications/${I}/branches`;
  OAUTH2_AUTHORIZE: "/oauth2/authorize";
  OAUTH2_AUTHORIZE_SAMSUNG: "/oauth2/samsung/authorize";
  OAUTH2_AUTHORIZE_SAMSUNG_CALLBACK: "/oauth2/samsung/authorize/callback";
  OAUTH2_AUTHORIZE_WEBHOOK_CHANNELS: "/oauth2/authorize/webhook-channels";
  OAUTH2_CURRENT_AUTH: "/oauth2/@me";
  OAUTH2_TOKENS: "/oauth2/tokens";
  OAUTH2_TOKEN: <I extends string>(id: I) => `/oauth2/tokens/${I}`;
  OAUTH2_WHITELIST_ACCEPT: "/oauth2/allowlist/accept";
  OAUTH2_DEVICE_VERIFY: "/oauth2/device/verify";
  OAUTH2_DEVICE_FINISH: "/oauth2/device/finish";
  MFA_TOTP_ENABLE: "/users/@me/mfa/totp/enable";
  MFA_TOTP_ENABLE_VERIFY: "/users/@me/mfa/totp/enable/verify";
  MFA_TOTP_ENABLE_RESEND: "/users/@me/mfa/totp/enable/resend";
  MFA_TOTP_DISABLE: "/users/@me/mfa/totp/disable";
  MFA_SMS_ENABLE: "/users/@me/mfa/sms/enable";
  MFA_SMS_DISABLE: "/users/@me/mfa/sms/disable";
  MFA_CODES_VERIFICATION: "/users/@me/mfa/codes-verification";
  MFA_SEND_VERIFICATION_KEY: "/auth/verify/view-backup-codes-challenge";
  CALL: <C extends string>(channelId: C) => `/channels/${C}/call`;
  CALL_RING: <C extends string>(channelId: C) => `/channels/${C}/call/ring`;
  CALL_STOP_RINGING: <C extends string>(channelId: C) => `/channels/${C}/call/stop-ringing`;
  DISABLE_EMAIL_NOTIFICATIONS: "/users/disable-email-notifications";
  DISABLE_SERVER_HIGHLIGHT_NOTIFICATIONS: "/users/disable-server-highlight-notifications";
  CHANNEL_WEBHOOKS: <C extends string>(channelId: C) => `/channels/${C}/webhooks`;
  GUILD_WEBHOOKS: <G extends string>(guildId: G) => `/guilds/${G}/webhooks`;
  WEBHOOK: <I extends string>(id: I) => `/webhooks/${I}`;
  WEBHOOK_INTEGRATION: <W extends string, T extends string>(webhookId: W, token: T) => `/webhooks/${W}/${T}`;
  REACTIONS: <C extends string, M extends string, R extends string>(
    channelId: C,
    messageId: M,
    reaction: R
  ) => `/channels/${C}/messages/${M}/reactions/${R}`;
  REMOVE_REACTIONS: <C extends string, M extends string>(
    channelId: C,
    messageId: M
  ) => `/channels/${C}/messages/${M}/reactions`;
  REMOVE_EMOJI_REACTIONS: <C extends string, M extends string, R extends string>(
    channelId: C,
    messageId: M,
    reaction: R
  ) => `/channels/${C}/messages/${M}/reactions/${R}`;
  REACTION: <C extends string, M extends string, R extends string, U extends string>(
    channelId: C,
    messageId: M,
    reaction: R,
    userId: U
  ) => `/channels/${C}/messages/${M}/reactions/${R}/${U}`;
  REACTION_WITH_TYPE: <C extends string, M extends string, R extends string, U extends string, T extends string>(
    channelId: C,
    messageId: M,
    reaction: R,
    userId: U,
    type: T
  ) => `/channels/${C}/messages/${M}/reactions/${R}/${U}/${T}`;
  SEARCH_GUILD: <G extends string>(guildId: G) => `/guilds/${G}/messages/search`;
  SEARCH_FAVORITES: "/search/favorites";
  SEARCH_TABS_GUILD: <G extends string>(guildId: G) => `/guilds/${G}/messages/search/tabs`;
  SEARCH_DMS: "/users/@me/messages/search";
  SEARCH_TABS_DMS: "/users/@me/messages/search/tabs";
  CHANGELOG_MESSAGES: "/changelogs/@me/messages";
  GUILD_APPLICATIONS: <G extends string>(guildId: G) => `/guilds/${G}/applications`;
  APPLIED_GUILD_BOOSTS_FOR_GUILD: <G extends string>(guildId: G) => `/guilds/${G}/premium/subscriptions`;
  APPLIED_GUILD_BOOST: <G extends string, U extends string>(
    guildId: G,
    userId: U
  ) => `/guilds/${G}/premium/subscriptions/${U}`;
  APPLIED_GUILD_BOOST_COOLDOWN: "/users/@me/guilds/premium/subscriptions/cooldown";
  USER_APPLIED_GUILD_BOOSTS: "/users/@me/guilds/premium/subscriptions";
  USER_GUILD_BOOST_SLOTS: "/users/@me/guilds/premium/subscription-slots";
  USER_GUILD_BOOST_SLOT_CANCEL: <I extends string>(id: I) => `/users/@me/guilds/premium/subscription-slots/${I}/cancel`;
  USER_GUILD_BOOST_SLOT_UNCANCEL: <I extends string>(
    id: I
  ) => `/users/@me/guilds/premium/subscription-slots/${I}/uncancel`;
  SEARCH_CHANNEL: <C extends string>(channelId: C) => `/channels/${C}/messages/search`;
  SEARCH_TABS_CHANNEL: <C extends string>(channelId: C) => `/channels/${C}/messages/search/tabs`;
  BILLING_STRIPE_SETUP_INTENT_SECRET: "/users/@me/billing/stripe/setup-intents";
  BILLING_ADYEN_PAYMENT_METHODS: "/users/@me/billing/adyen/payment-methods";
  BILLING_PAYMENT_SOURCES: "/users/@me/billing/payment-sources";
  BILLING_PAYMENT_SOURCES_VALIDATE_BILLING_ADDRESS: "/users/@me/billing/payment-sources/validate-billing-address";
  BILLING_PAYMENT_SOURCE: <I extends string>(id: I) => `/users/@me/billing/payment-sources/${I}`;
  BILLING_PAYMENTS: "/users/@me/billing/payments";
  BILLING_PAYMENT: <I extends string>(id: I) => `/users/@me/billing/payments/${I}`;
  BILLING_PAYMENTS_VOID: <I extends string>(id: I) => `/users/@me/billing/payments/${I}/void`;
  BILLING_PAYMENTS_REFUND: <I extends string>(id: I) => `/users/@me/billing/payments/${I}/refund`;
  BILLING_INVOICE_PDF: "/users/@me/billing/invoice";
  BILLING_INVOICE_BREAKDOWN: "/users/@me/billing/invoice/breakdown";
  BILLING_STRIPE_PAYMENT_INTENTS: <I extends string>(
    id: I
  ) => `/users/@me/billing/stripe/payment-intents/payments/${I}`;
  BILLING_STRIPE_PAYMENT_INTENTS_VIA_ID: <I extends string>(id: I) => `/users/@me/billing/stripe/payment-intents/${I}`;
  BILLING_STANDALONE_CHECKOUT_PAGE: <P extends string, G extends string, I extends string, T>(
    planId: P,
    gift: G,
    loadId: I,
    type: T
  ) => `/billing/premium/subscribe?plan_id=${P}&gift=${G}&load_id=${I}${T extends string ? `&payment_method_type=${T}` : ""}`;
  BILLING_STANDALONE_CHECKOUT_LOGIN_HANDOFF: <K extends string, T extends string, D extends string>(
    key: K,
    token: T,
    dest: D
  ) => `//discord.com/billing/premium/subscribe/login-handoff?handoff_key=${K}&handoff_token=${T}&destination=${D}`;
  BILLING_PAYPAL_BILLING_AGREEMENT_TOKENS: "/users/@me/billing/paypal/billing-agreement-tokens";
  BILLING_POPUP_BRIDGE: <I extends string>(id: I) => `/billing/popup-bridge/${I}`;
  BILLING_POPUP_BRIDGE_CALLBACK: <I extends string>(id: I) => `/billing/popup-bridge/${I}/callback`;
  BILLING_POPUP_BRIDGE_CALLBACK_REDIRECT_PREFIX: <I extends string, C extends string, R>(
    id: I,
    callback: C,
    redirect?: R
  ) => `/billing/popup-bridge/${I}/callback/${C}/${R extends string ? R : ""}`;
  BILLING_SUBSCRIPTIONS: "/users/@me/billing/subscriptions";
  BILLING_PERKS_RELEVANCE: "/users/@me/billing/perks-relevance";
  BILLING_NITRO_AFFINITY: "/users/@me/billing/nitro-affinity";
  BILLING_SUBSCRIPTIONS_PREVIEW: "/users/@me/billing/subscriptions/preview";
  BILLING_APPLY_APPLE_RECEIPT: "/billing/apple/apply-receipt";
  BILLING_APPLE_SUBSCRIPTION: <I extends string>(id: I) => `/billing/apple/subscriptions/${I}`;
  BILLING_GENERATE_APPLE_TRIAL_OFFER_SIGNATURE: "/users/@me/billing/apple/trial-offer-signature";
  BILLING_CREATE_APPLE_IAP_JWT_TOKEN: "/billing/apple/jwt-token";
  BILLING_SUBSCRIPTION: <I extends string>(id: I) => `/users/@me/billing/subscriptions/${I}`;
  BILLING_SUBSCRIPTION_PREVIEW: <I extends string>(id: I) => `/users/@me/billing/subscriptions/${I}/preview`;
  BILLING_SUBSCRIPTION_INVOICE: <I extends string>(id: I) => `/users/@me/billing/subscriptions/${I}/invoices`;
  BILLING_INVOICE_MANUAL_PAYMENT: <S extends string, I extends string>(
    subscription: S,
    invoice: I
  ) => `/users/@me/billing/subscriptions/${S}/invoices/${I}/pay`;
  BILLING_COUNTRY_CODE: "/users/@me/billing/country-code";
  BILLING_LOCALIZED_PROMO: "/users/@me/billing/localized-pricing-promo";
  VERIFY_PURCHASE: "/google-play/verify-purchase-token";
  DOWNGRADE_SUBSCRIPTION: "/google-play/downgrade-subscription";
  GOOGLE_PLAY_VALIDATE_PURCHASE: "/google-play/validate-purchase";
  USER_AGREEMENTS: "/users/@me/agreements";
  HANDOFF: "/auth/handoff";
  HANDOFF_EXCHANGE: "/auth/handoff/exchange";
  LIBRARY: "/users/@me/library";
  LIBRARY_APPLICATION_BRANCH: <I extends string, B extends string>(id: I, branch: B) => `/users/@me/library/${I}/${B}`;
  LIBRARY_APPLICATION_DELETE: <I extends string>(id: I) => `/users/@me/library/${I}`;
  AUTH_LOCATION_METADATA: "/auth/location-metadata";
  USER_HARVEST: "/users/@me/harvest";
  APPLICATION_LIVE_BUILD: <I extends string, B extends string>(
    id: I,
    branch: B
  ) => `/applications/${I}/branches/${B}/builds/live`;
  APPLICATION_BUILD_SIZE: <I extends string, B extends string, BB extends string>(
    id: I,
    branch: B,
    build: BB
  ) => `/applications/${I}/branches/${B}/builds/${BB}/size`;
  APPLICATION_BRANCHES: "/branches";
  APPLICATION_PUBLIC: <I extends string>(id: I) => `/applications/${I}/public`;
  APPLICATIONS_PUBLIC: "/applications/public";
  APPLICATIONS_TRENDING: "/applications/trending/global";
  APPLICATION_BRANCH_LIST: <I extends string>(id: I) => `/applications/${I}/branches`;
  LIBRARY_APPLICATION_INSTALLED: <I extends string, II extends string>(
    id: I,
    id2: II
  ) => `/users/@me/library/${I}/${II}/installed`;
  STOREFRONT_PREMIUM_BUTTON: <I extends string>(id: I) => `/applications/storefront/interactions/premium-button/${I}`;
  STORE_DIRECTORY_LAYOUT: <I extends string>(id: I) => `/store/directory-layouts/${I}`;
  STORE_DIRECTORY: <I extends string>(id: I) => `/store/directory/${I}`;
  STORE_EMAIL_RESEND_PAYMENT_VERIFICATION: "/store/email/resend-payment-verification";
  STORE_PUBLISHED_LISTINGS_APPLICATIONS: "/store/published-listings/applications";
  STORE_PUBLISHED_LISTINGS_APPLICATION: <I extends string>(id: I) => `/store/published-listings/applications/${I}`;
  STORE_PUBLISHED_LISTINGS_SKUS: "/store/published-listings/skus";
  STORE_PUBLISHED_LISTINGS_SKU: <I extends string>(id: I) => `/store/published-listings/skus/${I}`;
  STORE_PUBLISHED_LISTINGS_SKU_JOIN_GUILD: <I extends string>(
    id: I
  ) => `/store/published-listings/skus/${I}/guild/join`;
  STORE_PUBLISHED_LISTINGS_SUBSCRIPTION_PLANS: <I extends string>(
    id: I
  ) => `/store/published-listings/skus/${I}/subscription-plans`;
  STORE_SKU: <I extends string>(id: I) => `/store/skus/${I}`;
  STORE_SKU_PURCHASE: <I extends string>(id: I) => `/store/skus/${I}/purchase`;
  STORE_LISTING: <I extends string>(id: I) => `/store/listings/${I}`;
  STORE_LISTINGS_SKU: <I extends string>(id: I) => `/store/skus/${I}/listings`;
  APPLICATION_SKUS: <I extends string>(id: I) => `/applications/${I}/skus`;
  STORE_EULA: <I extends string>(id: I) => `/store/eulas/${I}`;
  ENTITLEMENTS_FOR_APPLICATION: <I extends string>(id: I) => `/users/@me/applications/${I}/entitlements`;
  ENTITLEMENTS_FOR_USER: "/users/@me/entitlements";
  ENTITLEMENT_TICKET: <I extends string>(id: I) => `/users/@me/applications/${I}/entitlement-ticket`;
  APPLICATION_TICKET: <I extends string>(id: I) => `/users/@me/applications/${I}/ticket`;
  ENTITLEMENTS_GIFTABLE: "/users/@me/entitlements/gifts";
  STORE_ASSET: <I extends string, A extends string, E extends string>(
    id: I,
    asset: A,
    extension: E
  ) => `/store/applications/${I}/assets/${A}.${E}`;
  APPLICATION_ASSET: <I extends string, A extends string, E extends string>(
    id: I,
    asset: A,
    extension: E
  ) => `/applications/${I}/app-assets/${A}.${E}`;
  HYPESQUAD_ONLINE: "/hypesquad/online";
  APPLICATION_STORAGE: <I extends string, B extends string>(
    id: I,
    branch: B
  ) => `/applications/${I}/branches/${B}/storage`;
  APPLICATION_DISCLOSURES: <I extends string>(id: I) => `/applications/${I}/disclosures`;
  GIFS_SEARCH: "/gifs/search";
  GIFS_TRENDING: "/gifs/trending";
  GIFS_TRENDING_GIFS: "/gifs/trending-gifs";
  GIFS_SELECT: "/gifs/select";
  GIFS_SUGGEST: "/gifs/suggest";
  GIFS_TRENDING_SEARCH: "/gifs/trending-search";
  GIFT_CODE_RESOLVE: <I extends string>(id: I) => `/entitlements/gift-codes/${I}`;
  GIFT_CODE_REDEEM: <I extends string>(id: I) => `/entitlements/gift-codes/${I}/redeem`;
  PARTNER_PROMOTIONS: <I extends string>(id: I) => `/entitlements/partner-promotions/${I}`;
  USER_GIFT_CODE_CREATE: "/users/@me/entitlements/gift-codes";
  USER_GIFT_CODE_REVOKE: <I extends string>(id: I) => `/users/@me/entitlements/gift-codes/${I}`;
  USER_GIFT_CODES: "/users/@me/entitlements/gift-codes";
  USER_TRIAL_OFFER: "/users/@me/billing/user-trial-offer";
  USER_TRIAL_OFFER_ACKNOWLEDGED: <I extends string>(id: I) => `/users/@me/billing/user-trial-offer/${I}/ack`;
  USER_OFFER: "/users/@me/billing/user-offer";
  USER_OFFER_ACKNOWLEDGED: "/users/@me/billing/user-offer/ack";
  CHURN_USER_OFFER: "/users/@me/billing/churn-user-offer";
  USER_OFFER_REDEEM: "/users/@me/billing/user-offer/redeem";
  USER_PERKS_DEMOS: "/users/@me/perks-demos";
  USER_PERKS_DEMOS_ACTIVATE: <I extends string>(id: I) => `/users/@me/activate-perk-demo/${I}`;
  GUILD_DISCOVERY: "/discoverable-guilds";
  GUILD_DISCOVERY_SEARCH: "/discoverable-guilds/search";
  GUILD_DISCOVERY_CATEGORIES: "/discovery/categories";
  GUILD_DISCOVERY_SLUG: <I extends string>(id: I) => `/discovery/${I}`;
  GUILD_DISCOVERY_METADATA: <G extends string>(guildId: G) => `/guilds/${G}/discovery-metadata`;
  GUILD_DISCOVERY_UPDATE_CATEGORY: <G extends string, C extends string>(
    guildId: G,
    category: C
  ) => `/guilds/${G}/discovery-categories/${C}`;
  STREAM_PREVIEW: <I extends string>(id: I) => `/streams/${I}/preview`;
  STREAM_NOTIFY: <I extends string>(id: I) => `/streams/${I}/notify`;
  STREAM: <I extends string>(id: I) => `/streams/${I}/stream`;
  GUILD_PREVIEW: <G extends string>(guildId: G) => `/guilds/${G}/preview`;
  USER_AFFINITIES: "/users/@me/affinities/users";
  USER_AFFINITIES_V2: "/users/@me/affinities/v2/users";
  GUILD_AFFINITIES: "/users/@me/affinities/guilds";
  CHANNEL_AFFINITIES: "/users/@me/affinities/channels";
  FUNIMATION_PROMOTION: "/promotions/funimation";
  PARTNERS_CONNECTIONS: "/partners/connections";
  PARTNERS_APPLY: "/partners/apply";
  STICKER_PACK: <I extends string>(id: I) => `/sticker-packs/${I}`;
  STORE_DIRECTORY_LAYOUT_STICKER_PACKS: <I extends string>(id: I) => `/sticker-packs/directory-v2/${I}`;
  USER_STICKER_PACKS: "/users/@me/sticker-packs";
  STICKER_ASSET: <I extends string, E extends string>(id: I, extension: E) => `/stickers/${I}.${E}`;
  STICKER: <I extends string>(id: I) => `/stickers/${I}`;
  STICKER_PACKS: "/sticker-packs";
  GUILD_STICKER_PACKS: <G extends string>(guildId: G) => `/guilds/${G}/stickers`;
  GUILD_STICKER: <G extends string, S extends string>(guildId: G, stickerId: S) => `/guilds/${G}/stickers/${S}`;
  STICKER_GUILD_DATA: <I extends string>(id: I) => `/stickers/${I}/guild`;
  INTERACTIONS: "/interactions";
  MESSAGE_INTERACTION_DATA: <C extends string, M extends string>(
    channelId: C,
    messageId: M
  ) => `/channels/${C}/messages/${M}/interaction-data`;
  ACTIVITY_SHELF: "/activities/shelf";
  ACTIVITY_CHANNEL_LAUNCH: <A extends string, I extends string>(id: A, instance: I) => `/activities/${A}/${I}`;
  ACTIVITY_JOIN_INSTANCE: <A extends string, I extends string>(
    id: A,
    instance: I
  ) => `/activities/applications/${A}/activity-instances/${I}/join`;
  ACTIVITY_TEST_MODE: <I extends string>(id: I) => `/activities/${I}/test-mode`;
  ACTIVITY_LEAVE: <A extends string, AA extends string, I extends string>(
    id: A,
    activity: AA,
    instance: I
  ) => `/applications/${A}/activities/${AA}/instances/${I}/leave`;
  APPLICATION_UPLOAD_ATTACHMENT: <I extends string>(id: I) => `/applications/${I}/attachment`;
  CHANNEL_THREADS: <C extends string>(channelId: C) => `/channels/${C}/threads`;
  CHANNEL_MESSAGE_THREADS: <C extends string, M extends string>(
    channelId: C,
    messageId: M
  ) => `/channels/${C}/messages/${M}/threads`;
  CHANNEL_LINKED_LOBBY: <C extends string>(channelId: C) => `/channels/${C}/linked-lobby`;
  APPLICATION_BOT_GUILD_COMMAND_PERMISSIONS: <A extends string, G extends string, C extends string>(
    id: A,
    guildId: G,
    command: C
  ) => `/applications/${A}/guilds/${G}/commands/${C}/permissions`;
  UPDATE_VOICE_STATE: <G extends string, U extends string = "@me">(
    guildId: G,
    userId?: U
  ) => `/guilds/${G}/voice-states/${U}`;
  GET_REPORT_MENU: <I extends string>(id: I) => `/reporting/menu/${I}`;
  GET_UNAUTHENTICATED_REPORT_MENU: <I extends string>(id: I) => `/reporting/unauthenticated/menu/${I}`;
  SUBMIT_REPORT_MENU: <I extends string>(id: I) => `/reporting/${I}`;
  SUBMIT_UNAUTHENTICATED_REPORT_MENU: <I extends string>(id: I) => `/reporting/unauthenticated/${I}`;
  SEND_UNAUTHENTICATED_REPORT_PINCODE: <I extends string>(id: I) => `/reporting/unauthenticated/${I}/code`;
  VERIFY_UNAUTHENTICATED_REPORT: <I extends string>(id: I) => `/reporting/unauthenticated/${I}/verify`;
  DSA_EXPERIMENT_UNAUTHENTICATED: "/reporting/unauthenticated/experiment";
  SUBMIT_REPORT_SECOND_LOOK: "/reporting/review";
  STAGE_INSTANCES: "/stage-instances";
  STAGE_INSTANCES_EXTRA: "/stage-instances/extra";
  STAGE_INSTANCE: <I extends string>(id: I) => `/stage-instances/${I}`;
  USER_SURVEY: "/users/@me/survey";
  USER_SURVEY_SEEN: <I extends string>(id: I) => `/users/@me/survey/${I}/seen`;
  GUILD_EVENTS: "/guild-events";
  GUILD_EVENT: <G extends string, E extends string>(guildId: G, event: E) => `/guilds/${G}/scheduled-events/${E}`;
  GUILD_EVENT_IMAGE: <G extends string, I extends string, E extends string>(
    event: G,
    image: I,
    extension: E
  ) => `/guild-events/${G}/images/${I}.${E}`;
  GUILD_EVENTS_FOR_GUILD: <G extends string>(guildId: G) => `/guilds/${G}/scheduled-events`;
  GUILD_EVENT_USER_COUNTS: <G extends string, E extends string>(
    guildId: G,
    event: E
  ) => `/guilds/${G}/scheduled-events/${E}/users/counts`;
  GUILD_EVENT_USERS: <G extends string, E extends string, I>(
    guildId: G,
    event: E,
    id?: I
  ) => `/guilds/${G}/scheduled-events/${E}${I extends string ? `/${I}` : ""}/users`;
  USER_GUILD_EVENT: <G extends string, E extends string, I>(
    guildId: G,
    event: E,
    id?: I
  ) => `/guilds/${G}/scheduled-events/${E}${I extends string ? `/${I}` : ""}/users/@me`;
  USER_GUILD_EVENTS: "/users/@me/scheduled-events";
  GUILD_EVENT_EXCEPTIONS: <G extends string, E extends string>(
    guildId: G,
    event: E
  ) => `/guilds/${G}/scheduled-events/${E}/exceptions`;
  GUILD_EVENT_EXCEPTION: <G extends string, E extends string, I extends string>(
    guildId: G,
    event: E,
    exception: I
  ) => `/guilds/${G}/scheduled-events/${E}/exceptions/${I}`;
  MEMBER_SAFETY_SUPPLEMENTAL: <G extends string>(guildId: G) => `/guilds/${G}/members/supplemental`;
  GUILD_MEMBER_SEARCH: <G extends string>(guildId: G) => `/guilds/${G}/members-search`;
  GUILD_AUTOMOD_RULES: <G extends string>(guildId: G) => `/guilds/${G}/auto-moderation/rules`;
  GUILD_AUTOMOD_RULE: <G extends string, R extends string>(
    guildId: G,
    rule: R
  ) => `/guilds/${G}/auto-moderation/rules/${R}`;
  GUILD_AUTOMOD_VALIDATE_RULE: <G extends string>(guildId: G) => `/guilds/${G}/auto-moderation/rules/validate`;
  GUILD_AUTOMOD_CLEAR_MENTION_RAID: <G extends string>(guildId: G) => `/guilds/${G}/auto-moderation/clear-mention-raid`;
  GUILD_AUTOMOD_ALERT_ACTION: <G extends string>(guildId: G) => `/guilds/${G}/auto-moderation/alert-action`;
  GUILD_INCIDENT_ACTIONS: <G extends string>(guildId: G) => `/guilds/${G}/incident-actions`;
  GUILD_INCIDENT_REPORT_FALSE_ALARM: <G extends string>(guildId: G) => `/guilds/${G}/auto-moderation/false-alarm`;
  GUILD_INCIDENT_REPORT_RAID: <G extends string>(guildId: G) => `/guilds/${G}/auto-moderation/report-raid`;
  DIRECTORY_CHANNEL_ENTRIES: <C extends string>(channelId: C) => `/channels/${C}/directory-entries`;
  DIRECTORY_CHANNEL_ENTRY: <C extends string, E extends string>(
    channelId: C,
    entry: E
  ) => `/channels/${C}/directory-entry/${E}`;
  DIRECTORY_ENTRIES_SEARCH: <C extends string>(channelId: C) => `/channels/${C}/directory-entries/search`;
  DIRECTORY_CHANNEL_CATEGORY_COUNTS: <C extends string>(channelId: C) => `/channels/${C}/directory-entries/counts`;
  DIRECTORY_CHANNEL_LIST_BY_ID: <C extends string>(channelId: C) => `/channels/${C}/directory-entries/list`;
  DIRECTORY_ENTRIES_BROADCAST_INFO: <G extends string>(guildId: G) => `/guilds/${G}/directory-entries/broadcast`;
  PRICE_TIERS: "/store/price-tiers";
  TEAMS: "/teams";
  APPLICATIONS: "/applications";
  APPLICATIONS_WITH_ASSETS: "/applications-with-assets";
  APPLICATION_OWNER_TRANSFER: <I extends string>(id: I) => `/applications/${I}/transfer`;
  HUB_WAITLIST_SIGNUP: "/hub-waitlist/signup";
  HUB_EMAIL_VERIFY: "/guilds/automations/email-domain-lookup/verify";
  HUB_EMAIL_VERIFY_CODE: "/guilds/automations/email-domain-lookup/verify-code";
  OUTBOUND_PROMOTIONS: "/outbound-promotions";
  OUTBOUND_PROMOTIONS_PREVIEW: "/outbound-promotions/preview";
  BOGO_PROMOTIONS: "/bogo-promotions";
  CLAIMED_OUTBOUND_PROMOTION_CODES: "/users/@me/outbound-promotions/codes";
  CLAIM_OUTBOUND_PROMOTION_CODE: <I extends string>(id: I) => `/outbound-promotions/${I}/claim`;
  HUB_EMAIL_VERIFY_SEND: "/guilds/automations/email-domain-lookup";
  GUILD_PRODUCT_CREATE_ATTACHMENT_UPLOAD: <G extends string>(guildId: G) => `/guilds/${G}/products/attachments`;
  GUILD_ROLE_SUBSCRIPTIONS_SETTINGS: <G extends string>(guildId: G) => `/guilds/${G}/role-subscriptions/settings`;
  GUILD_ROLE_SUBSCRIPTION_GROUP_LISTINGS: <G extends string, I>(
    guildId: G,
    id?: I
  ) => `/guilds/${G}/role-subscriptions/group-listings${I extends string ? `/${I}` : ""}`;
  GUILD_ROLE_SUBSCRIPTION_LISTINGS: <G extends string, I extends string, S>(
    guildId: G,
    group: I,
    subscription?: S
  ) => `/guilds/${G}/role-subscriptions/group-listings/${I}/subscription-listings${S extends string ? `/${S}` : ""}`;
  GUILD_ROLE_SUBSCRIPTION_GROUP_LISTING_ARCHIVE: <G extends string, I extends string, S extends string>(
    guildId: G,
    group: I,
    subscription: S
  ) => `/guilds/${G}/role-subscriptions/group-listings/${I}/subscription-listings/${S}/archive`;
  GUILD_ROLE_SUBSCRIPTION_TRIALS: <G extends string>(guildId: G) => `/guilds/${G}/role-subscriptions/trials`;
  GUILD_ROLE_SUBSCRIPTION_LISTING_TRIAL: <G extends string, S extends string>(
    guildId: G,
    subscription: S
  ) => `/guilds/${G}/role-subscriptions/subscription-listings/${S}/trial`;
  GUILD_ROLE_SUBSCRIPTION_LISTING_TEMPLATES: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/role-subscriptions/templates`;
  CREATOR_MONETIZATION_ENABLE_REQUESTS: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/creator-monetization/enable-requests`;
  CREATOR_MONETIZATION_ELIGIBILITY: <G extends string>(guildId: G) => `/guilds/${G}/creator-monetization/requirements`;
  CREATOR_MONETIZATION_ACCEPT_TERMS: <G extends string, R extends string>(
    guildId: G,
    request: R
  ) => `/guilds/${G}/creator-monetization/enable-requests/${R}/accept-terms`;
  CREATOR_MONETIZATION_ACCEPT_TERMS_V2: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/creator-monetization/accept-terms`;
  CREATOR_MONETIZATION_RESTRICTIONS: <G extends string>(guildId: G) => `/guilds/${G}/creator-monetization/restrictions`;
  GUILD_ROLE_SUBSCRIPTION_TRIAL_ELIGIBILITY: <G extends string, S extends string, T extends string>(
    guildId: G,
    subscription: S,
    trial: T
  ) => `/guilds/${G}/role-subscriptions/subscription-listings/${S}/trial/${T}/eligibility`;
  CREATOR_MONETIZATION_MARKETING_ONBOARDING: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/creator-monetization/marketing/onboarding`;
  CREATOR_MONETIZATION_NAG_ACTIVATE_ELIGIBLITY: "/creator-monetization/marketing/nag-activate/eligibility";
  CREATOR_MONETIZATION_OWNERSHIP_TRANSFER_ONBOARD: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/creator-monetization/ownership-transfer/onboarding`;
  CREATOR_MONETIZATION_ACCEPT_NEW_TERMS: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/creator-monetization/accept-new-terms`;
  CREATOR_MONETIZATION_ACCEPT_NEW_TERMS_DEMONETIZED: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/creator-monetization/accept-new-terms-demonetized`;
  CREATOR_MONETIZATION_REMOVE_MONETIZATION: <G extends string>(
    guildId: G
  ) => `/guilds/${G}/creator-monetization/remove-monetization`;
  SUBSCRIPTION_PLAN_GROUP_LISTING: <I extends string>(id: I) => `/subscription-plans/${I}/subscription-group-listing`;
  SUBSCRIPTION_PLAN_GUILD_ROLE_GROUP_LISTING: <I extends string>(
    id: I
  ) => `/subscription-plans/${I}/guild-role-subscription-group-listing`;
  MEDIA_POST_RESHARE_GET_PREVIEW: <C extends string>(channelId: C) => `/channels/${C}/media-post-preview`;
  UNFURL_EMBED_URLS: "/unfurler/embed-urls";
  BUG_REPORTS: "/private/bug-reports";
  PAYMENT_PAYOUT_GROUPS: <I extends string>(id: I) => `/applications/${I}/payment-payout-groups`;
  GUILD_PRODUCTS: <G extends string>(guildId: G) => `/guilds/${G}/products`;
  GUILD_PRODUCT_LISTINGS: <G extends string, I>(
    guildId: G,
    id?: I
  ) => `/guilds/${G}/products/listings${I extends string ? `/${I}` : ""}`;
  GUILD_PRODUCT_ATTACHMENT_DOWNLOAD: <G extends string, I extends string, A extends string>(
    guildId: G,
    id: I,
    attachment: A
  ) => `/guilds/${G}/products/listings/${I}/attachments/${A}/download`;
  GUILD_CONVERT_TO_CLAN: <I extends string>(id: I) => `/clan/${I}`;
  GUILD_CLAN_DISCOVERY_INFO: <I extends string>(id: I) => `/discovery/${I}/clan`;
  GUILD_PROFILE: <G extends string>(guildId: G) => `/guilds/${G}/profile`;
  USER_SET_CLAN_IDENTITY: "/users/@me/clan";
  CLAN_SETTINGS: <I extends string>(id: I) => `/clan/${I}/settings`;
  DISABLE_CLAN: <I extends string>(id: I) => `/clan/${I}/disable`;
  TENOR_ASSET_PATH: "/tenor";
  EMAIL_SETTINGS: "/users/@me/email-settings";
  ACCOUNT_NOTIFICATION_SETTINGS: "/users/@me/notification-settings";
  VIDEO_FILTER_ASSETS: "/users/@me/video-filters/assets";
  VIDEO_FILTER_ASSET: <I extends string>(id: I) => `/users/@me/video-filters/assets/${I}`;
  VIDEO_FILTER_ASSET_LAST_USED: <I extends string>(id: I) => `/users/@me/video-filters/assets/${I}/last-used`;
  VIDEO_FILTER_ASSET_STORAGE: <U extends string, A extends string, H extends string, E extends string>(
    userId: U,
    asset: A,
    hash: H,
    extension: E
  ) => `/users/${U}/video-filter-assets/${A}/${H}.${E}`;
  GUILD_SOUNDBOARD_SOUNDS: <G extends string>(guildId: G) => `/guilds/${G}/soundboard-sounds`;
  GUILD_SOUNDBOARD_SOUND: <G extends string, S extends string>(
    guildId: G,
    sound: S
  ) => `/guilds/${G}/soundboard-sounds/${S}`;
  SOUNDBOARD_SOUND: <I extends string>(id: I) => `/soundboard-sounds/${I}`;
  SOUNDBOARD_SOUND_GUILD_DATA: <S extends string, G extends string>(
    sound: S,
    guildId: G
  ) => `/soundboard-sounds/${S}/guild/${G}`;
  SOUNDBOARD_DEFAULT_SOUNDS: "/soundboard-default-sounds";
  SEND_SOUNDBOARD_SOUND: <C extends string>(channelId: C) => `/channels/${C}/send-soundboard-sound`;
  APPLICATION_COMMANDS_SEARCH: <C extends string>(channelId: C) => `/channels/${C}/application-commands/search`;
  APPLICATION_COMMAND_INDEX_CHANNEL: <C extends string>(channelId: C) => `/channels/${C}/application-command-index`;
  APPLICATION_COMMAND_INDEX_GUILD: <G extends string>(guildId: G) => `/guilds/${G}/application-command-index`;
  APPLICATION_COMMAND_INDEX_USER: "/users/@me/application-command-index";
  APPLICATION_COMMAND_INDEX_APPLICATION: <I extends string>(id: I) => `/applications/${I}/application-command-index`;
  GUILD_COMMANDS_FOR_APPLICATION: <G extends string, A extends string>(
    guildId: G,
    appId: A
  ) => `/guilds/${G}/application-commands/${A}`;
  APPLICATION_DIRECTORY_APPLICATION: <I extends string>(id: I) => `/application-directory-static/applications/${I}`;
  APPLICATION_DIRECTORY_EMBED_APPLICATION: <I extends string>(
    id: I
  ) => `/application-directory/applications/${I}/embed`;
  APPLICATION_DIRECTORY_CATEGORIES: "/application-directory-static/categories";
  APPLICATION_DIRECTORY_SIMILAR: <I extends string>(id: I) => `/application-directory-static/applications/${I}/similar`;
  APPLICATION_DIRECTORY_SEARCH: "/application-directory-static/search";
  APPLICATION_DIRECTORY_COLLECTIONS: "/application-directory-static/collections";
  APPLICATION_DIRECTORY_COLLECTION_ITEM_IMAGE: <I extends string, H extends string, E extends string>(
    id: I,
    hash: H,
    extension: E
  ) => `/application-directory/collection-items/${I}/${H}.${E}`;
  APP_RECOMMENDATIONS: "/app-recommendations";
  GUILD_FEED: <G extends string>(guildId: G) => `/guilds/${G}/guild-feed`;
  USER_EMAIL: "/users/@me/email";
  USER_EMAIL_VERIFY_CODE: "/users/@me/email/verify-code";
  PREMIUM_USAGE: "/users/@me/premium-usage";
  ACTIVE_CHANNELS: <G extends string>(guildId: G) => `/guilds/${G}/active-channels`;
  NOTIF_CENTER_ITEMS: <I>(id?: I) => `/users/@me/notification-center/items${I extends string ? `/${I}` : ""}`;
  NOTIF_CENTER_ITEMS_ACK: <I extends string>(id: I) => `/users/@me/notification-center/items/${I}/ack`;
  NOTIF_CENTER_ITEMS_BULK_ACK: "/users/@me/notification-center/items/bulk-ack";
  NOTIFICATION_SNAPSHOTS: "/users/@me/notification-settings/snapshots";
  NOTIFICATION_SNAPSHOT: <I extends string>(id: I) => `/users/@me/notification-settings/snapshots/${I}`;
  RESTORE_NOTIFICATION_SNAPSHOT: <I extends string>(
    id: I
  ) => `/users/@me/notification-settings/snapshots/${I}/restore-guilds`;
  GUILD_ADMIN_SERVER_ELIGIBILITY: <G extends string>(guildId: G) => `/guilds/${G}/admin-server-eligibility`;
  JOIN_ADMIN_SERVER: <G extends string>(guildId: G) => `/guilds/${G}/join-admin-server`;
  AUTH_SESSIONS: "/auth/sessions";
  AUTH_SESSION_NOTIFICATIONS_DEBUG: "/auth/sessions/debug/notifications";
  AUTH_SESSIONS_LOGOUT: "/auth/sessions/logout";
  CUSTOM_CALL_SOUNDS: <C extends string>(channelId: C) => `/channels/${C}/custom-call-sounds`;
  VOICE_CHANNEL_EFFECTS: <C extends string>(channelId: C) => `/channels/${C}/voice-channel-effects`;
  APPLICATION_SUBSCRIPTION_GROUP_LISTING: <A extends string, I extends string>(
    appId: A,
    id: I
  ) => `/applications/${A}/subscription-group-listings/${I}`;
  GUILD_ENTITLEMENTS: <G extends string>(guildId: G) => `/guilds/${G}/entitlements`;
  GUILD_ROLE_CONNECTIONS_CONFIGURATION: <G extends string, R extends string>(
    guildId: G,
    roleId: R
  ) => `/guilds/${G}/roles/${R}/connections/configuration`;
  MESSAGE_REQUESTS_SUPPLEMENTAL_DATA: "/users/@me/message-requests/supplemental-data";
  CONNECT_REQUEST_CREATE: "/consoles/connect-request";
  CONNECT_REQUEST: <I extends string>(id: I) => `/consoles/connect-request/${I}`;
  CONSOLES_DEVICES: <I extends string>(id: I) => `/consoles/${I}/devices`;
  CONSOLES_DEVICES_COMMANDS: <C extends string, D extends string>(
    console: C,
    device: D
  ) => `/consoles/${C}/devices/${D}/commands`;
  CONSOLES_DEVICES_COMMAND: <C extends string, D extends string, I extends string>(
    console: C,
    device: D,
    command: I
  ) => `/consoles/${C}/devices/${D}/commands/${I}`;
  ELIGIBLE_APPLICATION_SUBSCRIPTION_GUILDS: "/users/@me/billing/eligible-application-subscription-guilds";
  APPLICATION_USER_ROLE_CONNECTIONS: "/users/@me/applications/role-connections";
  SHARED_CANVAS_LINES: <C extends string, I extends string>(
    channelId: C,
    id: I
  ) => `/channels/${C}/${I}/shared-canvas/lines`;
  SHARED_CANVAS_EMOJI_HOSES: <C extends string, I extends string>(
    channelId: C,
    id: I
  ) => `/channels/${C}/${I}/shared-canvas/emoji-hose`;
  SHARED_CANVAS_EMOJI_HOSE: <C extends string, I extends string, H extends string>(
    channelId: C,
    id: I,
    hose: H
  ) => `/channels/${C}/${I}/shared-canvas/emoji-hose/${H}`;
  BURST_CREDIT_BALANCE: "/users/@me/burst-credits";
  GET_SAVED_MESSAGES: "/users/@me/saved-messages";
  PUT_SAVED_MESSAGE: <C extends string, M extends string>(
    channelId: C,
    messageId: M
  ) => `/users/@me/saved-messages/${C}/${M}`;
  DELETE_SAVED_MESSAGE: <C extends string, M extends string>(
    channelId: C,
    messageId: M
  ) => `/users/@me/saved-messages/${C}/${M}`;
  GET_REFERRALS_REMAINING: "/users/@me/referrals/eligibility";
  GET_REFERRAL_ELIGIBLE_USERS: "/users/@me/referrals/eligible-users";
  GET_REFERRAL_INCENTIVE_ELIGIBILITY: "/users/@me/referrals/incentive-eligibility";
  CREATE_REFERRAL_PREVIEW: <I extends string>(id: I) => `/users/@me/referrals/${I}/preview`;
  CREATE_REFERRAL: <I extends string>(id: I) => `/users/@me/referrals/${I}`;
  FAMILY_CENTER_TEEN_ACTIVITY: <I extends string>(id: I) => `/family-center/${I}/activity`;
  FAMILY_CENTER_TEEN_ACTIVITY_ME: "/family-center/@me";
  FAMILY_CENTER_TEEN_ACTIVITY_MORE: <I extends string, II extends string, III extends string, IV extends string>(
    id: I,
    id2: II,
    id3: III,
    id4: IV
  ) => `/family-center/more-activity/${I}/${II}/${III}/${IV}`;
  FAMILY_CENTER_LINKED_USERS: "/users/@me/linked-users";
  FAMILY_CENTER_LINK_CODE: "/family-center/@me/link-code";
  FAMILY_CENTER_FETCH_TEEN_USER: <I extends string>(id: I) => `/family-center/teen-user/${I}`;
  REFERRAL_OFFER_ID_RESOLVE: <I extends string>(id: I) => `/referrals/${I}`;
  APPLICATIONS_SHELF: "/applications/shelf";
  DISCORDIFY_ME: "/users/@me/avatars/discordify";
  BADGE_ICON: <I extends string>(id: I) => `/badge-icons/${I}.png`;
  FINISH_MFA_CHECK: "/mfa/finish";
  CREATE_USER_OFFER: <U extends string, O extends string>(userId: U, offer: O) => `/user-offers/create/${O}/${U}`;
  DELETE_USER_OFFER: <U extends string, O extends string>(userId: U, offer: O) => `/user-offers/${O}/${U}`;
  UNACK_USER_OFFER: <U extends string, O extends string>(userId: U, offer: O) => `/user-offers/${O}/${U}/unack`;
  USER_OFFERS: "/user-offers";
  USER_OFFER_IDS: "/user-offer-ids";
  GUILD_MEMBERS_UNUSUAL_DM_ACTIVITY: <G extends string>(guildId: G) => `/guilds/${G}/members/unusual-dm-activity`;
  EMOJI_CAPTIONS_GET: "/users/@me/emoji-captions";
  SAFETY_HUB: "/safety-hub/@me";
  SAFETY_HUB_REQUEST_REVIEW: <I extends string>(id: I) => `/safety-hub/request-review/${I}`;
  SAFETY_HUB_REQUEST_SUSPENDED_USER_REVIEW: <I extends string>(id: I) => `/safety-hub/suspended/request-review/${I}`;
  SAFETY_HUB_SUSPENDED: "/safety-hub/suspended/@me";
  SAFETY_HUB_REQUEST_SUSPENDED_AGE_VERIFICATION: "/safety-hub/suspended/request-verification";
  SAFETY_HUB_CHECK_SUSPENDED_AGE_VERIFICATION: "/safety-hub/suspended/check-verification";
  INITIATE_CHANNEL_PROMPTS: "/initiate-prompts";
  FORCE_SEND_PROMPT: <I extends string>(id: I) => `/${I}/force-send-prompt`;
  EXPLICIT_MEDIA_REPORT_FALSE_POSITIVE: "/attachments/report-false-positive";
  EXPLICIT_MEDIA_SENDER_REPORT_FALSE_POSITIVE: "/attachments/sender-report-false-positive";
  SEND_GAMING_STATS: <I extends string>(id: I) => `/${I}/gaming-stats`;
  UPDATE_GAMING_STATS: <I extends string, II extends string>(id: I, id2: II) => `/${I}/${II}/update-gaming-stats`;
  BULK_GUILD_BAN: <G extends string>(guildId: G) => `/guilds/${G}/bulk-ban`;
  EXPLICIT_MEDIA_SCAN_MESSAGES: <C extends string>(channelId: C) => `/channels/${C}/explicit-media`;
  EXPLICIT_MEDIA_SCAN_MULTI_CHANNEL_MESSAGES: "/messages/explicit-media";
  POLL_ANSWERS: <C extends string, P extends string>(channelId: C, poll: P) => `/channels/${C}/polls/${P}/answers/@me`;
  POLL_EXPIRE: <C extends string, P extends string>(channelId: C, poll: P) => `/channels/${C}/polls/${P}/expire`;
  POLL_ANSWER_VOTERS: <C extends string, P extends string, A extends string>(
    channelId: C,
    poll: P,
    answer: A
  ) => `/channels/${C}/polls/${P}/answers/${A}`;
  PREMIUM_MARKETING: "/premium-marketing";
  QUESTS_CURRENT_QUESTS: "/quests/@me";
  QUESTS_CLAIMED_QUESTS: "/quests/@me/claimed";
  QUEST: <I extends string>(id: I) => `/quests/${I}`;
  QUESTS_ENROLL: <I extends string>(id: I) => `/quests/${I}/enroll`;
  QUEST_ON_CONSOLE_START: <I extends string>(id: I) => `/quests/${I}/console/start`;
  QUEST_ON_CONSOLE_STOP: <I extends string>(id: I) => `/quests/${I}/console/stop`;
  QUESTS_HEARTBEAT: <I extends string>(id: I) => `/quests/${I}/heartbeat`;
  QUESTS_VIDEO_PROGRESS: <I extends string>(id: I) => `/quests/${I}/video-progress`;
  QUESTS_REWARD_CODE: <I extends string>(id: I) => `/quests/${I}/reward-code`;
  QUESTS_CLAIM_REWARD: <I extends string>(id: I) => `/quests/${I}/claim-reward`;
  QUESTS_DISMISS_CONTENT: <I extends string, II extends string>(
    id: I,
    id2: II
  ) => `/quests/${I}/dismissible-content/${II}/dismiss`;
  QUESTS_PREVIEW_STATUS: <I extends string>(id: I) => `/quests/${I}/preview/status`;
  QUESTS_PREVIEW_DISMISSIBILITY: <I extends string>(id: I) => `/quests/${I}/preview/dismissibility`;
  QUESTS_PREVIEW_COMPLETE: <I extends string>(id: I) => `/quests/${I}/preview/complete`;
  QUEST_FETCH_QUEST_TO_DELIVER: <I extends string>(id: I) => `/quests/decision?placement=${I}`;
  ATTACHMENTS_REFRESH_URLS: "/attachments/refresh-urls";
  GAME_INVITE: <I extends string>(id: I) => `/game-invite/@me/${I}`;
  GAME_INVITES: "/game-invite/@me";
  ADD_SAFETY_WARNING: <C extends string>(channelId: C) => `/channels/${C}/add-safety-warning`;
  DELETE_SAFETY_WARNINGS: <C extends string>(channelId: C) => `/channels/${C}/safety-warnings`;
  SAFETY_WARNING_FALSE_POSITIVE: <C extends string>(
    channelId: C
  ) => `/channels/${C}/safety-warning/report-false-positive`;
  MY_CONTENT_INVENTORY: <I>(id?: I) => `/content-inventory/users/@me${I extends string ? `?refresh_token=${I}` : ""}`;
  CONTENT_INVENTORY_OUTBOX: <I extends string>(id: I) => `/content-inventory/users/${I}/outbox`;
  DELETE_MY_CONTENT_INVENTORY_OUTBOX_ENTRY_HISTORY: <I extends string>(
    id: I
  ) => `/content-inventory/users/@me/outbox/entries/id/${I}/history`;
  MY_SPOTIFY_CONTENT_INVENTORY: "/content-inventory/users/@me/spotify";
  MY_CONTENT_INVENTORY_APPLICATION: <I extends string>(id: I) => `/content-inventory/users/@me/applications/${I}`;
  TENURE_REWARD_SYNC: "/users/@me/tenure-reward/sync";
  STORE_LAYOUT: <I extends string>(id: I) => `/applications/${I}/store-layout`;
  CHECKOUT_RECOVERY: "/users/@me/billing/checkout-recovery";
  CAMPAIGN_CONTEXT: "/users/@me/billing/campaign-context";
  SIMILAR_GAMES: <I extends string>(id: I) => `/content-inventory/users/@me/similar-games/${I}`;
  VOICE_PUBLIC_KEYS: () => "/voice/public-keys";
  VOICE_MATCH_PUBLIC_KEY: <I extends string>(id: I) => `/voice/${I}/match-public-key`;
  ACCOUNT_REVERT: "/auth/revert";
  GUILD_LEADERBOARD: <G extends string, I extends string>(guildId: G, id: I) => `/guilds/${G}/leaderboards/${I}`;
  UPDATE_MY_LOL_LEADERBOARD: () => "/users/@me/update-league-of-legends-leaderboard";
  GUILD_LEADERBOARD_SETTINGS: <G extends string, I extends string>(
    guildId: G,
    id: I
  ) => `/guilds/${G}/leaderboards/${I}/settings`;
  VIRTUAL_CURRENCY_SKU_REDEEM: <I extends string>(id: I) => `/virtual-currency/skus/${I}/redeem`;
  VIRTUAL_CURRENCY_USER_BALANCE: "/users/@me/virtual-currency/balance";
  IGNORE_USER: <I extends string>(id: I) => `/users/@me/relationships/${I}/ignore`;
  SCHEDULED_MESSAGES: "/users/@me/scheduled-messages";
  SCHEDULED_MESSAGE: <I extends string>(id: I) => `/users/@me/scheduled-messages/${I}`;
};

export enum FriendSourceFlags {
  MUTUAL_FRIENDS = 2,
  MUTUAL_GUILDS = 4,
  NO_RELATION = 8
}

export enum MessageFlags {
  CROSSPOSTED = 1 << 0,
  IS_CROSSPOST = 1 << 1,
  SUPPRESS_EMBEDS = 1 << 2,
  SOURCE_MESSAGE_DELETED = 1 << 3,
  URGENT = 1 << 4,
  HAS_THREAD = 1 << 5,
  EPHEMERAL = 1 << 6,
  LOADING = 1 << 7,
  FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 1 << 8,
  GUILD_FEED_HIDDEN = 1 << 9,
  SHOULD_SHOW_LINK_NOT_DISCORD_WARNING = 1 << 10,
  SUPPRESS_NOTIFICATIONS = 1 << 12,
  IS_VOICE_MESSAGE = 1 << 13,
  HAS_SNAPSHOT = 1 << 14,
  IS_UIKIT_COMPONENTS = 1 << 15,
  SENT_BY_SOCIAL_LAYER_INTEGRATION = 1 << 16
}

export enum MessageTypes {
  DEFAULT,
  RECIPIENT_ADD,
  RECIPIENT_REMOVE,
  CALL,
  CHANNEL_NAME_CHANGE,
  CHANNEL_ICON_CHANGE,
  CHANNEL_PINNED_MESSAGE,
  USER_JOIN,
  GUILD_BOOST,
  GUILD_BOOST_TIER_1,
  GUILD_BOOST_TIER_2,
  GUILD_BOOST_TIER_3,
  CHANNEL_FOLLOW_ADD,
  GUILD_STREAM,
  GUILD_DISCOVERY_DISQUALIFIED,
  GUILD_DISCOVERY_REQUALIFIED,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING,
  THREAD_CREATED,
  REPLY,
  CHAT_INPUT_COMMAND,
  THREAD_STARTER_MESSAGE,
  GUILD_INVITE_REMINDER,
  CONTEXT_MENU_COMMAND,
  AUTO_MODERATION_ACTION,
  ROLE_SUBSCRIPTION_PURCHASE,
  INTERACTION_PREMIUM_UPSELL,
  STAGE_START,
  STAGE_END,
  STAGE_SPEAKER,
  STAGE_RAISE_HAND,
  STAGE_TOPIC,
  GUILD_APPLICATION_PREMIUM_SUBSCRIPTION,
  PRIVATE_CHANNEL_INTEGRATION_ADDED,
  PRIVATE_CHANNEL_INTEGRATION_REMOVED,
  PREMIUM_REFERRAL,
  GUILD_INCIDENT_ALERT_MODE_ENABLED,
  GUILD_INCIDENT_ALERT_MODE_DISABLED,
  GUILD_INCIDENT_REPORT_RAID,
  GUILD_INCIDENT_REPORT_FALSE_ALARM,
  GUILD_DEADCHAT_REVIVE_PROMPT,
  CUSTOM_GIFT,
  GUILD_GAMING_STATS_PROMPT,
  PURCHASE_NOTIFICATION,
  VOICE_HANGOUT_INVITE,
  POLL_RESULT,
  CHANGELOG,
  NITRO_NOTIFICATION,
  CHANNEL_LINKED_TO_LOBBY,
  GIFTING_PROMPT,
  IN_GAME_MESSAGE_NUX,
  GUILD_JOIN_REQUEST_ACCEPT_NOTIFICATION,
  GUILD_JOIN_REQUEST_REJECT_NOTIFICATION,
  GUILD_JOIN_REQUEST_WITHDRAWN_NOTIFICATION,
  HD_STREAMING_UPGRADED
}

export const Permissions = {
  CREATE_INSTANT_INVITE: 1n << 0n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_GUILD: 1n << 5n,
  CHANGE_NICKNAME: 1n << 26n,
  MANAGE_NICKNAMES: 1n << 27n,
  MANAGE_ROLES: 1n << 28n,
  MANAGE_WEBHOOKS: 1n << 29n,
  MANAGE_GUILD_EXPRESSIONS: 1n << 30n,
  CREATE_GUILD_EXPRESSIONS: 1n << 43n,
  VIEW_AUDIT_LOG: 1n << 7n,
  VIEW_CHANNEL: 1n << 10n,
  VIEW_GUILD_ANALYTICS: 1n << 19n,
  VIEW_CREATOR_MONETIZATION_ANALYTICS: 1n << 41n,
  MODERATE_MEMBERS: 1n << 40n,
  USE_EMBEDDED_ACTIVITIES: 1n << 39n,
  USE_EXTERNAL_APPS: 1n << 50n,
  SEND_MESSAGES: 1n << 11n,
  SEND_TTS_MESSAGES: 1n << 12n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  ADD_REACTIONS: 1n << 6n,
  USE_APPLICATION_COMMANDS: 1n << 31n,
  MANAGE_THREADS: 1n << 34n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  CREATE_PRIVATE_THREADS: 1n << 36n,
  USE_EXTERNAL_STICKERS: 1n << 37n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n,
  SEND_VOICE_MESSAGES: 1n << 46n,
  USE_CLYDE_AI: 1n << 47n,
  SEND_POLLS: 1n << 49n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  DEAFEN_MEMBERS: 1n << 23n,
  MOVE_MEMBERS: 1n << 24n,
  USE_VAD: 1n << 25n,
  PRIORITY_SPEAKER: 1n << 8n,
  STREAM: 1n << 9n,
  USE_SOUNDBOARD: 1n << 42n,
  USE_EXTERNAL_SOUNDS: 1n << 45n,
  SET_VOICE_CHANNEL_STATUS: 1n << 48n,
  REQUEST_TO_SPEAK: 1n << 32n,
  MANAGE_EVENTS: 1n << 33n,
  CREATE_EVENTS: 1n << 44n
};

export enum PlatformTypes {
  AMAZON_MUSIC = "amazon-music",
  BATTLENET = "battlenet",
  BLUESKY = "bluesky",
  BUNGIE = "bungie",
  CONTACTS = "contacts",
  CRUNCHYROLL = "crunchyroll",
  DOMAIN = "domain",
  EBAY = "ebay",
  EPIC_GAMES = "epicgames",
  FACEBOOK = "facebook",
  GITHUB = "github",
  INSTAGRAM = "instagram",
  LEAGUE_OF_LEGENDS = "leagueoflegends",
  MASTODON = "mastodon",
  PAYPAL = "paypal",
  PLAYSTATION = "playstation",
  PLAYSTATION_STAGING = "playstation-stg",
  REDDIT = "reddit",
  RIOT_GAMES = "riotgames",
  ROBLOX = "roblox",
  SAMSUNG = "samsung",
  SKYPE = "skype",
  SOUNDCLOUD = "soundcloud",
  SPOTIFY = "spotify",
  STEAM = "steam",
  TIKTOK = "tiktok",
  TWITCH = "twitch",
  TWITTER = "twitter",
  TWITTER_LEGACY = "twitter_legacy",
  XBOX = "xbox",
  YOUTUBE = "youtube"
}

export enum RelationshipTypes {
  BLOCKED = "BLOCKED",
  ENABLED = "ENABLED",
  NEVER = "NEVER"
}

export type Routes = {
  INDEX: "/";
  APP: "/app";
  APP_WITH_INVITE_AND_GUILD_ONBOARDING: <I extends string>(id: I) => `/app/invite-with-guild-onboarding/${I}`;
  ACTIVITY: "/activity";
  ACTIVITIES: "/activities";
  ACTIVITIES_HAPPENING_NOW: "/activities/happening-now";
  ACTIVITY_DETAILS: <I extends string>(id: I) => `/activities/${I}`;
  APPLICATION_LIBRARY: "/library";
  APPLICATION_LIBRARY_INVENTORY: "/library/inventory";
  APPLICATION_LIBRARY_ACTION: <I extends string, A extends string>(id: I, action: A) => `/library/${I}/${A}`;
  APPLICATION_LIBRARY_SETTINGS: "/library/settings";
  APPLICATION_STORE: "/store";
  APPLICATION_STORE_LISTING_SKU: <I extends string, A extends string>(
    id: I,
    action?: A
  ) => A extends string ? `/store/skus/${I}/${A}` : `/store/skus/${I}`;
  APPLICATION_STORE_LISTING_APPLICATION: <I extends string, A>(
    id: I,
    action?: A
  ) => A extends string ? `/store/applications/${I}/${A}` : `/store/applications/${I}`;
  BILLING_PREFIX: "/billing";
  BILLING_LOGIN_HANDOFF: "/billing/login/handoff";
  BILLING_PREMIUM_SUBSCRIBE: "/billing/premium/subscribe";
  BILLING_PAYMENT_SOURCES_CREATE: "/billing/payment-sources/create";
  BILLING_PREMIUM_SWITCH_PLAN: "/billing/premium/switch-plan";
  BILLING_GUILD_SUBSCRIPTIONS_PURCHASE: "/billing/guild-subscriptions/purchase";
  BILLING_PAYMENTS: "/billing/payments";
  BILLING_PROMOTION_REDEMPTION: <I extends string>(id: I) => `/billing/promotions/${I}`;
  BILLING_PROMOTION_REDEMPTION_GENERIC: "/billing/promotions";
  BILLING_PROMOTION_DIRECT_FULFILLMENT_REDEMPTION: <I extends string, II extends string>(
    id: I,
    id2: II
  ) => `/billing/partner-promotions/${I}/${II}`;
  NOTIFICATIONS: "/notifications";
  FRIENDS: "/channels/@me";
  ME: "/channels/@me";
  MESSAGE_REQUESTS: "/message-requests";
  CHANNEL: <C, I, G extends string = "@me">(
    guildId?: G,
    channelId?: C,
    id?: I
  ) => C extends string ? (I extends string ? `/channels/${G}/${C}/${I}` : `/channels/${G}/${C}`) : `/channels/${G}`;
  CHANNEL_THREAD_VIEW: <G extends string, C extends string, T extends string, I>(
    guildId: G,
    channelId: C,
    threadId: T,
    id?: I
  ) => I extends string ? `/channels/${G}/${C}/threads/${T}/${I}` : `/channels/${G}/${C}/threads/${T}`;
  VOICE_CHAT_CHANNEL_PARTIAL: <V extends string, I extends string, II>(
    voiceId: V,
    id: I,
    id2?: II
  ) => II extends string ? `/voice/${V}/${I}/${II}` : `/voice/${V}/${I}`;
  LOGIN: "/login";
  LOGIN_HANDOFF: "/login/handoff";
  REGISTER: "/register";
  DEFAULT_LOGGED_OUT: "/login";
  INVITE: <I extends string>(id: I) => `/invites/${I}`;
  INVITE_LOGIN: <I extends string>(id: I) => `/invite/${I}/login`;
  INVITE_REGISTER: <I extends string>(id: I) => `/invite/${I}/register`;
  INVITE_PROXY: <I extends string>(id: I) => `/invite-proxy/${I}`;
  GUILD_TEMPLATE: <I extends string>(id: I) => `/template/${I}`;
  GUILD_TEMPLATE_LOGIN: <I extends string>(id: I) => `/template/${I}/login`;
  GIFT_CODE: <I extends string>(id: I) => `/gifts/${I}`;
  GIFT_CODE_LOGIN: <I extends string>(id: I) => `/gifts/${I}/login`;
  WELCOME: <I, U extends string = "@me">(
    userId?: U,
    id?: I
  ) => I extends string ? `/welcome/${U}/${I}` : `/welcome/${U}`;
  VERIFY: "/verify";
  VERIFY_REQUEST: "/verify-request";
  RESET: "/reset";
  APPS: "/apps";
  ACTIVATE: "/activate";
  ACTIVATE_HANDOFF: "/activate/handoff";
  CONNECTION_LINK: <I extends string>(id: I) => `/connections/${I}/link`;
  CONNECTION_LINK_AUTHORIZE: <I extends string>(id: I) => `/connections/${I}/link-authorize`;
  CONNECTIONS_SUCCESS: <I extends string>(id: I) => `/connections/${I}/success`;
  CONNECTIONS_ERROR: <I extends string>(id: I) => `/connections/${I}/error`;
  CONNECTIONS: <I extends string>(id: I) => `/connections/${I}`;
  CONNECTIONS_AUTHORIZE_CONTINUE: <I extends string>(id: I) => `/connections/${I}/authorize-continue`;
  CONNECT_AUTHORIZE: "/connect/authorize";
  OAUTH2_AUTHORIZE: "/oauth2/authorize";
  OAUTH2_AUTHORIZED: "/oauth2/authorized";
  OAUTH2_ERROR: "/oauth2/error";
  SETTINGS: <I extends string, II>(one: I, two?: II) => II extends string ? `/settings/${I}/${II}` : `/settings/${I}`;
  SNOWSGIVING: "/snowsgiving";
  CHANGELOGS: <I>(id: I) => I extends string ? `/settings/changelogs/${I}` : `/settings/changelogs`;
  USERS: <I extends string>(id: I) => `/users/${I}`;
  GUILD_CREATE: "/guilds/create";
  DISABLE_EMAIL_NOTIFICATIONS: "/disable-email-notifications";
  DISABLE_SERVER_HIGHLIGHT_NOTIFICATIONS: "/disable-server-highlight-notifications";
  USER_GUILD_NOTIFICATION_SETTINGS: <I extends string>(id: I) => `/guilds/${I}/notification-settings`;
  AUTHORIZE_IP: "/authorize-ip";
  REJECT_IP: "/reject-ip";
  REJECT_MFA: "/reject-mfa";
  AUTHORIZE_PAYMENT: "/authorize-payment";
  HANDOFF: "/handoff";
  DOMAIN_MIGRATION: "/domain-migration";
  XBOX_EDU: "/connections/xbox/intro";
  XBOX_PIN: "/connections/xbox/pin";
  DOWNLOAD_QR_CODE_REDIRECT: "/download-qr-code";
  BILLING_POPUP_BRIDGE_CALLBACK: "/billing/popup-bridge/callback";
  OAUTH2_WHITELIST_ACCEPT: "/oauth2/allowlist/accept";
  GUILD_DISCOVERY: "/guild-discovery";
  GLOBAL_DISCOVERY: "/discovery";
  QUEST_HOME: "/discovery/quests";
  GLOBAL_DISCOVERY_SERVERS: "/discovery/servers";
  GLOBAL_DISCOVERY_APPS: "/discovery/applications";
  GLOBAL_DISCOVERY_APPS_CATEGORY: <I extends string>(id: I) => `/discovery/applications/categories/${I}`;
  GLOBAL_DISCOVERY_APPS_PROFILE: <I extends string>(id: I) => `/discovery/applications/${I}`;
  GLOBAL_DISCOVERY_APPS_PROFILE_SECTION: <I extends string, II extends string>(
    one: I,
    two: II
  ) => `/discovery/applications/${I}/${II}`;
  GLOBAL_DISCOVERY_APPS_PROFILE_STORE_SKU: <I extends string, II extends string>(
    one: I,
    two: II
  ) => `/discovery/applications/${I}/store/${II}`;
  GLOBAL_DISCOVERY_APPS_SEARCH: "/discovery/applications/search";
  GUILD_MEMBER_VERIFICATION: <I extends string, II>(
    one: I,
    two?: II
  ) => II extends string ? `/member-verification/${I}/${II}` : `/member-verification/${I}`;
  GUILD_MEMBER_VERIFICATION_FOR_HUB: <I extends string, II>(
    one: I,
    two?: II
  ) => II extends string ? `/member-verification-for-hub/${I}/${II}` : `/member-verification-for-hub/${I}`;
  POPOUT_WINDOW: "/popout";
  UPCOMING_STAGES: <G extends string, I>(
    guildId: G,
    id?: I
  ) => I extends string ? `/guild-stages/${G}/${I}` : `/guild-stages/${G}`;
  VERIFY_HUB_EMAIL: "/verify-hub-email";
  OPEN_APP_FROM_EMAIL: "/open-app-from-email";
  BILLING_MANAGE_SUBSCRIPTION: "/billing/premium/manage";
  GUILD_BOOSTING_MARKETING: <G extends string>(guildId: G) => `/guilds/${G}/premium-guild-subscriptions`;
  GUILD_SETTINGS: <S, I, G extends string>(
    guildId: G,
    setting?: S,
    id?: I
  ) => S extends string
    ? I extends string
      ? `/guilds/${G}/settings/${S}/${I}`
      : `/guilds/${G}/settings/${S}`
    : `/guilds/${G}/settings`;
  PICK_GUILD_SETTINGS: <S, I, F>(
    setting?: S,
    id?: I,
    feature?: F
  ) => S extends string
    ? I extends string
      ? `/guild/settings/${S}/${I}${F extends string ? `?feature=${F}` : ""}`
      : `/guild/settings/${S}${F extends string ? `?feature=${F}` : ""}`
    : `/guilds/settings${F extends string ? `?feature=${F}` : ""}`;
  GUILD_EVENT_DETAILS: <E extends string, I extends string, II>(
    event: E,
    id: I,
    id2?: II
  ) => II extends string ? `/events/${E}/${I}/${II}` : `/events/${E}/${I}`;
  FEATURE: <I extends string>(id: I) => `/feature/${I}`;
  GUILD_JOIN_REQUEST: <G extends string, I extends string>(guildId: G, id: I) => `/guilds/${G}/requests/${I}`;
  MOBILE_WEB_HANDOFF: "/mweb-handoff";
  APPLICATION_DIRECTORY: "/application-directory";
  APPLICATION_DIRECTORY_PROFILE: <I extends string>(id: I) => `/application-directory/${I}`;
  APPLICATION_DIRECTORY_PROFILE_SECTION: <I extends string, II extends string>(
    one: I,
    two: II
  ) => `/application-directory/${I}/${II}`;
  APPLICATION_DIRECTORY_PROFILE_STORE_SKU: <I extends string, II extends string>(
    one: I,
    two: II
  ) => `/application-directory/${I}/store/${II}`;
  APPLICATION_DIRECTORY_SEARCH: "/application-directory/search";
  FAMILY_CENTER: "/family-center";
  SERVER_SHOP: <G extends string>(guildId: G) => `/channels/${G}/shop`;
  GUILD_PRODUCT: <G extends string, I extends string>(guildId: G, id: I) => `/channels/${G}/shop/${I}`;
  REPORT: "/report";
  REPORT_SECOND_LOOK: "/report-review";
  COLLECTIBLES_SHOP: "/shop";
  COLLECTIBLES_SHOP_FULLSCREEN: "/shop/fullscreen";
  COLLECTIBLES_SHOP_PRODUCT_DETAIL: <I extends string>(id: I) => `/shop/product/${I}`;
  NITRO_HOME: "/store";
  ACCOUNT_STANDING: "/account-standing";
  CHANNEL_SUMMARIES: <G extends string>(guildId: G) => `/channels/${G}/summaries`;
  CHANNEL_SUMMARY: <G extends string, I extends string>(guildID: G, id: I) => `/channels/${G}/summaries/${I}`;
  USER_SUMMARIES: "/users/@me/summaries";
  QUESTS: <I extends string>(id: I) => `/quests/${I}`;
  ACCOUNT_REVERT: <I extends string>(id: I) => `/wasntme/${I}`;
};

export enum StatusTypes {
  DND = "dnd",
  IDLE = "idle",
  INVISIBLE = "invisible",
  OFFLINE = "offline",
  ONLINE = "online",
  STREAMING = "streaming",
  UNKNOWN = "unknown"
}

export enum SpoilerRenderSetting {
  ALWAYS = "ALWAYS",
  IF_MODERATOR = "IF_MODERATOR",
  ON_CLICK = "ON_CLICK"
}

export enum Themes {
  DARK = "dark",
  DARKER = "darker",
  LIGHT = "light",
  MIDNIGHT = "midnight"
}

export enum UserSettingsSections {
  ACCESSIBILITY = "Accessibility",
  ACCOUNT = "My Account",
  ACCOUNT_BACKUP_CODES = "Backup Codes",
  ACCOUNT_CHANGE_PASSWORD = "Change Password",
  ACCOUNT_CHANGE_USERNAME = "Change Username",
  ACCOUNT_CONFIRM_PASSWORD = "Confirm Password",
  ACCOUNT_CONFIRM_VIEW_BACKUP_CODES = "Backup Codes",
  ACCOUNT_STANDING = "Account Standing",
  ACTIVITY_PRIVACY = "Activity Privacy",
  ADVANCED = "Advanced",
  APPEARANCE = "Appearance",
  APPEARANCE_THEME_PICKER = "Appearance Theme Picker",
  APP_ICONS = "App Icons",
  AUTHORIZED_APPS = "Authorized Apps",
  BILLING = "Billing",
  BLOCKED_USERS = "Blocked Users",
  BLOCKED_USERS_V2 = "Blocked Users V2",
  BROWSER = "Browser",
  CHANGE_LOG = "Change Log",
  CHECK_NATIVE_UPDATE = "Check For Native Update",
  CLIPS = "Settings Clips",
  COLLECTIBLES_SHOP = "Shop",
  COLLECTIBLES_SHOP_VIEW_ALL_CATEGORY_ITEMS = "Collectibles Shop View All Category Items",
  COMMUNITY_ALERTS = "Community Alerts Settings",
  CONNECTIONS = "Connections",
  CONNECTIONS_XBOX = "Connections Xbox",
  CONTENT_AND_SOCIAL = "Content & Social",
  CUSTOM_STATUS = "Custom Status",
  CUSTOM_STATUS_EMOJI_PICKER = "Custom Status Emoji Picker",
  DATA = "Data",
  DATA_AND_PRIVACY = "Data & Privacy",
  DESIGN_SYSTEM = "Design System",
  DESIGN_SYSTEMS = "Design System",
  DESIGN_SYSTEM_ALERT_MODAL = "Design System (Alert Modal)",
  DESIGN_SYSTEM_BACKDROP = "Design Systems (Backdrop)",
  DESIGN_SYSTEM_BACKGROUND_BLUR_VIEW = "Design System (Background Blur View)",
  DESIGN_SYSTEM_BUTTON = "Design System (Button)",
  DESIGN_SYSTEM_BUTTON_GROUP = "Design System (Button Group)",
  DESIGN_SYSTEM_COACHMARK = "Design System (Coachmark)",
  DESIGN_SYSTEM_CONTEXT_MENU = "Design System (Context Menu)",
  DESIGN_SYSTEM_EXPERIMENTAL_BUTTONS = "Design System (Experimental Buttons)",
  DESIGN_SYSTEM_FORM_PRIMITIVES = "Design Systems (Form Primitives)",
  DESIGN_SYSTEM_MODAL = "Design System (Modal)",
  DESIGN_SYSTEM_PILE = "Design Systems (Pile)",
  DESIGN_SYSTEM_ROW_BUTTON = "Design System (Row Button)",
  DESIGN_SYSTEM_SEGMENTED_CONTROL = "Design System (Segmented Control)",
  DESIGN_SYSTEM_SHADOWS = "Design System (Shadows)",
  DESIGN_SYSTEM_SHEETS = "Design Systems (Sheets)",
  DESIGN_SYSTEM_STACK = "Design Systems (Stack)",
  DESIGN_SYSTEM_TABLE_ROW = "Design System (Table Row)",
  DESIGN_SYSTEM_TABS = "Design System (Tabs)",
  DESIGN_SYSTEM_TEXT = "Design System (Text)",
  DESIGN_SYSTEM_TEXT_INPUT = "Design System (Text Input)",
  DESIGN_SYSTEM_TOAST = "Design System (Toast)",
  DESIGN_SYSTEM_TOOLTIP = "Design System (Tooltip)",
  DESKTOP_APP = "Desktop Only",
  DEVELOPER_OPTIONS = "Developer Options",
  DISMISSIBLE_CONTENT_OPTIONS = "Dismissible Content Options",
  EMAILS = "Email Settings",
  EXPERIMENTS = "Experiments",
  FAMILY_CENTER = "Family Center",
  FRIEND_REQUESTS = "Friend Requests",
  GAMES = "Games",
  GUILD_BOOSTING = "Nitro Server Boost",
  GUILD_ROLE_SUBSCRIPTIONS = "Guild Role Subscription",
  GUILD_ROLE_SUBSCRIPTIONS_CANCEL = "Guild Role Subscription Cancel",
  HIGHLIGHT_NOTIFICATIONS = "Highlight notification settings",
  HOTSPOT_OPTIONS = "Hotspot Options",
  HYPESQUAD_ONLINE = "Hypesquad Online",
  IGNORED_USERS = "Ignored Users",
  INSTALL_NATIVE_UPDATE = "Install Native Build",
  INTL_TESTING = "Intl Testing",
  INVENTORY = "Library Inventory",
  KEYBINDS = "Keybinds",
  LINUX = "Linux",
  LOCALE = "Language",
  NOTIFICATIONS = "Notifications",
  OVERLAY = "Overlay",
  OVERVIEW = "Overview",
  PAYMENT_FLOW_MODAL_TEST_PAGE = "Payment Flow Modals",
  POGGERMODE = "Powermode Settings",
  PREMIUM = "Discord Nitro",
  PREMIUM_GIFTING = "Nitro Gifting",
  PREMIUM_MANAGE_PLAN = "Manage Nitro Plan",
  PREMIUM_PLAN_SELECT = "Discord Premium Plan Select",
  PRIVACY_AND_SAFETY = "Privacy & Safety",
  PROFILE_CUSTOMIZATION = "Profile Customization",
  PROFILE_CUSTOMIZATION_TRY_IT_OUT = "Profile Customization Try It Out",
  PROFILE_EFFECTS_PREVIEW_TOOL = "Profile Effects Preview Tool",
  QUESTS = "Quests",
  QUEST_PREVIEW_TOOL = "Quest Preview Tool",
  REGISTERED_GAMES = "Game Activity",
  REVENUE_STORYBOOK_PAGE = "Revenue Storybook",
  ROLE_SUBSCRIPTIONS = "Guild Role Subscription",
  SECURE_FRAMES = "Secure Frames",
  SECURE_FRAMES_VERIFIED_DEVICES = "Secure Frames Verified Devices",
  SESSIONS = "Sessions",
  SOUNDS = "Sounds",
  STREAMER_MODE = "Streamer Mode",
  SUBSCRIPTIONS = "Subscriptions",
  TEXT = "Text & Images",
  TEXT_COMPONENT = "Text Component",
  TEXT_PLAYGROUND = "Text Playground",
  TOWNHALL = "Townhall",
  VOICE = "Voice & Video",
  WEBAUTHN_VIEW = "View Security Keys",
  WEB_SETTING_TREE_TOOL = "Web Setting Tree Tool",
  WINDOWS = "Windows"
}

export enum UserFlags {
  STAFF = 1 << 0,
  PARTNER = 1 << 1,
  HYPESQUAD = 1 << 2,
  BUG_HUNTER_LEVEL_1 = 1 << 3,
  MFA_SMS = 1 << 4,
  PREMIUM_PROMO_DISMISSED = 1 << 5,
  HYPESQUAD_ONLINE_HOUSE_1 = 1 << 6,
  HYPESQUAD_ONLINE_HOUSE_2 = 1 << 7,
  HYPESQUAD_ONLINE_HOUSE_3 = 1 << 8,
  PREMIUM_EARLY_SUPPORTER = 1 << 9,
  HAS_UNREAD_URGENT_MESSAGES = 1 << 13,
  BUG_HUNTER_LEVEL_2 = 1 << 14,
  VERIFIED_BOT = 1 << 16,
  VERIFIED_DEVELOPER = 1 << 17,
  CERTIFIED_MODERATOR = 1 << 18,
  BOT_HTTP_INTERACTIONS = 1 << 19,
  SPAMMER = 1 << 20,
  DISABLE_PREMIUM = 1 << 21,
  ACTIVE_DEVELOPER = 1 << 22,
  PROVISIONAL_ACCOUNT = 1 << 23,
  QUARANTINED = 17592186044416, // 1 << 44
  COLLABORATOR = 0x4000000000000, // 1 << 50
  RESTRICTED_COLLABORATOR = 0x8000000000000 // 1 << 51
}

type Exports = {
  ActivityFlags: typeof ActivityFlags;
  ActivityTypes: typeof ActivityTypes;
  AnalyticsLocations: typeof AnalyticsLocations;
  ChannelLayouts: typeof ChannelLayouts;
  ChannelModes: typeof ChannelModes;
  ChannelTypes: typeof ChannelTypes;
  ChannelStreamTypes: typeof ChannelStreamTypes;
  ComponentActions: typeof ComponentActions;
  DEFAULT_ROLE_COLOR: DEFAULT_ROLE_COLOR;
  Endpoints: Endpoints;
  FriendSourceFlags: typeof FriendSourceFlags;
  MessageFlags: typeof MessageFlags;
  MessageTypes: typeof MessageTypes;
  Permissions: typeof Permissions;
  PlatformTypes: typeof PlatformTypes;
  RelationshipTypes: typeof RelationshipTypes;
  Routes: Routes;
  StatusTypes: typeof StatusTypes;
  SpoilerRenderSetting: typeof SpoilerRenderSetting;
  Themes: typeof Themes;
  UserSettingsSections: typeof UserSettingsSections;
  UserFlags: typeof UserFlags;
};
export default Exports;

register((moonmap) => {
  const name = "discord/Constants";
  moonmap.register({
    name,
    find: "/developers/docs/intro",
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "ActivityFlags", {
        type: ModuleExportType.Key,
        find: "PARTY_PRIVACY_VOICE_CHANNEL"
      });
      moonmap.addExport(name, "ActivityTypes", {
        type: ModuleExportType.Key,
        find: "CUSTOM_STATUS"
      });
      moonmap.addExport(name, "AnalyticsLocations", {
        type: ModuleExportType.Key,
        find: "APPLICATION_CONTEXT_MENU_TOGGLE_INSTALL"
      });
      moonmap.addExport(name, "ChannelLayouts", {
        type: ModuleExportType.Key,
        find: "NO_CHAT"
      });
      moonmap.addExport(name, "ChannelModes", {
        type: ModuleExportType.KeyValuePair,
        key: "VOICE",
        value: "voice"
      });
      moonmap.addExport(name, "ChannelStreamTypes", {
        type: ModuleExportType.Key,
        find: "FORUM_POST_ACTION_BAR"
      });
      moonmap.addExport(name, "ChannelTypes", {
        type: ModuleExportType.Key,
        find: "ANNOUNCEMENT_THREAD"
      });
      moonmap.addExport(name, "ComponentActions", {
        type: ModuleExportType.Key,
        find: "IFRAME_MOUNT"
      });
      moonmap.addExport(name, "DEFAULT_ROLE_COLOR", {
        type: ModuleExportType.Value,
        find: 10070709
      });
      moonmap.addExport(name, "Endpoints", {
        type: ModuleExportType.Value,
        find: "/channels"
      });
      moonmap.addExport(name, "FriendSourceFlags", {
        type: ModuleExportType.Key,
        find: "NO_RELATION"
      });
      moonmap.addExport(name, "MessageFlags", {
        type: ModuleExportType.Key,
        find: "CROSSPOSTED"
      });
      moonmap.addExport(name, "MessageTypes", {
        type: ModuleExportType.Key,
        find: "THREAD_STARTER_MESSAGE"
      });
      moonmap.addExport(name, "Permissions", {
        type: ModuleExportType.Key,
        find: "MANAGE_MESSAGES"
      });
      moonmap.addExport(name, "PlatformTypes", {
        type: ModuleExportType.Key,
        find: "LEAGUE_OF_LEGENDS"
      });
      moonmap.addExport(name, "RelationshipTypes", {
        type: ModuleExportType.Key,
        find: "BLOCKED"
      });
      moonmap.addExport(name, "Routes", {
        type: ModuleExportType.Key,
        find: "APPLICATION_LIBRARY_INVENTORY"
      });
      moonmap.addExport(name, "StatusTypes", {
        type: ModuleExportType.Key,
        find: "DND"
      });
      moonmap.addExport(name, "SpoilerRenderSetting", {
        type: ModuleExportType.Key,
        find: "IF_MODERATOR"
      });
      moonmap.addExport(name, "Themes", {
        type: ModuleExportType.Key,
        find: "MIDNIGHT"
      });
      moonmap.addExport(name, "UserSettingsSections", {
        type: ModuleExportType.Key,
        find: "CHANGE_LOG"
      });
      moonmap.addExport(name, "UserFlags", {
        type: ModuleExportType.Key,
        find: "SPAMMER"
      });

      return true;
    }
  });
});
