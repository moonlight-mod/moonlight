import type { BrowserWindow } from "electron";
import { desktopCapturer } from "electron";

const logger = moonlightHost.getLogger("rocketship");

moonlightHost.events.on(
  "window-created",
  (window: BrowserWindow, isMainWindow: boolean) => {
    if (!isMainWindow) return;

    const windowSession = window.webContents.session;

    window.webContents.on("did-finish-load", () => {
      windowSession.setPermissionRequestHandler(
        (webContents, permission, callback) => {
          logger.debug("windowSession.setPermissionRequestHandler", permission);
          if (permission === "media") callback(true);
        }
      );

      // @ts-expect-error these types ancient
      windowSession.setDisplayMediaRequestHandler(
        (request: any, callback: any) => {
          logger.debug("windowSession.setDisplayMediaRequestHandler", request);
          desktopCapturer
            .getSources({ types: ["screen", "window"] })
            .then((sources) => {
              logger.debug("desktopCapturer.getSources", sources);
              callback({ video: sources[0], audio: "loopback" });
            });
        },
        { useSystemPicker: true }
      );
    });
  }
);
