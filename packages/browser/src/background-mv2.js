/** biome-ignore-all lint/suspicious/noConsole: background script */

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    return {
      responseHeaders: details.responseHeaders.filter(
        (header) => header.name.toLowerCase() !== "content-security-policy"
      )
    };
  },
  { urls: ["https://*.discord.com/*", "https://*.discordapp.com/*"] },
  ["blocking", "responseHeaders"]
);
