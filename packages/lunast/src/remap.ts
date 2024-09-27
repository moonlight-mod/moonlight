import type LunAST from ".";
import type { Program } from "estree-toolkit/dist/generated/types";

export type Processor = {
  name: string;
  find?: string | RegExp;
  priority?: number;
  dependencies?: string[];
  process: (state: ProcessorState) => boolean;
};
export type ProcessorState = {
  id: string;
  ast: Program;
  lunast: LunAST;
};
