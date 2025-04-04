export type MoonlightFS = {
  readFile: (path: string) => Promise<Uint8Array>;
  readFileString: (path: string) => Promise<string>;
  writeFile: (path: string, data: Uint8Array) => Promise<void>;
  writeFileString: (path: string, data: string) => Promise<void>;
  unlink: (path: string) => Promise<void>;

  readdir: (path: string) => Promise<string[]>;
  mkdir: (path: string) => Promise<void>;
  rmdir: (path: string) => Promise<void>;

  exists: (path: string) => Promise<boolean>;
  isFile: (path: string) => Promise<boolean>;
  isDir: (path: string) => Promise<boolean>;

  join: (...parts: string[]) => string;
  dirname: (path: string) => string;
};
