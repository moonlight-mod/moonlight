import {
  ExtensionLoadSource,
  ExtensionTag,
  WebpackRequireType
} from "@moonlight-mod/types";
import { ExtensionState } from "../../types";
import filterBar, { Filter, defaultFilter } from "./filterBar";
import card from "./card";

export default (require: WebpackRequireType) => {
  const React = require("common_react");
  const spacepack = require("spacepack_spacepack").spacepack;
  const Flux = require("common_flux");

  const { MoonbaseSettingsStore } =
    require("moonbase_stores") as typeof import("../../webpackModules/stores");

  const ExtensionCard = card(require);
  const FilterBar = React.lazy(() =>
    filterBar(require).then((c) => ({ default: c }))
  );

  const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;
  const SearchBar = spacepack.findByCode("Messages.SEARCH", "hideSearchIcon")[0]
    .exports.default;
  const { Text } = require("common_components");

  return function ExtensionsPage() {
    const { extensions, savedFilter } = Flux.useStateFromStoresObject(
      [MoonbaseSettingsStore],
      () => {
        return {
          extensions: MoonbaseSettingsStore.extensions,
          savedFilter: MoonbaseSettingsStore.getExtensionConfig(
            "moonbase",
            "filter"
          )
        };
      }
    );

    const [query, setQuery] = React.useState("");

    // const [filter, setFilter] = React.useState(
    //   moonlight.getConfigOption<boolean>("moonbase", "saveFilters")
    //     ? moonlight.getConfigOption<number>("moonbase", "filters") ??
    //         defaultFilter
    //     : defaultFilter
    // );
    let filter: Filter, setFilter: (filter: Filter) => void;
    if (moonlight.getConfigOption<boolean>("moonbase", "saveFilter")) {
      filter = savedFilter ?? defaultFilter;
      setFilter = (filter) =>
        MoonbaseSettingsStore.setExtensionConfig("moonbase", "filter", filter);
    } else {
      const state = React.useState(defaultFilter);
      filter = state[0];
      setFilter = state[1];
    }
    const [selectedTags, setSelectedTags] = React.useState(new Set<string>());
    const sorted = Object.values(extensions).sort((a, b) => {
      const aName = a.manifest.meta?.name ?? a.id;
      const bName = b.manifest.meta?.name ?? b.id;
      return aName.localeCompare(bName);
    });

    const filtered = sorted.filter(
      (ext) =>
        (ext.manifest.meta?.name?.toLowerCase().includes(query) ||
          ext.manifest.meta?.tagline?.toLowerCase().includes(query) ||
          ext.manifest.meta?.description?.toLowerCase().includes(query)) &&
        [...selectedTags.values()].every(
          (tag) => ext.manifest.meta?.tags?.includes(tag as ExtensionTag)
        ) &&
        // This seems very bad, sorry
        !(
          (!(filter & Filter.Core) &&
            ext.source.type === ExtensionLoadSource.Core) ||
          (!(filter & Filter.Normal) &&
            ext.source.type === ExtensionLoadSource.Normal) ||
          (!(filter & Filter.Developer) &&
            ext.source.type === ExtensionLoadSource.Developer) ||
          (!(filter & Filter.Enabled) &&
            MoonbaseSettingsStore.getExtensionEnabled(ext.id)) ||
          (!(filter & Filter.Disabled) &&
            !MoonbaseSettingsStore.getExtensionEnabled(ext.id)) ||
          (!(filter & Filter.Installed) &&
            ext.state !== ExtensionState.NotDownloaded) ||
          (!(filter & Filter.Repository) &&
            ext.state === ExtensionState.NotDownloaded)
        )
    );

    return (
      <>
        <Text
          className={Margins.marginBottom20}
          variant="heading-lg/semibold"
          tag="h2"
        >
          Extensions
        </Text>
        <SearchBar
          size={SearchBar.Sizes.MEDIUM}
          query={query}
          onChange={(v: string) => setQuery(v.toLowerCase())}
          onClear={() => setQuery("")}
          autoFocus={true}
          autoComplete="off"
          inputProps={{
            autoCapitalize: "none",
            autoCorrect: "off",
            spellCheck: "false"
          }}
        />
        <React.Suspense
          fallback={<div className={Margins.marginBottom20}></div>}
        >
          <FilterBar
            filter={filter}
            setFilter={(filter) => {
              // if (
              //   MoonbaseSettingsStore.getConfigOption("saveExtensionFilter")
              // ) {
              //   MoonbaseSettingsStore.setConfigOption(
              //     "extensionsFilter",
              //     filter
              //   );
              // }
              setFilter(filter);
            }}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </React.Suspense>
        {filtered.map((ext) => (
          <ExtensionCard id={ext.id} key={ext.id} />
        ))}
      </>
    );
  };
};
