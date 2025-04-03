import type { BrowserWindow } from "electron";

type PermissionRequestHandler = (
  webContents: Electron.WebContents,
  permission: string,
  callback: (permissionGranted: boolean) => void,
  details: Electron.PermissionRequestHandlerHandlerDetails
) => void;

type PermissionCheckHandler = (
  webContents: Electron.WebContents | null,
  permission: string,
  requestingOrigin: string,
  details: Electron.PermissionCheckHandlerHandlerDetails
) => boolean;

moonlightHost.events.on("window-created", (window: BrowserWindow, isMainWindow: boolean) => {
  if (!isMainWindow) return;
  const windowSession = window.webContents.session;

  // setPermissionRequestHandler
  windowSession.setPermissionRequestHandler((webcontents, permission, callback, details) => {
    let cbResult = false;
    function fakeCallback(result: boolean) {
      cbResult = result;
    }

    if (caughtPermissionRequestHandler) {
      caughtPermissionRequestHandler(webcontents, permission, fakeCallback, details);
    }

    if (permission === "media" || permission === "display-capture") {
      cbResult = true;
    }

    callback(cbResult);
  });

  let caughtPermissionRequestHandler: PermissionRequestHandler | undefined;

  windowSession.setPermissionRequestHandler = function catchSetPermissionRequestHandler(
    handler: (
      webcontents: Electron.WebContents,
      permission: string,
      callback: (permissionGranted: boolean) => void
    ) => void
  ) {
    caughtPermissionRequestHandler = handler;
  };

  // setPermissionCheckHandler
  windowSession.setPermissionCheckHandler((_webcontents, _permission, _requestingOrigin, _details) => {
    return false;
  });

  let caughtPermissionCheckHandler: PermissionCheckHandler | undefined;

  windowSession.setPermissionCheckHandler((webcontents, permission, requestingOrigin, details) => {
    let result = false;

    if (caughtPermissionCheckHandler) {
      result = caughtPermissionCheckHandler(webcontents, permission, requestingOrigin, details);
    }

    if (permission === "media" || permission === "display-capture") {
      result = true;
    }

    return result;
  });

  windowSession.setPermissionCheckHandler = function catchSetPermissionCheckHandler(handler: PermissionCheckHandler) {
    caughtPermissionCheckHandler = handler;
  };
});
