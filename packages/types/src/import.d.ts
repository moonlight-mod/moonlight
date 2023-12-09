declare module "@moonlight-mod/wp/spacepack_spacepack" {
  import { CoreExtensions } from "@moonlight-mod/types";
  export const spacepack: CoreExtensions.Spacepack;
  export default spacepack;
}

declare module "@moonlight-mod/wp/common_components" {
  import { CoreExtensions } from "@moonlight-mod/types";
  const components: CoreExtensions.CommonComponents;
  export default components;
}

declare module "@moonlight-mod/wp/common_flux" {
  import { CoreExtensions } from "@moonlight-mod/types";
  const Flux: CoreExtensions.CommonFlux;
  export default Flux;
}

declare module "@moonlight-mod/wp/common_fluxDispatcher" {
  import { CoreExtensions } from "@moonlight-mod/types";
  const Dispatcher: CoreExtensions.CommonFluxDispatcher;
  export default Dispatcher;
}

declare module "@moonlight-mod/wp/common_react" {
  import React from "react";
  export = React;
}

declare module "@moonlight-mod/wp/settings_settings" {
  import { CoreExtensions } from "@moonlight-mod/types";
  export const Settings: CoreExtensions.Settings;
  export default Settings;
}

declare module "@moonlight-mod/wp/markdown_markdown" {
  import { CoreExtensions } from "@moonlight-mod/types";
  const Markdown: CoreExtensions.Markdown.Markdown;
  export = Markdown;
}
