const cors: string[] = [];
const blocked: string[] = [];

export function registerCors(url: string) {
  cors.push(url);
}

export function registerBlocked(url: string) {
  blocked.push(url);
}

export function getDynamicCors() {
  return {
    cors,
    blocked
  };
}
