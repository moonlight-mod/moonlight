import { ExtensionWebExports } from "@moonlight-mod/types";
import { Patch, PatchReplaceType } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "DSN:function",
    replace: {
      type: PatchReplaceType.Normal,
      match: /default:function\(\){return .}/,
      replacement: 'default:function(){return require("disableSentry_stub")()}'
    }
  },
  {
    find: "window.DiscordSentry.addBreadcrumb",
    replace: {
      type: PatchReplaceType.Normal,
      match: /default:function\(\){return .}/,
      replacement:
        'default:function(){return (...args)=>{moonlight.getLogger("disableSentry").debug("Sentry calling addBreadcrumb passthrough:", ...args);}}'
    }
  },
  {
    find: "initSentry:function",
    replace: {
      type: PatchReplaceType.Normal,
      match: /initSentry:function\(\){return .}/,
      replacement: "default:function(){return ()=>{}}"
    }
  },
  {
    find: "window.DiscordErrors=",
    replace: {
      type: PatchReplaceType.Normal,
      match: /uses_client_mods:\(0,.\.usesClientMods\)\(\)/,
      replacement: "uses_client_mods:false"
    }
  }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  stub: {
    run: function (module, exports, require) {
      const logger = moonlight.getLogger("disableSentry");

      const keys = [
        "setUser",
        "clearUser",
        "setTags",
        "setExtra",
        "captureException",
        "captureCrash",
        "captureMessage",
        "addBreadcrumb"
      ];

      module.exports = () =>
        new Proxy(
          {},
          {
            get(target, prop, receiver) {
              if (prop === "profiledRootComponent") {
                return (arg: any) => arg;
              } else if (prop === "crash") {
                return () => {
                  throw Error("crash");
                };
              } else if (keys.includes(prop.toString())) {
                return (...args: any[]) =>
                  logger.debug(`Sentry calling "${prop.toString()}":`, ...args);
              } else {
                return undefined;
              }
            }
          }
        );
    }
  }
};
