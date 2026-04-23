import { ModuleExportType } from "@moonlight-mod/moonmap";
import type { ComponentType, Context, ReactNode } from "react";
import register from "../../../../../registry";
import type { Density, Themes } from "../../../packages/tokens";

type ThemeContext = {
  theme: Themes;
  primaryColor: string | null;
  secondaryColor: string | null;
  gradient: any | null; // FIXME
  flags: number;
  constrast: number;
  saturation: number;
  density: Density;
  disableAdaptiveTheme: boolean;
  reduceAdaptiveTheme: boolean;
};

type Exports = {
  createThemedContext: (context: ThemeContext) => ThemeContext & { key: string };
  useThemeContext: () => ThemeContext;
  FALLBACK_THEME_CONTEXT_VALUE: ThemeContext;
  ThemeContext: Context<ThemeContext>;
  UseThemeContext: ComponentType<{
    children: (context: ThemeContext) => ReactNode;
  }>;
};
export default Exports;

register((moonmap) => {
  const name = "discord/design/components/ThemeContextProvider/ThemeContext";
  moonmap.register({
    name,
    find: 'throw Error("useThemeContext must be used within a ThemeContext.Provider")',
    process({ id }) {
      moonmap.addModule(id, name);

      moonmap.addExport(name, "createThemedContext", {
        type: ModuleExportType.Function,
        find: "=JSON.stringify("
      });
      moonmap.addExport(name, "useThemeContext", {
        type: ModuleExportType.Function,
        find: 'throw Error("useThemeContext must be used within a ThemeContext.Provider")'
      });
      moonmap.addExport(name, "FALLBACK_THEME_CONTEXT_VALUE", {
        type: ModuleExportType.Key,
        find: "disableAdaptiveTheme"
      });
      moonmap.addExport(name, "ThemeContext", {
        type: ModuleExportType.Key,
        find: "Consumer"
      });
      moonmap.addExport(name, "UseThemeContext", {
        type: ModuleExportType.Function,
        find: ".Fragment,{children:"
      });

      return true;
    }
  });
});
