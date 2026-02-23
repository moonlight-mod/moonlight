import type { Patch } from "@moonlight-mod/types";

const notXssDefensesOnly = () =>
  (moonlight.getConfigOption<boolean>("quietLoggers", "xssDefensesOnly") ?? false) === false;

const silenceDiscordLogger = moonlight.getConfigOption<boolean>("quietLoggers", "silenceDiscordLogger") ?? false;

// These patches MUST run before the simple patches, these are to remove loggers
// that end up causing syntax errors by the normal patch
const loggerFixes: Patch[] = [
  {
    find: '"./gg-sans/ggsans-800-extrabolditalic.woff2":',
    replace: {
      match: /var .=Error.+?;throw .+?,./,
      replacement: ""
    }
  },
  {
    find: '("GatewaySocket")',
    replace: {
      match: /\i\.(log|info)\(/g,
      replacement: "(()=>{})("
    }
  },
  {
    find: '"_connect called with already existing websocket"',
    replace: {
      match: /\i\.(log|info|verbose)\(/g,
      replacement: "(()=>{})("
    }
  }
];
loggerFixes.forEach((patch) => {
  patch.prerequisite = notXssDefensesOnly;
});

// Patches to simply remove a logger call
const stubPatches = [
  // "sh" is not a valid locale.
  ["is not a valid locale", /void \i\.error\(""\.concat\(\i," is not a valid locale\."\)\)/g],
  ['"[BUILD INFO] Release Channel: "', /new \i\.Z\(\)\.log\("\[BUILD INFO\] Release Channel: ".+?\)\),/],
  ['.APP_NATIVE_CRASH,"Storage"', /console\.log\("AppCrashedFatalReport lastCrash:",\i,\i\);/],
  ['.APP_NATIVE_CRASH,"Storage"', 'void console.log("AppCrashedFatalReport: getLastCrash not supported.")'],
  ['"[NATIVE INFO] ', /new \i\.Z\(\)\.log\("\[NATIVE INFO] .+?\)\);/],
  ['"Spellchecker"', /\i\.info\("Switching to ".+?"\(unavailable\)"\);?/g],
  ['throw Error("Messages are still loading.");', /console\.warn\("Unsupported Locale",\i\),/],
  ["}_dispatchWithDevtools(", /\i\.totalTime>\i&&\i\.verbose\(.+?\);/],
  ['"NativeDispatchUtils"', /null==\i&&\i\.warn\("Tried getting Dispatch instance before instantiated"\),/],
  [
    '"Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. Action: "',
    /\i\.has\(\i\.type\)&&\i\.log\(.+?\.type\)\),/
  ],
  ['console.warn("Window state not initialized"', /console\.warn\("Window state not initialized",\i\),/],
  ['.name="MaxListenersExceededWarning",', /(?<=\.length),\i\(\i\)/],
  [
    '"The answer for life the universe and everything is:"',
    /\i\.info\("The answer for life the universe and everything is:",\i\),/
  ],
  [
    '"isLibdiscoreBlockedDomainsEnabled called but libdiscore is not loaded"',
    /,\i\.verbose\("isLibdiscoreBlockedDomainsEnabledThisSession: ".concat\(\i\)\)/
  ],
  [
    '"Unable to determine render window for element"',
    /console\.warn\("Unable to determine render window for element",\i\),/
  ],
  [
    '"Unable to determine render window for element"',
    /console\.warn\('Unable to find element constructor "'\.concat\(\i,'" in'\),\i\),/
  ],
  [
    '"[PostMessageTransport] Protocol error: event data should be an Array!"',
    /void console\.warn\("\[PostMessageTransport] Protocol error: event data should be an Array!"\)/
  ],
  [
    '("ComponentDispatchUtils")',
    /new \i\.Z\("ComponentDispatchUtils"\)\.warn\("ComponentDispatch\.resubscribe: Resubscribe without existing subscription",\i\),/
  ]
];

const stripLoggers = [
  '("OverlayRenderStore")',
  '("FetchBlockedDomain")',
  '="UserSettingsProtoLastWriteTimes",',
  '("MessageActionCreators")',
  '("Routing/Utils")',
  '("DatabaseManager")',
  '("KeyboardLayoutMapUtils")',
  '("ChannelMessages")',
  '("MessageQueue")',
  '("RTCLatencyTestManager")',
  '("OverlayStoreV3")',
  '("OverlayBridgeStore")',
  '("AuthenticationStore")',
  '("ConnectionStore")',
  '"Dispatched INITIAL_GUILD "',
  '"handleIdentify called"',
  '("Spotify")'
];

const simplePatches = [
  // Moment.js deprecation warnings
  ["suppressDeprecationWarnings=!1", "suppressDeprecationWarnings=!0"]
] as { 0: string | RegExp; 1: string }[];

export const patches: Patch[] = [
  {
    find: ".Messages.SELF_XSS_HEADER",
    replace: {
      match: /\(null!=\i&&"0\.0\.0"===\i\.remoteApp\.getVersion\(\)\)/,
      replacement: "(true)"
    }
  },
  {
    find: '("ComponentDispatchUtils")',
    replace: {
      match:
        /new \i\.Z\("ComponentDispatchUtils"\)\.warn\("ComponentDispatch\.subscribe: Attempting to add a duplicate listener",\i\)/,
      replacement: "void 0"
    },
    prerequisite: notXssDefensesOnly
  },
  // Highlight.js deprecation warnings
  {
    find: "Deprecated as of",
    replace: {
      match: /console\./g,
      replacement: "false&&console."
    },
    prerequisite: notXssDefensesOnly
  },
  // Discord's logger
  {
    find: "Σ:",
    replace: {
      match: "for",
      replacement: "return;for"
    },
    prerequisite: () => silenceDiscordLogger && notXssDefensesOnly()
  },
  ...loggerFixes,
  ...stubPatches.map((patch) => ({
    find: patch[0],
    replace: {
      match: patch[1],
      replacement: ""
    },
    prerequisite: notXssDefensesOnly
  })),
  ...simplePatches.map((patch) => ({
    find: patch[0],
    replace: {
      match: patch[0],
      replacement: patch[1]
    },
    prerequisite: notXssDefensesOnly
  })),
  ...stripLoggers.map((find) => ({
    find,
    replace: {
      match: /(\i|this\.logger)\.(log|warn|error|info|verbose)\(/g,
      replacement: "(()=>{})("
    },
    prerequisite: notXssDefensesOnly
  }))
];
