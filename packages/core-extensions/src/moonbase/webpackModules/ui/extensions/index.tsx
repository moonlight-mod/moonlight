import { ExtensionLoadSource, ExtensionTag } from "@moonlight-mod/types";
import { ExtensionState } from "../../../types";
import FilterBar, { Filter, defaultFilter } from "./filterBar";
import ExtensionCard from "./card";

import React from "@moonlight-mod/wp/discord/packages/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import Flux from "@moonlight-mod/wp/discord/packages/flux";

import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";

const SearchBar: any = Object.values(
  spacepack.findByCode("Messages.SEARCH", "hideSearchIcon")[0].exports
)[0];

export default function ExtensionsPage() {
  const moonbaseId = MoonbaseSettingsStore.getExtensionUniqueId("moonbase")!;
  const { extensions, savedFilter } = Flux.useStateFromStoresObject(
    [MoonbaseSettingsStore],
    () => {
      return {
        extensions: MoonbaseSettingsStore.extensions,
        savedFilter: MoonbaseSettingsStore.getExtensionConfig(
          moonbaseId,
          "filter"
        )
      };
    }
  );

  const [query, setQuery] = React.useState("");

  let filter: Filter, setFilter: (filter: Filter) => void;
  if (moonlight.getConfigOption<boolean>("moonbase", "saveFilter")) {
    filter = savedFilter ?? defaultFilter;
    setFilter = (filter) =>
      MoonbaseSettingsStore.setExtensionConfig(moonbaseId, "filter", filter);
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
          MoonbaseSettingsStore.getExtensionEnabled(ext.uniqueId)) ||
        (!(filter & Filter.Disabled) &&
          !MoonbaseSettingsStore.getExtensionEnabled(ext.uniqueId)) ||
        (!(filter & Filter.Installed) &&
          ext.state !== ExtensionState.NotDownloaded) ||
        (!(filter & Filter.Repository) &&
          ext.state === ExtensionState.NotDownloaded)
      )
  );

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
      <FilterBar
        filter={filter}
        setFilter={setFilter}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
      {filtered.map((ext) => (
        <ExtensionCard uniqueId={ext.uniqueId} key={ext.id} />
      ))}
    </>
  );
}
