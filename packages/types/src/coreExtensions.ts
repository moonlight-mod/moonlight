import { FluxDefault, Store } from "./discord/common/Flux";
import { CommonComponents as CommonComponents_ } from "./coreExtensions/components";
import { Dispatcher } from "flux";
import React from "react";
import {
  WebpackModule,
  WebpackModuleFunc,
  WebpackRequireType
} from "./discord";

export type Spacepack = {
  inspect: (module: number | string) => WebpackModuleFunc | null;
  findByCode: (...args: (string | RegExp)[]) => any[];
  findByExports: (...args: string[]) => any[];
  require: WebpackRequireType;
  modules: Record<string, WebpackModuleFunc>;
  cache: Record<string, any>;
  findObjectFromKey: (exports: Record<string, any>, key: string) => any | null;
  findObjectFromValue: (exports: Record<string, any>, value: any) => any | null;
  findObjectFromKeyValuePair: (
    exports: Record<string, any>,
    key: string,
    value: any
  ) => any | null;
  findFunctionByStrings: (
    exports: Record<string, any>,
    ...strings: (string | RegExp)[]
    // eslint-disable-next-line @typescript-eslint/ban-types
  ) => Function | null;
  lazyLoad: (
    find: string | RegExp | (string | RegExp)[],
    chunk: RegExp,
    module: RegExp
  ) => Promise<any>;
  filterReal: (modules: WebpackModule[]) => WebpackModule[];
};

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
      _moonlight_submenu?: () => any;
    };

export type Settings = {
  ourSections: SettingsSection[];
  sectionNames: string[];

  addSection: (
    section: string,
    label: string,
    element: React.FunctionComponent,
    color?: string | null,
    pos?: number,
    notice?: NoticeProps
  ) => void;

  addDivider: (pos: number | null) => void;
  addHeader: (label: string, pos: number | null) => void;
  _mutateSections: (sections: SettingsSection[]) => SettingsSection[];
};

export type CommonReact = typeof import("react");
export type CommonFlux = FluxDefault;
export type CommonComponents = CommonComponents_; // lol
export type CommonFluxDispatcher = Dispatcher<any>;

export * as Markdown from "./coreExtensions/markdown";
