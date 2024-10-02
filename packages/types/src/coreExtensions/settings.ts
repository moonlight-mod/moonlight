import React, { ReactElement } from "react";
import type { Store } from "@moonlight-mod/mappings/discord/packages/flux";

export type NoticeProps = {
  stores: Store<any>[];
  element: React.FunctionComponent;
};

export type SettingsSection =
  | { section: "DIVIDER"; pos: number }
  | { section: "HEADER"; label: string; pos: number }
  | {
      section: string;
      label: string;
      color: string | null;
      element: React.FunctionComponent;
      pos: number;
      notice?: NoticeProps;
      _moonlight_submenu?: () => ReactElement | ReactElement[];
    };

export type Settings = {
  ourSections: SettingsSection[];
  sectionNames: string[];
  sectionMenuItems: Record<string, ReactElement[]>;

  addSection: (
    section: string,
    label: string,
    element: React.FunctionComponent,
    color?: string | null,
    pos?: number,
    notice?: NoticeProps
  ) => void;
  addSectionMenuItems: (section: string, ...items: ReactElement[]) => void;

  addDivider: (pos: number | null) => void;
  addHeader: (label: string, pos: number | null) => void;
  _mutateSections: (sections: SettingsSection[]) => SettingsSection[];
};
