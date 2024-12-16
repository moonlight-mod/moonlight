// Helper functions that wrap shelling out to codesign(1). This is only relevant
// for Darwin (macOS).

import { spawn } from "node:child_process";
import Logger from "./logger";

/** Flags that may be passed to `codesign(1)` regardless of action. */
export interface SharedCodesignOptions {
  verbosityLevel?: number;
}

/** Flags that may be passed to `codesign(1)` when signing a bundle. */
export interface SigningOptions extends SharedCodesignOptions {
  /**
   * Sign nested code items (such as Helper (Renderer).app, Helper (GPU).app, etc.)
   *
   * `--deep` is technically Bad (https://forums.developer.apple.com/forums/thread/129980),
   * but it works for now.
   */
  deep?: boolean;

  /** Steamrolls any existing code signature present in the bundle. */
  force?: boolean;

  /**
   * The name of the signing identity to use. Signing identities are automatically queried from the user's keychains.
   *
   * `-` specifies ad-hoc signing, which does not involve an identity at all
   * and is used to sign exactly one instance of code.
   */
  identity: "-" | (string & {}); // "& {}" prevents TS from unifying the literal.
}

const logger = new Logger("core/darwin");

async function invokeCodesign(commandLineOptions: string[]) {
  logger.debug("Invoking codesign with args:", commandLineOptions);
  const codesignChild = spawn("/usr/bin/codesign", commandLineOptions, { stdio: "pipe" });

  codesignChild.on("spawn", () => {
    logger.debug(`Spawned codesign (pid: ${codesignChild.pid})`);
  });
  codesignChild.stdout.on("data", (data) => {
    logger.debug("codesign stdout:", data.toString());
  });
  codesignChild.stderr.on("data", (data) => {
    logger.debug("codesign stderr:", data.toString());
  });

  await new Promise<void>((resolve, reject) => {
    codesignChild.on("exit", (code, signal) => {
      if (signal == null && code === 0) {
        logger.debug("codesign peacefully exited");
        resolve();
      } else {
        const reason = code != null ? `code ${code}` : `signal ${signal}`;
        reject(`codesign exited with ${reason}`);
      }
    });
  });
}

function* generateSharedCommandLineOptions(options: SharedCodesignOptions): IterableIterator<string> {
  if (options.verbosityLevel) yield "-" + "v".repeat(options.verbosityLevel);
}

export function sign(bundlePath: string, options: SigningOptions): Promise<void> {
  // codesign -s <IDENTITY> [-v] [--deep] [--force] <PATH>
  function* cliOptions(): IterableIterator<string> {
    yield "-s";
    yield options.identity;

    yield* generateSharedCommandLineOptions(options);
    if (options.deep) yield "--deep";
    if (options.force) yield "--force";

    yield bundlePath;
  }

  return invokeCodesign(Array.from(cliOptions()));
}

export function verify(bundlePath: string, options: SharedCodesignOptions = {}): Promise<boolean> {
  // codesign --verify [-v] <PATH>
  function* cliOptions(): IterableIterator<string> {
    yield "--verify";
    yield* generateSharedCommandLineOptions(options);
    yield bundlePath;
  }

  return invokeCodesign(Array.from(cliOptions())).then(
    () => true,

    // we're conflating codesign(1) itself erroring and codesign(1)
    // successfully returning that the bundle is invalid, because it'd exit in
    // an error in either case, but that's probably OK
    () => false
  );
}
