/// <reference types="flux" />
/// <reference types="react" />

import "./modules";
import type LunAST from "@moonlight-mod/lunast";

import type Moonmap from "@moonlight-mod/moonmap";
import { cbs } from "./registry";
import { MappedModules, WebpackRequire } from "./types";

export default function load(moonmap: Moonmap, lunast: LunAST) {
  for (const cb of cbs) {
    cb(moonmap, lunast);
  }
}

export type { MappedModules, WebpackRequire };
