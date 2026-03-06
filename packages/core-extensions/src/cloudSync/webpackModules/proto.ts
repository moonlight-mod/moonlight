// See: https://gist.github.com/dolfies/7a2d589a60c4c3eba4cc2197be0f0b89
export { CustomUserSettings } from "../proto/settings";

const natives = moonlight.getNatives("cloudSync");

export function toBinary(buf: string): Uint8Array {
  return natives.toBinary(buf);
}

export function fromBinary(buf: Uint8Array): string {
  return natives.fromBinary(buf);
}
