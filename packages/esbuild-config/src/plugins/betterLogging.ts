/** biome-ignore-all lint/suspicious/noConsole: logger */
import type { Plugin } from "esbuild";
import { formatMessages } from "esbuild";

const lastMessages = new Set();
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false
});

export const betterLogging: (tag: string) => Plugin = (tag) => ({
  name: "better-logging",
  setup(build) {
    build.onStart(() => lastMessages.clear());
    build.onEnd(async (result) => {
      const formatted = await Promise.all([
        formatMessages(result.warnings, {
          kind: "warning",
          color: true
        }),
        formatMessages(result.errors, { kind: "error", color: true })
      ]).then((a) => a.flat());

      for (const message of formatted) {
        if (lastMessages.has(message)) continue;
        lastMessages.add(message);
        console.log(message.trim());
      }

      console.log(`[${timeFormatter.format(new Date())}] [${tag}] build finished`);
    });
  }
});

export default betterLogging;
