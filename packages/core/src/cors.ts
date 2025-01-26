const cors: string[] = [];
const blocked: string[] = [];
const csp: Record<string, string[]> = {};

export function registerCors(url: string) {
  cors.push(url);
}

export function registerBlocked(url: string) {
  blocked.push(url);
}

export function registerCsp(policy: string, urls: string[]) {
  csp[policy] ??= [];
  csp[policy].push(...urls);
}

export function getDynamicCors() {
  return {
    cors,
    blocked,
    csp
  };
}
