/* eslint-disable no-console -- debugging */

const starterUrls = ["web.", "sentry."];
let blockLoading = true;
let doing = false;
const collectedUrls = new Set();

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const url = new URL(details.url);
  if (!blockLoading && url.hostname.endsWith("discord.com")) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ["modifyResponseHeaders", "blockLoading"]
    });
    blockLoading = true;
    collectedUrls.clear();
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if (details.tabId === -1) return;
    if (starterUrls.some(url => details.url.includes(url))) {
      console.log("Adding", details.url);
      collectedUrls.add(details.url);
    }

    if (collectedUrls.size === starterUrls.length) {
      if (doing) return;
      if (!blockLoading) return;
      doing = true;
      const urls = [...collectedUrls];
      console.log("Doing", urls);

      console.log("Running moonlight script");
      try {
        await chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          world: "MAIN",
          files: ["index.js"]
        });
      }
      catch (e) {
        console.log(e);
      }

      console.log("Initializing moonlight");
      try {
        await chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          world: "MAIN",
          func: async () => {
            try {
              await window._moonlightBrowserInit();
            }
            catch (e) {
              console.log(e);
            }
          }
        });
      }
      catch (e) {
        console.log(e);
      }

      console.log("Updating rulesets");
      try {
        blockLoading = false;
        await chrome.declarativeNetRequest.updateEnabledRulesets({
          disableRulesetIds: ["blockLoading"],
          enableRulesetIds: ["modifyResponseHeaders"]
        });
      }
      catch (e) {
        console.log(e);
      }

      console.log("Readding scripts");
      try {
        await chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          world: "MAIN",
          args: [urls],
          func: async (urls) => {
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

      console.log("Done");
      doing = false;
      collectedUrls.clear();
    }
  },
  {
    urls: ["*://*.discord.com/assets/*.js"]
  }
);
