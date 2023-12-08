import {
  ExtensionLoadSource,
  ExtensionTag,
  WebpackRequireType
} from "@moonlight-mod/types";
import { ExtensionState } from "../../types";
import filterBar, { defaultFilter } from "./filterBar";
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
    const { extensions } = Flux.useStateFromStoresObject(
      [MoonbaseSettingsStore],
      () => {
        return { extensions: MoonbaseSettingsStore.extensions };
      }
    );

    const [query, setQuery] = React.useState("");
    const [filter, setFilter] = React.useState({ ...defaultFilter });
    const [selectedTags, setSelectedTags] = React.useState(new Set<string>());
    const TitleBarClasses = spacepack.findByCode("iconWrapper:", "children:")[0]
      .exports;
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
          (!filter.core && ext.source.type === ExtensionLoadSource.Core) ||
          (!filter.normal && ext.source.type === ExtensionLoadSource.Normal) ||
          (!filter.developer &&
            ext.source.type === ExtensionLoadSource.Developer) ||
          (!filter.enabled &&
            MoonbaseSettingsStore.getExtensionEnabled(ext.id)) ||
          (!filter.disabled &&
            !MoonbaseSettingsStore.getExtensionEnabled(ext.id)) ||
          (!filter.installed && ext.state !== ExtensionState.NotDownloaded) ||
          (!filter.repository && ext.state === ExtensionState.NotDownloaded)
        )
    );

    return (
      <>
        <div
          className={`${TitleBarClasses.children} ${Margins.marginBottom20}`}
        >
          <Text
            className={TitleBarClasses.titleWrapper}
            variant="heading-lg/semibold"
            tag="h2"
          >
            Extensions
          </Text>
        </div>
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
            setFilter={setFilter}
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
