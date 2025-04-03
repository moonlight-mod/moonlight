import { ExtensionCompat } from "@moonlight-mod/core/extension/loader";
import { ExtensionLoadSource, ExtensionTag } from "@moonlight-mod/types";
import ErrorBoundary from "@moonlight-mod/wp/common_ErrorBoundary";
import {
  Button,
  CircleInformationIcon,
  FormDivider,
  XSmallIcon
} from "@moonlight-mod/wp/discord/components/common/index";

import PanelButton from "@moonlight-mod/wp/discord/components/common/PanelButton";
import { useStateFromStoresObject } from "@moonlight-mod/wp/discord/packages/flux";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";

import { ExtensionState } from "../../../types";
import HelpMessage from "../HelpMessage";
import ExtensionCard from "./card";
import FilterBar, { defaultFilter, Filter } from "./filterBar";

const SearchBar = spacepack.require("discord/uikit/search/SearchBar").default;

const validTags: string[] = Object.values(ExtensionTag);

export default function ExtensionsPage() {
  const { extensions, savedFilter } = useStateFromStoresObject([MoonbaseSettingsStore], () => {
    return {
      extensions: MoonbaseSettingsStore.extensions,
      savedFilter: MoonbaseSettingsStore.getExtensionConfigRaw<number>("moonbase", "filter", defaultFilter)
    };
  });

  const [query, setQuery] = React.useState("");
  const [hitUpdateAll, setHitUpdateAll] = React.useState(false);

  const filterState = React.useState(defaultFilter);

  let filter: Filter, setFilter: (filter: Filter) => void;
  if (MoonbaseSettingsStore.getExtensionConfigRaw<boolean>("moonbase", "saveFilter", false)) {
    filter = savedFilter ?? defaultFilter;
    setFilter = filter => MoonbaseSettingsStore.setExtensionConfig("moonbase", "filter", filter);
  }
  else {
    filter = filterState[0];
    setFilter = filterState[1];
  }

  const [selectedTags, setSelectedTags] = React.useState(new Set<string>());
  const selectTag = React.useCallback(
    (tag: string) => {
      const newState = new Set(selectedTags);
      if (validTags.includes(tag)) newState.add(tag);
      setSelectedTags(newState);
    },
    [selectedTags]
  );

  const sorted = Object.values(extensions).sort((a, b) => {
    const aName = a.manifest.meta?.name ?? a.id;
    const bName = b.manifest.meta?.name ?? b.id;
    return aName.localeCompare(bName);
  });

  const filtered = sorted.filter(
    ext =>
      (query === ""
        || ext.manifest.id?.toLowerCase().includes(query)
        || ext.manifest.meta?.name?.toLowerCase().includes(query)
        || ext.manifest.meta?.tagline?.toLowerCase().includes(query)
        || (ext.manifest?.settings != null
          && Object.entries(ext.manifest.settings).some(([key, setting]) =>
            (setting.displayName ?? key).toLowerCase().includes(query)
          ))
          || (ext.manifest?.meta?.authors != null
            && ext.manifest.meta.authors.some(author =>
              (typeof author === "string" ? author : author.name).toLowerCase().includes(query)
            ))
            || ext.manifest.meta?.description?.toLowerCase().includes(query))
          && [...selectedTags.values()].every(tag => ext.manifest.meta?.tags?.includes(tag as ExtensionTag))
      // This seems very bad, sorry
          && !(
            (!(filter & Filter.Core) && ext.source.type === ExtensionLoadSource.Core)
            || (!(filter & Filter.Normal) && ext.source.type === ExtensionLoadSource.Normal)
            || (!(filter & Filter.Developer) && ext.source.type === ExtensionLoadSource.Developer)
            || (!(filter & Filter.Enabled) && MoonbaseSettingsStore.getExtensionEnabled(ext.uniqueId))
            || (!(filter & Filter.Disabled) && !MoonbaseSettingsStore.getExtensionEnabled(ext.uniqueId))
            || (!(filter & Filter.Installed) && ext.state !== ExtensionState.NotDownloaded)
            || (!(filter & Filter.Repository) && ext.state === ExtensionState.NotDownloaded)
          )
          && (filter & Filter.Incompatible
            || ext.compat === ExtensionCompat.Compatible
            || (ext.compat === ExtensionCompat.InvalidApiLevel && ext.hasUpdate))
          && (filter & Filter.Deprecated
            || ext.manifest?.meta?.deprecated !== true
            || ext.state !== ExtensionState.NotDownloaded)
  );

  // Prioritize extensions with updates
  const filteredWithUpdates = filtered.filter(ext => ext!.hasUpdate);
  const filteredWithoutUpdates = filtered.filter(ext => !ext!.hasUpdate);

  return (
    <>
      <SearchBar
        autoComplete="off"
        autoFocus={true}
        inputProps={{
          autoCapitalize: "none",
          autoCorrect: "off",
          spellCheck: "false"
        }}
        onChange={(v: string) => setQuery(v.toLowerCase())}
        onClear={() => setQuery("")}
        query={query}
        size={SearchBar.Sizes.MEDIUM}
      />
      <FilterBar filter={filter} selectedTags={selectedTags} setFilter={setFilter} setSelectedTags={setSelectedTags} />

      {filteredWithUpdates.length > 0 && (
        <HelpMessage
          className="moonbase-extension-update-section"
          icon={CircleInformationIcon}
          text="Extension updates are available"
        >
          <div className="moonbase-help-message-buttons">
            <Button
              color={Button.Colors.BRAND}
              disabled={hitUpdateAll}
              onClick={() => {
                setHitUpdateAll(true);
                MoonbaseSettingsStore.updateAllExtensions();
              }}
              size={Button.Sizes.TINY}
            >
              Update all
            </Button>
            <PanelButton
              icon={XSmallIcon}
              onClick={() => {
                MoonbaseSettingsStore.dismissAllExtensionUpdates();
              }}
            />
          </div>
        </HelpMessage>
      )}

      {filteredWithUpdates.map(ext => (
        <ErrorBoundary>
          <ExtensionCard key={ext.uniqueId} selectTag={selectTag} uniqueId={ext.uniqueId} />
        </ErrorBoundary>
      ))}
      {filteredWithUpdates.length > 0 && filteredWithoutUpdates.length > 0 && (
        <FormDivider className="moonbase-update-divider" />
      )}
      {filteredWithoutUpdates.map(ext => (
        <ErrorBoundary>
          <ExtensionCard key={ext.uniqueId} selectTag={selectTag} uniqueId={ext.uniqueId} />
        </ErrorBoundary>
      ))}
    </>
  );
}
