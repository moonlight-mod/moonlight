/**
 * @param href The original URL
 * @returns string The new URL, or the original URL if no transformations are done
 */
export type LinkRedirectCallback = (href: string) => string;

export type LinkRedirect = {
  /**
   * @private
   */
  callbacks: Map<string, LinkRedirectCallback>;

  /**
   * Adds a link redirect callback
   * @param name Unique identifier for this callback
   * @param callback Function to transform the URL. Return the original URL to skip transformation.
   */
  addCallback: (name: string, callback: LinkRedirectCallback) => void;

  /**
   * @private
   */
  _runCallbacks: (href: string) => string;
};

export type Exports = {
  default: LinkRedirect;
};
