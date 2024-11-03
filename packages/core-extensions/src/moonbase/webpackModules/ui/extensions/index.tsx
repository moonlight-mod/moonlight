import { ExtensionLoadSource, ExtensionTag } from "@moonlight-mod/types";
import { ExtensionState } from "../../../types";
import FilterBar, { Filter, defaultFilter } from "./filterBar";
import ExtensionCard from "./card";

import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { useStateFromStoresObject } from "@moonlight-mod/wp/discord/packages/flux";

import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import { ExtensionCompat } from "@moonlight-mod/core/extension/loader";

const SearchBar: any = Object.values(spacepack.findByCode("hideSearchIcon")[0].exports)[0];

export default function ExtensionsPage() {
  const { extensions, savedFilter } = useStateFromStoresObject([MoonbaseSettingsStore], () => {
    return {
      extensions: MoonbaseSettingsStore.extensions,
      savedFilter: MoonbaseSettingsStore.getExtensionConfigRaw<number>("moonbase", "filter", defaultFilter)
    };
  });

  const [query, setQuery] = React.useState("");

  const filterState = React.useState(defaultFilter);

  let filter: Filter, setFilter: (filter: Filter) => void;
  if (MoonbaseSettingsStore.getExtensionConfigRaw<boolean>("moonbase", "saveFilter", false)) {
    filter = savedFilter ?? defaultFilter;
    setFilter = (filter) => MoonbaseSettingsStore.setExtensionConfig("moonbase", "filter", filter);
  } else {
    filter = filterState[0];
    setFilter = filterState[1];
  }
  const [selectedTags, setSelectedTags] = React.useState(new Set<string>());
  const sorted = Object.values(extensions).sort((a, b) => {
    const aName = a.manifest.meta?.name ?? a.id;
    const bName = b.manifest.meta?.name ?? b.id;
    return aName.localeCompare(bName);
  });

  const filtered = sorted.filter(
    (ext) =>
      (query === "" ||
        ext.manifest.id?.toLowerCase().includes(query) ||
        ext.manifest.meta?.name?.toLowerCase().includes(query) ||
        ext.manifest.meta?.tagline?.toLowerCase().includes(query) ||
        ext.manifest.meta?.description?.toLowerCase().includes(query)) &&
      [...selectedTags.values()].every((tag) => ext.manifest.meta?.tags?.includes(tag as ExtensionTag)) &&
      // This seems very bad, sorry
      !(
        (!(filter & Filter.Core) && ext.source.type === ExtensionLoadSource.Core) ||
        (!(filter & Filter.Normal) && ext.source.type === ExtensionLoadSource.Normal) ||
        (!(filter & Filter.Developer) && ext.source.type === ExtensionLoadSource.Developer) ||
        (!(filter & Filter.Enabled) && MoonbaseSettingsStore.getExtensionEnabled(ext.uniqueId)) ||
        (!(filter & Filter.Disabled) && !MoonbaseSettingsStore.getExtensionEnabled(ext.uniqueId)) ||
        (!(filter & Filter.Installed) && ext.state !== ExtensionState.NotDownloaded) ||
        (!(filter & Filter.Repository) && ext.state === ExtensionState.NotDownloaded)
      ) &&
      (filter & Filter.Incompatible ||
        ext.compat === ExtensionCompat.Compatible ||
        (ext.compat === ExtensionCompat.InvalidApiLevel && ext.hasUpdate))
  );

  // Prioritize extensions with updates
  filtered.sort((a, b) => {
    if (a.hasUpdate && !b.hasUpdate) return -1;
    if (!a.hasUpdate && b.hasUpdate) return 1;
    return 0;
  });

  return (
    <>
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
      <FilterBar filter={filter} setFilter={setFilter} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      {filtered.map((ext) => (
        <ExtensionCard uniqueId={ext.uniqueId} key={ext.uniqueId} />
      ))}
    </>
  );
}
