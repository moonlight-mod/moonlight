import type LunAST from "@moonlight-mod/lunast";
import type Moonmap from "@moonlight-mod/moonmap";

type Callback = (moonmap: Moonmap, lunast: LunAST) => void;

export const cbs = new Set<Callback>();

export default function register(cb: Callback) {
  cbs.add(cb);
}
