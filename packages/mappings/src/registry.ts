import type Moonmap from "@moonlight-mod/moonmap";
import type LunAST from "@moonlight-mod/lunast";

type Callback = (moonmap: Moonmap, lunast: LunAST) => void;

export const cbs = new Set<Callback>();

export default function register(cb: Callback) {
  cbs.add(cb);
}
