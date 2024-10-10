// https://github.com/NotNite/brc-save-editor/blob/main/src/lib/binary.ts
export interface BinaryInterface {
  data: Uint8Array;
  view: DataView;
  length: number;
  position: number;
}

export class BinaryReader implements BinaryInterface {
  data: Uint8Array;
  view: DataView;
  length: number;
  position: number;

  constructor(data: Uint8Array) {
    this.data = data;
    this.view = new DataView(data.buffer);

    this.length = data.length;
    this.position = 0;
  }

  readByte() {
    return this._read(this.view.getInt8, 1);
  }

  readBoolean() {
    return this.readByte() !== 0;
  }

  readInt32() {
    return this._read(this.view.getInt32, 4);
  }

  readUInt32() {
    return this._read(this.view.getUint32, 4);
  }

  readSingle() {
    return this._read(this.view.getFloat32, 4);
  }

  readInt64() {
    return this._read(this.view.getBigInt64, 8);
  }

  readString(length: number) {
    const result = this.read(length);
    return new TextDecoder().decode(result);
  }

  read(length: number) {
    const data = this.data.subarray(this.position, this.position + length);
    this.position += length;
    return data;
  }

  private _read<T>(
    func: (position: number, littleEndian?: boolean) => T,
    length: number
  ): T {
    const result = func.call(this.view, this.position, true);
    this.position += length;
    return result;
  }
}
