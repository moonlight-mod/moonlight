import type { Moonbase } from "@moonlight-mod/types/coreExtensions/moonbase";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";

export const moonbase: Moonbase = {
  registerConfigComponent(ext, option, component) {
    MoonbaseSettingsStore.registerConfigComponent(ext, option, component);
  }
};

export default moonbase;
