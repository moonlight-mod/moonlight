import { Patch } from "@moonlight-mod/types";

const notXssDefensesOnly = () =>
  (moonlight.getConfigOption<boolean>("quietLoggers", "xssDefensesOnly") ??
    false) === false;

// These patches MUST run before the simple patches, these are to remove loggers
// that end up causing syntax errors by the normal patch
const loggerFixes: Patch[] = [
  {
    find: '"./ggsans-800-extrabolditalic.woff2":',
    replace: {
      match: /\.then\(function\(\){var.+?"MODULE_NOT_FOUND",.\}\)/,
      replacement: ".then(()=>(()=>{}))"
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
  [
    "is not a valid locale",
    /(.)\.error\(`\$\{.{1,2}\} is not a valid locale\.`\)/g
  ],
  ['.displayName="RunningGameStore"', /.\.info\("games",{.+?}\),/],
  [
    '"[BUILD INFO] Release Channel: "',
    /new\(0,.{1,2}\.default\)\(\)\.log\("\[BUILD INFO\] Release Channel: ".+?"\)\),/
  ],
  [
    '.AnalyticEvents.APP_NATIVE_CRASH,"Storage"',
    /console\.log\("AppCrashedFatalReport lastCrash:",.,.\);/
  ],
  [
    '.AnalyticEvents.APP_NATIVE_CRASH,"Storage"',
    'console.log("AppCrashedFatalReport: getLastCrash not supported.");'
  ],
  [
    '"[NATIVE INFO] ',
    /new\(0,.{1,2}\.default\)\(\)\.log\("\[NATIVE INFO] .+?\)\),/
  ],
  ['"Spellchecker"', /.\.info\(`Switching to .+?"\(unavailable\)"\);?/g],
  [
    'throw new Error("Messages are still loading.");',
    /console\.warn\("Unsupported Locale",.\);/
  ],
  ["_dispatchWithDevtools=", /.\.has\(.\.type\)&&.\.log\(.+?\);/],
  ["_dispatchWithDevtools=", /.\.totalTime>100&&.\.log\(.+?\);0;/],
  [
    '"NativeDispatchUtils"',
    /null==.&&.\.warn\("Tried getting Dispatch instance before instantiated"\),/
  ],
  [
    'Error("Messages are still loading.")',
    /console\.warn\("Unsupported Locale",.\),/
  ],
  ['("DatabaseManager")', /.\.log\(`removing database .+?`\),/],
  [
    '"Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. Action: "',
    /.\.has\(.\.type\)&&.\.log\(.+?\.type\)\),/
  ]
];

const simplePatches = [
  // Moment.js deprecation warnings
  ["suppressDeprecationWarnings=!1", "suppressDeprecationWarnings=!0"],

  // Zustand related
  [
    /console\.warn\("\[DEPRECATED\] Please use `subscribeWithSelector` middleware"\)/g,
    "/*$&*/"
  ]
] as { [0]: string | RegExp; [1]: string }[];

export const patches: Patch[] = [
  {
    find: ".Messages.XSSDefenses",
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
