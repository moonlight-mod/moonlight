import { Patch } from "@moonlight-mod/types";

const notXssDefensesOnly = () =>
  (moonlight.getConfigOption<boolean>("quietLoggers", "xssDefensesOnly") ?? false) === false;

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
      match: /.\.(info|log)(\(.+?\))(;|,)/g,
      replacement: (_, type, body, trail) => `(()=>{})${body}${trail}`
    }
  }
];
loggerFixes.forEach((patch) => {
  patch.prerequisite = notXssDefensesOnly;
});

// Patches to simply remove a logger call
const stubPatches = [
  // "sh" is not a valid locale.
  ["is not a valid locale", /(.)\.error\(""\.concat\((.)," is not a valid locale\."\)\)/g],
  ['="RunningGameStore"', /.\.info\("games",{.+?}\),/],
  ['"[BUILD INFO] Release Channel: "', /new .{1,2}\.Z\(\)\.log\("\[BUILD INFO\] Release Channel: ".+?"\)\),/],
  ['.APP_NATIVE_CRASH,"Storage"', /console\.log\("AppCrashedFatalReport lastCrash:",.,.\);/],
  ['.APP_NATIVE_CRASH,"Storage"', 'console.log("AppCrashedFatalReport: getLastCrash not supported.");'],
  ['"[NATIVE INFO] ', /new .{1,2}\.Z\(\)\.log\("\[NATIVE INFO] .+?\)\);/],
  ['"Spellchecker"', /.\.info\("Switching to ".+?"\(unavailable\)"\);?/g],
  ['throw Error("Messages are still loading.");', /console\.warn\("Unsupported Locale",.\),/],
  ["}_dispatchWithDevtools(", /.\.totalTime>100&&.\.verbose\(.+?\);/],
  ['"NativeDispatchUtils"', /null==.&&.\.warn\("Tried getting Dispatch instance before instantiated"\),/],
  ['("DatabaseManager")', /.\.log\("removing database \(user: ".+?\)\),/],
  [
    '"Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. Action: "',
    /.\.has\(.\.type\)&&.\.log\(.+?\.type\)\),/
  ],
  ['console.warn("Window state not initialized"', /console\.warn\("Window state not initialized",.\),/]
];

const simplePatches = [
  // Moment.js deprecation warnings
  ["suppressDeprecationWarnings=!1", "suppressDeprecationWarnings=!0"],

  // Zustand related
  [/console\.warn\("\[DEPRECATED\] Please use `subscribeWithSelector` middleware"\)/g, "/*$&*/"],
  ["this.getDebugLogging()", "false"]
] as { [0]: string | RegExp; [1]: string }[];

export const patches: Patch[] = [
  {
    find: ".Messages.SELF_XSS_HEADER",
    replace: {
      match: /\(null!=.{1,2}&&"0\.0\.0"===.{1,2}\.remoteApp\.getVersion\(\)\)/,
      replacement: "(true)"
    }
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
  }))
];
