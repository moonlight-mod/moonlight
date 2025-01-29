// Helper functions that wrap shelling out to codesign(1). This is only
// relevant for Darwin (macOS). These are synchronous because they need to
// block the updater.

import { spawnSync } from "node:child_process";
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

function codesignSync(commandLineOptions: string[]) {
  logger.debug("Invoking codesign with args:", commandLineOptions);
  const result = spawnSync("/usr/bin/codesign", commandLineOptions, { stdio: "pipe" });

  if (result.stdout) logger.debug("codesign stdout:", result.stdout);
  if (result.stderr) logger.debug("codesign stderr:", result.stderr);

  if (result.signal == null && result.status === 0) {
    logger.debug("codesign peacefully exited");
  } else {
    const reason = result.status != null ? `code ${result.status}` : `signal ${result.signal}`;
    throw new Error(`codesign exited with ${reason}`);
  }
}

function* generateSharedCommandLineOptions(options: SharedCodesignOptions): IterableIterator<string> {
  if (options.verbosityLevel) yield "-" + "v".repeat(options.verbosityLevel);
}

export function signSync(bundlePath: string, options: SigningOptions): void {
  // codesign -s <IDENTITY> [-v] [--deep] [--force] <PATH>
  function* cliOptions(): IterableIterator<string> {
    yield "-s";
    yield options.identity;

    yield* generateSharedCommandLineOptions(options);
    if (options.deep) yield "--deep";
    if (options.force) yield "--force";

    yield bundlePath;
  }

  codesignSync(Array.from(cliOptions()));
}

export function verifySync(bundlePath: string, options: SharedCodesignOptions = {}): boolean {
  // codesign --verify [-v] <PATH>
  function* cliOptions(): IterableIterator<string> {
    yield "--verify";
    yield* generateSharedCommandLineOptions(options);
    yield bundlePath;
  }

  try {
    codesignSync(Array.from(cliOptions()));
    return true;
  } catch {
    return false;
  }
}
