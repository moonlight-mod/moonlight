import type LunAST from ".";
import type { Program } from "estree-toolkit/dist/generated/types";

export type Processor = {
  name: string;
  find?: (string | RegExp)[] | (string | RegExp);
  priority?: number;
  manual?: boolean;
  process: (state: ProcessorState) => boolean;
};
export type ProcessorState = {
  id: string;
  ast: Program;
  lunast: LunAST;
  markDirty: () => void;
  trigger: (id: string, tag: string) => void;
};
