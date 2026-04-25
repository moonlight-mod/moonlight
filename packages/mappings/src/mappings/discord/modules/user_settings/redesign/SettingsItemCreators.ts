import { ModuleExportType } from "@moonlight-mod/moonmap";
import register from "../../../../../registry";
import type { Store } from "../../../packages/flux/Store";
import type { ItemType } from "./SettingsItemConstants";

export type FinalizedItem<Props extends GenericProps, Type extends ItemType> = {
  key: string;
  type: Type;

  // assuming buildLayout was called
  layout?: FinalizedItem<Props, ItemType>[];
  parent?: FinalizedItem<Props, ItemType>;
} & Props;

export type FinalizedItemWithoutLayout<Props extends GenericPropsWithoutLayout, Type extends ItemType> = {
  key: string;
  type: Type;
} & Props;

export type AnyFinalizedItem =
  | FinalizedItem<GenericProps, ItemType>
  | FinalizedItemWithoutLayout<GenericPropsWithoutLayout, ItemType>;

export type GenericProps = {
  buildLayout: () => AnyFinalizedItem[];
  usePredicate?: () => boolean;
  getLegacySearchKey?: () => string;
  useTitle?: () => string;
  useNavigationTitle?: () => string;
  useSearchTerms?: () => string[];
};

export type GenericPropsWithoutLayout = Omit<GenericProps, "buildLayout">;

export type SectionProps = {
  hoised?: boolean;
  useLabel?: () => string;
} & GenericProps;

export type SidebarItemProps = {
  icon?: React.FC<any>;
  trailing?: {
    getDismissibleContentTypes?: () => number[]; // DismissibleContentType enum
  } /*& (
    | {
        type: TrailingType.BADGE_NEW;
        badgeComponent?: React.FC<{}>;
      }
    | {
        type: TrailingType.STRONGLY_DISCOURAGED_CUSTOM;
        useDecoration: (dismissible: number, selected: boolean) => React.ReactNode;
      }
    | {
        type: TrailingType.BADGE_COUNT;
        useCount: () => number;
      }
  )*/;
} & GenericProps;

export enum DecorationTypes {
  STRONGLY_DISCOURAGED_CUSTOM,
  INLINE_NOTICE
}

export type PanelProps = {
  useBadge?: React.FC<any>;
  notice: {
    stores: Store<any>[];
    element: React.FunctionComponent;
  };
  decoration: {
    type: DecorationTypes.STRONGLY_DISCOURAGED_CUSTOM;
    component: React.FC<any>;
  };
} & GenericProps;

export type PaneProps = {
  render: React.FC<any>;
} & GenericProps;

export type TabProps = {
  getTitle?: () => string;
  initialize?: () => void;
  onItemSelect?: () => void;
} & GenericProps;

export type CustomProps = {
  Component: React.FC<any>;
} & GenericPropsWithoutLayout;

// TODO: type the rest, only typing whats used to get moonbase working

type Exports = {
  createRoot: (props: GenericProps) => FinalizedItem<GenericProps, ItemType.ROOT>;
  createSection: (key: string, props: SectionProps) => FinalizedItem<SectionProps, ItemType.SECTION>;
  createSidebarItem: (key: string, props: SidebarItemProps) => FinalizedItem<SidebarItemProps, ItemType.SIDEBAR_ITEM>;
  createPanel: (key: string, props: PanelProps) => FinalizedItem<PanelProps, ItemType.PANEL>;
  createTabItem: (key: string, props: TabProps) => FinalizedItem<TabProps, ItemType.TAB_ITEM>;
  createCustom: (key: string, props: CustomProps) => FinalizedItemWithoutLayout<CustomProps, ItemType.CUSTOM>;
};
export default Exports;

register((moonmap, lunast) => {
  const name = "discord/modules/user_settings/redesign/SettingsItemCreators";

  lunast.register({
    name,
    find: '("$Root",',
    process({ id }) {
      moonmap.addModule(id, name);

      // wrapped in a function that calls the actual function for whatever reason
      /*moonmap.addExport(name, "buildItems", {
        type: ModuleExportType.Function,
        find: ".buildLayout().map"
      });*/

      moonmap.addExport(name, "createRoot", {
        type: ModuleExportType.Function,
        find: '"$Root"'
      });
      moonmap.addExport(name, "createSection", {
        type: ModuleExportType.Function,
        find: ".SECTION,"
      });
      moonmap.addExport(name, "createSidebarItem", {
        type: ModuleExportType.Function,
        find: ".SIDEBAR_ITEM,"
      });
      moonmap.addExport(name, "createPanel", {
        type: ModuleExportType.Function,
        find: ".PANEL,"
      });
      moonmap.addExport(name, "createTabItem", {
        type: ModuleExportType.Function,
        find: ".TAB_ITEM,"
      });
      moonmap.addExport(name, "createSplit", {
        type: ModuleExportType.Function,
        find: ".SPLIT,"
      });
      moonmap.addExport(name, "createCategory", {
        type: ModuleExportType.Function,
        find: ".CATEGORY,"
      });
      moonmap.addExport(name, "createAccordion", {
        type: ModuleExportType.Function,
        find: ".ACCORDION,"
      });
      moonmap.addExport(name, "createList", {
        type: ModuleExportType.Function,
        find: ".LIST,"
      });
      moonmap.addExport(name, "createRelated", {
        type: ModuleExportType.Function,
        find: ".RELATED,"
      });
      moonmap.addExport(name, "createFieldSet", {
        type: ModuleExportType.Function,
        find: ".FIELD_SET,"
      });
      moonmap.addExport(name, "createStatic", {
        type: ModuleExportType.Function,
        find: ".STATIC,"
      });
      moonmap.addExport(name, "createButton", {
        type: ModuleExportType.Function,
        find: ".BUTTON,"
      });
      moonmap.addExport(name, "createToggle", {
        type: ModuleExportType.Function,
        find: ".TOGGLE,"
      });
      moonmap.addExport(name, "createSlider", {
        type: ModuleExportType.Function,
        find: ".SLIDER,"
      });
      moonmap.addExport(name, "createSelect", {
        type: ModuleExportType.Function,
        find: ".SELECT,"
      });
      moonmap.addExport(name, "createRadio", {
        type: ModuleExportType.Function,
        find: ".RADIO,"
      });
      moonmap.addExport(name, "createNavigator", {
        type: ModuleExportType.Function,
        find: ".NAVIGATOR,"
      });
      moonmap.addExport(name, "createCustom", {
        type: ModuleExportType.Function,
        find: ".CUSTOM,"
      });

      return true;
    }
  });
});
