import { app, nativeTheme } from "electron";

const enabledFeatures = app.commandLine
  .getSwitchValue("enable-features")
  .split(",");

moonlightHost.events.on("window-created", function (browserWindow) {
  if (
    moonlightHost.getConfigOption<boolean>("nativeFixes", "devtoolsThemeFix") ??
    true
  ) {
    browserWindow.webContents.on("devtools-opened", () => {
      if (!nativeTheme.shouldUseDarkColors) return;
      nativeTheme.themeSource = "light";
      setTimeout(() => {
        nativeTheme.themeSource = "dark";
      }, 100);
    });
  }
});

if (
  moonlightHost.getConfigOption<boolean>(
    "nativeFixes",
    "disableRendererBackgrounding"
  ) ??
  true
) {
  // Discord already disables UseEcoQoSForBackgroundProcess and some other
  // related features
  app.commandLine.appendSwitch("disable-renderer-backgrounding");
  app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");

  // already added on Windows, but not on other operating systems
  app.commandLine.appendSwitch("disable-background-timer-throttling");
}

if (process.platform === "linux") {
  if (
    moonlightHost.getConfigOption<boolean>("nativeFixes", "linuxAutoscroll") ??
    false
  ) {
    app.commandLine.appendSwitch(
      "enable-blink-features",
      "MiddleClickAutoscroll"
    );
  }

  if (
    moonlightHost.getConfigOption<boolean>(
      "nativeFixes",
      "linuxSpeechDispatcher"
    ) ??
    true
  ) {
    app.commandLine.appendSwitch("enable-speech-dispatcher");
  }
}

// NOTE: Only tested if this appears on Windows, it should appear on all when
//       hardware acceleration is disabled
const noAccel = app.commandLine.hasSwitch("disable-gpu-compositing");
if (
  (moonlightHost.getConfigOption<boolean>("nativeFixes", "vaapi") ?? true) &&
  !noAccel
) {
  if (process.platform === "linux")
    // These will eventually be renamed https://source.chromium.org/chromium/chromium/src/+/5482210941a94d70406b8da962426e4faca7fce4
    enabledFeatures.push(
      "VaapiVideoEncoder",
      "VaapiVideoDecoder",
      "VaapiVideoDecodeLinuxGL"
    );
}

app.commandLine.appendSwitch(
  "enable-features",
  [...new Set(enabledFeatures)].join(",")
);
