/* eslint-disable no-console -- debugging */

const starterUrls = ["web.", "sentry."];
let blockLoading = true;
let doing = false;
const collectedUrls = new Set();

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const url = new URL(details.url);
  if (!blockLoading && url.hostname.endsWith("discord.com")) {
    console.log("Blocking", details.url);
    blockLoading = true;
    collectedUrls.clear();
  }
});

async function doTheThing(urls, tabId) {
  console.log("Doing", urls, tabId);

  blockLoading = false;

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      args: [urls],
      func: async (urls) => {
        try {
          await window._moonlightBrowserInit();
        }
        catch (e) {
          console.log(e);
        }

        const scripts = [...document.querySelectorAll("script")].filter(
          script => script.src && urls.some(url => url.includes(script.src))
        );

        // backwards
        urls.reverse();
        for (const url of urls) {
          const script = scripts.find(script => url.includes(script.src));
          console.log("adding new script", script);

          const newScript = document.createElement("script");
          for (const { name, value } of script.attributes) {
            newScript.setAttribute(name, value);
          }

          script.remove();
          document.documentElement.append(newScript);
        }
      }
    });
  }
  catch (e) {
    console.log(e);
  }

  doing = false;
  collectedUrls.clear();
}

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if (starterUrls.some(url => details.url.includes(url))) {
      console.log("Adding", details.url);
      collectedUrls.add(details.url);
    }

    if (collectedUrls.size === starterUrls.length) {
      if (doing) return;
      if (!blockLoading) return;
      doing = true;
      const urls = [...collectedUrls];
      const tabId = details.tabId;

      // yes this is a load-bearing sleep
      setTimeout(() => doTheThing(urls, tabId), 0);
    }

    if (blockLoading) return { cancel: true };
  },
  {
    urls: ["https://*.discord.com/assets/*.js"]
  },
  ["blocking"]
);

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    return {
      responseHeaders: details.responseHeaders.filter(
        header => header.name.toLowerCase() !== "content-security-policy"
      )
    };
  },
  { urls: ["https://*.discord.com/*"] },
  ["blocking", "responseHeaders"]
);
