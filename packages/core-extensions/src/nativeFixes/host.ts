import { app, nativeTheme } from "electron";

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
