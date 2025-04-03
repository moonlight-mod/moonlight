// https://github.com/electron/asar
// http://formats.kaitai.io/python_pickle/
import { BinaryReader } from "./util/binary";

/*
  The asar format is kinda bad, especially because it uses multiple pickle
  entries. It spams sizes, expecting us to read small buffers and parse those,
  but we can just take it all through at once without having to create multiple
  BinaryReaders. This implementation might be wrong, though.

  This either has size/offset or files but I can't get the type to cooperate,
  so pretend this is a union.
*/

interface AsarEntry {
  size: number;
  offset: `${number}`; // who designed this

  files?: Record<string, AsarEntry>;
}

export default function extractAsar(file: ArrayBuffer) {
  const array = new Uint8Array(file);
  const br = new BinaryReader(array);

  // two uints, one containing the number '4', to signify that the other uint takes up 4 bytes
  // bravo, electron, bravo
  const _payloadSize = br.readUInt32();
  const _headerSize = br.readInt32();

  const headerStringStart = br.position;
  const headerStringSize = br.readUInt32(); // How big the block is
  const actualStringSize = br.readUInt32(); // How big the string in that block is

  const base = headerStringStart + headerStringSize + 4;

  const string = br.readString(actualStringSize);
  const header: AsarEntry = JSON.parse(string);

  const ret: Record<string, Uint8Array> = {};
  function addDirectory(dir: AsarEntry, path: string) {
    for (const [name, data] of Object.entries(dir.files!)) {
      const fullName = `${path}/${name}`;
      if (data.files != null) {
        addDirectory(data, fullName);
      }
      else {
        br.position = base + Number.parseInt(data.offset);
        const file = br.read(data.size);
        ret[fullName] = file;
      }
    }
  }

  addDirectory(header, "");

  return ret;
}
