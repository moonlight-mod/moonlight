import React, { ReactElement } from "react";
import type { Store } from "@moonlight-mod/mappings/discord/packages/flux/Store";

export type NoticeProps = {
  stores: Store<any>[];
  element: React.FunctionComponent;
};

export type SettingsSection =
  | { section: "DIVIDER"; pos: number | ((sections: SettingsSection[]) => number) }
  | { section: "HEADER"; label: string; pos: number | ((sections: SettingsSection[]) => number) }
  | {
      section: string;
      label: string;
      color: string | null;
      element: React.FunctionComponent;
      pos: number | ((sections: SettingsSection[]) => number);
      notice?: NoticeProps;
      _moonlight_submenu?: () => ReactElement | ReactElement[];
    };

export type Settings = {
  ourSections: SettingsSection[];
  sectionNames: string[];
  sectionMenuItems: Record<string, ReactElement[]>;

  /**
   * Registers a new section in the settings menu.
   * @param section The section ID
   * @param label The label for the section
   * @param element The React component to render
   * @param color A color to use for the section
   * @param pos The position in the settings menu to place the section
   * @param notice A notice to display when in the section
   */
  addSection: (
    section: string,
    label: string,
    element: React.FunctionComponent,
    color?: string | null,
    pos?: number | ((sections: SettingsSection[]) => number),
    notice?: NoticeProps
  ) => void;

  /**
   * Adds new items to a section in the settings menu.
   * @param section The section ID
   * @param items The React components to render
   */
  addSectionMenuItems: (section: string, ...items: ReactElement[]) => void;

  /**
   * Places a divider in the settings menu.
   * @param pos The position in the settings menu to place the divider
   */
  addDivider: (pos: number | ((sections: SettingsSection[]) => number) | null) => void;

  /**
   * Places a header in the settings menu.
   * @param pos The position in the settings menu to place the header
   */
  addHeader: (label: string, pos: number | ((sections: SettingsSection[]) => number) | null) => void;

  /**
   * @private
   */
  _mutateSections: (sections: SettingsSection[]) => SettingsSection[];
};
