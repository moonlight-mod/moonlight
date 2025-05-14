/* eslint-disable no-console */
/* eslint-disable no-undef */

const scriptUrls = ["web.", "sentry."];
let blockedScripts = new Set();

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const url = new URL(details.url);
  if (
    !url.searchParams.has("inj") &&
    (url.hostname.endsWith("discord.com") || url.hostname.endsWith("discordapp.com"))
  ) {
    console.log("Enabling block ruleset");
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ["modifyResponseHeaders", "blockLoading"]
    });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if (details.tabId === -1) return;

    const url = new URL(details.url);
    const hasUrl =
      url.pathname.match(/\/assets\/[a-zA-Z]+\./) &&
      !url.searchParams.has("inj") &&
      (url.hostname.endsWith("discord.com") || url.hostname.endsWith("discordapp.com"));
    if (hasUrl) blockedScripts.add(details.url);

    if (blockedScripts.size === scriptUrls.length) {
      const blockedScriptsCopy = Array.from(blockedScripts);
      blockedScripts.clear();

      console.log("Running moonlight script");
      try {
        await chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          world: "MAIN",
          files: ["index.js"]
        });
      } catch (e) {
        console.error(e);
      }

      console.log("Initializing moonlight");
      try {
        await chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          world: "MAIN",
          func: async () => {
            try {
              await window._moonlightBrowserInit();
            } catch (e) {
              console.error(e);
            }
          }
        });
      } catch (e) {
        console.log(e);
      }

      console.log("Disabling block ruleset");
      try {
        await chrome.declarativeNetRequest.updateEnabledRulesets({
          disableRulesetIds: ["blockLoading"],
          enableRulesetIds: ["modifyResponseHeaders"]
        });
      } catch (e) {
        console.error(e);
      }

      console.log("Readding scripts");
      try {
        await chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          world: "MAIN",
          args: [blockedScriptsCopy],
          func: async (blockedScripts) => {
            const scripts = [...document.querySelectorAll("script")].filter(
              (script) => script.src && blockedScripts.some((url) => url.includes(script.src))
            );

            blockedScripts.reverse();
            for (const url of blockedScripts) {
              if (!url.includes("/web.")) continue;

              const script = scripts.find((script) => url.includes(script.src));
              const newScript = document.createElement("script");
              for (const attr of script.attributes) {
                if (attr.name === "src") attr.value += "?inj";
                newScript.setAttribute(attr.name, attr.value);
              }
              script.remove();
              document.documentElement.appendChild(newScript);
            }
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
  {
    urls: ["*://*.discord.com/assets/*.js", "*://*.discordapp.com/assets/*.js"]
  }
);
