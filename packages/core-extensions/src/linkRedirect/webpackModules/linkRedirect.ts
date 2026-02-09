import type {
  LinkRedirectCallback,
  LinkRedirect as LinkRedirectType
} from "@moonlight-mod/types/coreExtensions/linkRedirect";

const logger = moonlight.getLogger("Link Redirect");

const linkRedirect: LinkRedirectType = {
  callbacks: new Map<string, LinkRedirectCallback>(),
  addCallback(name, callback) {
    if (linkRedirect.callbacks.has(name)) logger.warn(`Overwriting already existing link callback "${name}"!!`);
    linkRedirect.callbacks.set(name, callback);
  },
  _runCallbacks(href) {
    for (const [name, callback] of linkRedirect.callbacks.entries()) {
      try {
        const newUrl = callback(href);
        if (newUrl == null) {
          logger.error(`Link callback "${name}" returned nothing.`);
          continue;
        }

        href = newUrl;
      } catch (err) {
        logger.error(`Failed to execute link callback "${name}":`, err);
      }
    }

    return href;
  }
};

export default linkRedirect;
