import type LunAST from ".";
import type { Program } from "estree-toolkit/dist/generated/types";

export type Processor = {
  name: string;
  find?: string | RegExp; // TODO: allow multiple finds
  priority?: number;
  dependencies?: string[]; // FIXME: this can skip modules
  process: (state: ProcessorState) => boolean;
};
export type ProcessorState = {
  id: string;
  ast: Program;
  lunast: LunAST;
  markDirty: () => void;
};
