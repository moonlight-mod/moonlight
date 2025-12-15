/* eslint-disable no-console */
/* eslint-disable no-undef */

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if (details.tabId === -1) return;

    const origin = new URL(details.originUrl);
    if (
      (origin.host.endsWith("discord.com") || origin.host.endsWith("discordapp.com")) &&
      origin.pathname.match(/^\/developers\//)
    )
      return;

    const url = new URL(details.url);
    const hasUrl =
      url.pathname.match(/\/assets\/[a-zA-Z\-]+\./) &&
      !url.searchParams.has("inj") &&
      (url.host.endsWith("discord.com") || url.host.endsWith("discordapp.com"));

    const initScripts = ["web."];
    const testScripts = (scripts) => scripts.some((script) => url.pathname.startsWith(`/assets/${script}`));
    const shouldInit = hasUrl && testScripts(initScripts);

    if (shouldInit) {
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

      console.log("Readding scripts");
      try {
        await chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          world: "MAIN",
          args: [[details.url]],
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
