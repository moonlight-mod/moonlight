import { deflateSync, inflateSync } from "node:zlib";

export function toBinary(buf: string): Uint8Array {
  return new Uint8Array(deflateSync(new TextEncoder().encode(buf)));
}

export function fromBinary(buf: Uint8Array): string {
  return new TextDecoder().decode(inflateSync(buf));
}
