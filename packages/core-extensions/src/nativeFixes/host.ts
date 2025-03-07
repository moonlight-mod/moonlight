import { app, nativeTheme } from "electron";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import { parseTarGzip } from "nanotar";

const logger = moonlightHost.getLogger("nativeFixes/host");
const enabledFeatures = app.commandLine.getSwitchValue("enable-features").split(",");

moonlightHost.events.on("window-created", function (browserWindow) {
  if (moonlightHost.getConfigOption<boolean>("nativeFixes", "devtoolsThemeFix") ?? true) {
    browserWindow.webContents.on("devtools-opened", () => {
      if (!nativeTheme.shouldUseDarkColors) return;
      nativeTheme.themeSource = "light";
      setTimeout(() => {
        nativeTheme.themeSource = "dark";
      }, 100);
    });
  }
});

if (moonlightHost.getConfigOption<boolean>("nativeFixes", "disableRendererBackgrounding") ?? true) {
  // Discord already disables UseEcoQoSForBackgroundProcess and some other
  // related features
  app.commandLine.appendSwitch("disable-renderer-backgrounding");
  app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");

  // already added on Windows, but not on other operating systems
  app.commandLine.appendSwitch("disable-background-timer-throttling");
}

if (moonlightHost.getConfigOption<boolean>("nativeFixes", "vulkan") ?? false) {
  enabledFeatures.push("Vulkan", "DefaultANGLEVulkan", "VulkanFromANGLE");
}

if (process.platform === "linux") {
  if (moonlightHost.getConfigOption<boolean>("nativeFixes", "linuxAutoscroll") ?? false) {
    app.commandLine.appendSwitch("enable-blink-features", "MiddleClickAutoscroll");
  }

  if (moonlightHost.getConfigOption<boolean>("nativeFixes", "linuxSpeechDispatcher") ?? true) {
    app.commandLine.appendSwitch("enable-speech-dispatcher");
  }
}

// NOTE: Only tested if this appears on Windows, it should appear on all when
//       hardware acceleration is disabled
const noAccel = app.commandLine.hasSwitch("disable-gpu-compositing");
if ((moonlightHost.getConfigOption<boolean>("nativeFixes", "vaapi") ?? true) && !noAccel) {
  if (process.platform === "linux") {
    // These will eventually be renamed https://source.chromium.org/chromium/chromium/src/+/5482210941a94d70406b8da962426e4faca7fce4
    enabledFeatures.push("VaapiVideoEncoder", "VaapiVideoDecoder", "VaapiVideoDecodeLinuxGL");

    if (moonlightHost.getConfigOption<boolean>("nativeFixes", "vaapiIgnoreDriverChecks") ?? false)
      enabledFeatures.push("VaapiIgnoreDriverChecks");
  }
}

app.commandLine.appendSwitch("enable-features", [...new Set(enabledFeatures)].join(","));

if (process.platform === "linux" && moonlightHost.getConfigOption<boolean>("nativeFixes", "linuxUpdater")) {
  const exePath = app.getPath("exe");
  const appName = path.basename(exePath);
  const targetDir = path.dirname(exePath);
  const { releaseChannel }: { releaseChannel: string } = JSON.parse(
    fsSync.readFileSync(path.join(targetDir, "resources", "build_info.json"), "utf8")
  );

  const updaterModule = require(path.join(moonlightHost.asarPath, "app_bootstrap", "hostUpdater.js"));
  const updater = updaterModule.constructor;

  async function doUpdate(cb: (percent: number) => void) {
    logger.debug("Extracting to", targetDir);

    const exists = (path: string) =>
      fs
        .stat(path)
        .then(() => true)
        .catch(() => false);

    const url = `https://discord.com/api/download/${releaseChannel}?platform=linux&format=tar.gz`;
    const resp = await fetch(url, {
      cache: "no-store"
    });

    const reader = resp.body!.getReader();
    const contentLength = parseInt(resp.headers.get("Content-Length") ?? "0");
    logger.info(`Expecting ${contentLength} bytes for the update`);
    const bytes = new Uint8Array(contentLength);
    let pos = 0;
    let lastPercent = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      } else {
        bytes.set(value, pos);
        pos += value.length;

        const newPercent = Math.floor((pos / contentLength) * 100);
        if (lastPercent !== newPercent) {
          lastPercent = newPercent;
          cb(newPercent);
        }
      }
    }

    const files = await parseTarGzip(bytes);

    for (const file of files) {
      if (!file.data) continue;
      // @ts-expect-error What do you mean their own types are wrong
      if (file.type !== "file") continue;

      // Discord update files are inside of a main "Discord(PTB|Canary)" folder
      const filePath = file.name.replace(`${appName}/`, "");
      logger.info("Extracting", filePath);

      let targetFilePath = path.join(targetDir, filePath);
      if (filePath === "resources/app.asar") {
        // You tried
        targetFilePath = path.join(targetDir, "resources", "_app.asar");
      } else if (filePath === appName || filePath === "chrome_crashpad_handler") {
        // Can't write over the executable? Just move it! 4head
        if (await exists(targetFilePath)) {
          await fs.rename(targetFilePath, targetFilePath + ".bak");
          await fs.unlink(targetFilePath + ".bak");
        }
      }
      const targetFileDir = path.dirname(targetFilePath);

      if (!(await exists(targetFileDir))) await fs.mkdir(targetFileDir, { recursive: true });
      await fs.writeFile(targetFilePath, file.data);

      const mode = file.attrs?.mode;
      if (mode != null) {
        // Not sure why this slice is needed
        await fs.chmod(targetFilePath, mode.slice(-3));
      }
    }

    logger.debug("Done updating");
  }

  const realEmit = updater.prototype.emit;
  updater.prototype.emit = function (event: string, ...args: any[]) {
    // Arrow functions don't bind `this` :D
    const call = (event: string, ...args: any[]) => realEmit.call(this, event, ...args);

    if (event === "update-manually") {
      const latestVerStr: string = args[0];
      logger.debug("update-manually called, intercepting", latestVerStr);
      call("update-available");

      (async () => {
        try {
          await doUpdate((progress) => {
            call("update-progress", progress);
          });
          // Copied from the win32 updater
          this.updateVersion = latestVerStr;
          call(
            "update-downloaded",
            {},
            releaseChannel,
            latestVerStr,
            new Date(),
            this.updateUrl,
            this.quitAndInstall.bind(this)
          );
        } catch (e) {
          logger.error("Error updating", e);
        }
      })();

      return this;
    } else {
      return realEmit.call(this, event, ...args);
    }
  };
}
