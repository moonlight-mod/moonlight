import type { BrowserWindow } from "electron";
import type { PatchBay } from "./types";
import path from "node:path";
import { app, desktopCapturer } from "electron";

const logger = moonlightHost.getLogger("rocketship");

function getPatchbay() {
  try {
    const venmic = require(path.join(path.dirname(moonlightHost.asarPath), "..", "venmic.node")) as {
      PatchBay: new () => PatchBay;
    };
    const patchbay = new venmic.PatchBay();
    return patchbay;
  }
  catch (error) {
    logger.error("Failed to load venmic.node:", error);
    return null;
  }
}

const patchbay = getPatchbay();

// TODO: figure out how to map source to window with venmic
function linkVenmic() {
  if (patchbay == null) return false;

  try {
    const pid
      = app
        .getAppMetrics()
        .find(proc => proc.name === "Audio Service")
        ?.pid
        ?.toString() ?? "";

    logger.info("Audio Service PID:", pid);

    patchbay.unlink();
    return patchbay.link({
      exclude: [{ "application.process.id": pid }, { "media.class": "Stream/Input/Audio" }],
      ignore_devices: true,
      only_speakers: true,
      only_default_speakers: true
    });
  }
  catch (error) {
    logger.error("Failed to link venmic:", error);
    return false;
  }
}

moonlightHost.events.on("window-created", (window: BrowserWindow, isMainWindow: boolean) => {
  if (!isMainWindow) return;
  const windowSession = window.webContents.session;

  // @ts-expect-error: these types ancient
  windowSession.setDisplayMediaRequestHandler(
    (request: any, callback: any) => {
      const linked = linkVenmic();
      desktopCapturer.getSources({ types: ["screen", "window"] }).then((sources) => {
        // logger.debug("desktopCapturer.getSources", sources);
        logger.debug("Linked to venmic:", linked);

        callback({
          video: sources[0],
          audio: "loopback"
        });
      });
    },
    { useSystemPicker: true }
  );
});
