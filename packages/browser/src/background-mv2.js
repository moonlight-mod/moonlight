/* eslint-disable no-console */
/* eslint-disable no-undef */

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if (details.tabId === -1) return;

    const url = new URL(details.url);
    const hasUrl =
      url.pathname.match(/\/assets\/[a-zA-Z]+\./) &&
      !url.searchParams.has("inj") &&
      (url.host.endsWith("discord.com") || url.host.endsWith("discordapp.com"));

    const initScripts = ["web."];
    const allowScripts = ["popout."];
    const testScripts = (scripts) => scripts.some((script) => url.pathname.startsWith(`/assets/${script}`));
    const shouldInit = hasUrl && testScripts(initScripts);
    const shouldBlock = hasUrl && !testScripts(allowScripts);

    if (shouldInit) {
      setTimeout(async () => {
        console.log("Starting moonlight", details.url);
        await chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          world: "MAIN",
          args: [[details.url]],
          func: async (blockedScripts) => {
            console.log("Initializing moonlight");
            try {
              await window._moonlightBrowserInit();
            } catch (e) {
              console.error(e);
            }

            console.log("Readding scripts");
            try {
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
            } catch (e) {
              console.error(e);
            }
          }
        });
      }, 0);
    }

    if (shouldBlock) return { cancel: true };
  },
  {
    urls: ["https://*.discord.com/assets/*.js", "https://*.discordapp.com/assets/*.js"]
  },
  ["blocking"]
);

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
