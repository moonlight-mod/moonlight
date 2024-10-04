// This is so tiny that I don't need to esbuild it

// eslint-disable-next-line no-undef
chrome.webRequest.onHeadersReceived.addListener(
  (details) => ({
    responseHeaders: details.responseHeaders.filter(
      (header) => header.name.toLowerCase() !== "content-security-policy"
    )
  }),
  { urls: ["https://*.discord.com/*"] },
  ["blocking", "responseHeaders"]
);
