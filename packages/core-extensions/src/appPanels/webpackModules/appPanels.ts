import type { AppPanels as AppPanelsType } from "@moonlight-mod/types/coreExtensions/appPanels";
import React from "@moonlight-mod/wp/react";

const panels: Record<string, React.FC<any>> = {};

export const AppPanels: AppPanelsType = {
  addPanel(section, element) {
    panels[section] = element;
  },
  getPanels(panel) {
    return Object.entries(panels).map(([section, element]) =>
      React.createElement(
        panel,
        {
          section
        },
        React.createElement(element)
      )
    );
  }
};

export default AppPanels;
