import WebpackRequire from "@moonlight-mod/types/discord/require";
import card from "./card";

export enum ExtensionPage {
  Info,
  Description,
  Settings
}

export default (require: typeof WebpackRequire) => {
  const React = require("common_react");
  const spacepack = require("spacepack_spacepack").spacepack;
  const Flux = require("common_flux");

  const { MoonbaseSettingsStore } =
    require("moonbase_stores") as typeof import("../webpackModules/stores");

  const ExtensionCard = card(require);

  const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;
  const SearchBar = spacepack.findByCode("Messages.SEARCH", "hideSearchIcon")[0]
    .exports.default;

  return function Moonbase() {
    const { Text } = require("common_components");

    const { extensions } = Flux.useStateFromStoresObject(
      [MoonbaseSettingsStore],
      () => {
        return { extensions: MoonbaseSettingsStore.extensions };
      }
    );

    const [query, setQuery] = React.useState("");

    const sorted = Object.values(extensions).sort((a, b) => {
      const aName = a.manifest.meta?.name ?? a.id;
      const bName = b.manifest.meta?.name ?? b.id;
      return aName.localeCompare(bName);
    });

    const filtered = query.trim().length
      ? sorted.filter(
          (ext) =>
            ext.manifest.meta?.name?.toLowerCase().includes(query) ||
            ext.manifest.meta?.tagline?.toLowerCase().includes(query) ||
            ext.manifest.meta?.description?.toLowerCase().includes(query)
        )
      : sorted;

    return (
      <>
        <Text
          style={{
            "margin-bottom": "16px"
          }}
          variant="heading-lg/semibold"
          tag="h2"
        >
          Moonbase
        </Text>
        <SearchBar
          size={SearchBar.Sizes.MEDIUM}
          className={Margins.marginBottom20}
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
        {filtered.map((ext) => (
          <ExtensionCard id={ext.id} key={ext.id} />
        ))}
      </>
    );
  };
};
