import { BrowserWindow } from "electron";

moonlightHost.events.on("window-created", (window: BrowserWindow) => {
  window.webContents.session.webRequest.onBeforeRequest(
    {
      urls: [
        "https://*.discord.com/api/v*/science",
        "https://*.discord.com/api/v*/metrics"
      ]
    },
    function (details, callback) {
      callback({ cancel: true });
    }
  );
});
