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

export const proxy = () =>
  new Proxy(
    {},
    {
      get(_target, prop, _receiver) {
        if (prop === "profiledRootComponent") {
          return (arg: any) => arg;
        }
        else if (prop === "crash") {
          return () => {
            throw new Error("crash");
          };
        }
        else if (keys.includes(prop.toString())) {
          return (...args: any[]) => logger.debug(`Sentry calling "${prop.toString()}":`, ...args);
        }
        else {
          return undefined;
        }
      }
    }
  );
