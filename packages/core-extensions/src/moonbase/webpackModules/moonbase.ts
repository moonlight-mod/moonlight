import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import type { Moonbase } from "@moonlight-mod/types/coreExtensions/moonbase";

export const moonbase: Moonbase = {
  registerConfigComponent(ext, option, component) {
    MoonbaseSettingsStore.registerConfigComponent(ext, option, component);
  }
};

export default moonbase;
