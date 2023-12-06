declare module "@moonlight-mod/wp/spacepack_spacepack" {
  import { Spacepack } from "@moonlight-mod/types/coreExtensions";
  export const spacepack: Spacepack;
  export default spacepack;
}

declare module "@moonlight-mod/wp/common_components" {
  import { CommonComponents } from "@moonlight-mod/types/coreExtensions";
  const components: CommonComponents;
  export default components;
}

declare module "@moonlight-mod/wp/common_flux" {
  import { CommonFlux } from "@moonlight-mod/types/coreExtensions";
  const Flux: CommonFlux;
  export default Flux;
}

declare module "@moonlight-mod/wp/common_fluxDispatcher" {
  import { CommonFluxDispatcher } from "@moonlight-mod/types/coreExtensions";
  const Dispatcher: CommonFluxDispatcher;
  export default Dispatcher;
}
