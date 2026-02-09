import * as fsSync from "node:fs";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { app, nativeTheme } from "electron";
import { parseTarGzip } from "nanotar";

const logger = moonlightHost.getLogger("nativeFixes/host");
const enabledFeatures = app.commandLine.getSwitchValue("enable-features").split(",");
const disabledFeatures = app.commandLine.getSwitchValue("disable-features").split(",");

moonlightHost.events.on("window-created", (browserWindow) => {
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
  // Discord already disables UseEcoQoSForBackgroundProcess and some other related features
  app.commandLine.appendSwitch("disable-renderer-backgrounding");
  app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");

  // already added on Windows, but not on other operating systems
  app.commandLine.appendSwitch("disable-background-timer-throttling");
}

if (moonlightHost.getConfigOption<boolean>("nativeFixes", "vulkan") ?? false) {
  enabledFeatures.push("Vulkan", "DefaultANGLEVulkan", "VulkanFromANGLE");
  app.commandLine.appendSwitch("use-angle", "vulkan");
}

if (process.platform === "linux") {
  if (moonlightHost.getConfigOption<boolean>("nativeFixes", "linuxAutoscroll") ?? false) {
    app.commandLine.appendSwitch("enable-blink-features", "MiddleClickAutoscroll");
  }

  if (moonlightHost.getConfigOption<boolean>("nativeFixes", "linuxSpeechDispatcher") ?? true) {
    app.commandLine.appendSwitch("enable-speech-dispatcher");
  }

  if (moonlightHost.getConfigOption<boolean>("nativeFixes", "linuxHevcSupport") ?? true) {
    enabledFeatures.push("PlatformHEVCDecoderSupport");
  }

  if (moonlightHost.getConfigOption<boolean>("nativeFixes", "disableFontations")) {
    disabledFeatures.push("FontationsFontBackend");
  }

  if (moonlightHost.getConfigOption<boolean>("nativeFixes", "waylandExplicitSync")) {
    enabledFeatures.push("WaylandLinuxDrmSyncobj");
  }
}

// NOTE: Only tested if this appears on Windows, it should appear on all when hardware acceleration is disabled
const noAccel = app.commandLine.hasSwitch("disable-gpu-compositing");
if (!noAccel) {
  const vaapi = moonlightHost.getConfigOption<boolean>("nativeFixes", "vaapi") ?? true;
  if (vaapi) {
    if (process.platform === "linux") {
      enabledFeatures.push(
        // old flag names, probably can be removed but shrug
        "VaapiVideoEncoder",
        "VaapiVideoDecoder",
        "VaapiVideoDecodeLinuxGL",

        "AcceleratedVideoEncoder",
        "AcceleratedVideoDecoder",
        "AcceleratedVideoDecodeLinuxGL"
      );

      // maybe outdated
      disabledFeatures.push("UseChromeOSDirectVideoDecoder");

      if (moonlightHost.getConfigOption<boolean>("nativeFixes", "vaapiIgnoreDriverChecks") ?? false) {
        enabledFeatures.push("VaapiIgnoreDriverChecks");
      }

      if (moonlightHost.getConfigOption<boolean>("nativeFixes", "vaapiNvidia") ?? false)
        enabledFeatures.push("VaapiOnNvidiaGPUs");
    }
  }

  if (moonlightHost.getConfigOption<boolean>("nativeFixes", "zeroCopy") ?? false) {
    app.commandLine.appendSwitch("enable-zero-copy");
    if (vaapi) enabledFeatures.push("AcceleratedVideoDecodeLinuxZeroCopyGL");
  }

  if (moonlightHost.getConfigOption<boolean>("nativeFixes", "ignoreGpuBlocklist")) {
    app.commandLine.appendSwitch("ignore-gpu-blocklist");
    app.commandLine.appendSwitch("disable-gpu-driver-bug-workaround");
    app.commandLine.appendSwitch("enable-unsafe-webgpu");
  }
}

app.commandLine.appendSwitch("enable-features", [...new Set(enabledFeatures)].join(","));
app.commandLine.appendSwitch("disable-features", [...new Set(disabledFeatures)].join(","));

// Prevent Discord from overriding our features when they call it in the future
const realAppendSwitch = app.commandLine.appendSwitch;
app.commandLine.appendSwitch = function (theSwitch, value) {
  function applyCustomFeatures(moddedFeatures: string[]) {
    const existingFeatures = value?.split(",") ?? [];
    const combinedFeatures = [...existingFeatures, ...moddedFeatures];
    value = [...new Set(combinedFeatures)].join(",");
  }

  switch (theSwitch) {
    case "enable-features": {
      applyCustomFeatures(enabledFeatures);
      break;
    }

    case "disable-features": {
      applyCustomFeatures(disabledFeatures);
      break;
    }
  }

  return realAppendSwitch.call(this, theSwitch, value);
};

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
    const contentLength = parseInt(resp.headers.get("Content-Length") ?? "0", 10);
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
      }

      const targetFileDir = path.dirname(targetFilePath);
      if (!(await exists(targetFileDir))) await fs.mkdir(targetFileDir, { recursive: true });

      // Since we're unsafely replacing files as the process is still running, we write files into a temp filename
      // and call rename so we can avoid unfinished writes when it flushes to disk
      const tempFilePath = `${targetFilePath}.new`;
      await fs.writeFile(tempFilePath, file.data);
      await fs.rename(tempFilePath, targetFilePath);

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
