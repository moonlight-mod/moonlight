import WebpackRequire from "@moonlight-mod/types/discord/require";
import card from "./card";
import { tagNames } from "./info";
import { ArrowsUpDownIconSVG, ChevronSmallDownIconSVG, ChevronSmallUpIconSVG } from "../types";
import { ExtensionTag } from "types/src";

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

  const channelModule =
    spacepack.modules[
      spacepack.findByCode(
        '"Missing channel in Channel.openChannelContextMenu"'
      )[0].id
    ].toString();
  const moduleId = channelModule.match(/webpackId:"(.+?)"/)?.[1];
  if (moduleId) {
    // @ts-expect-error
    require.el(moduleId).catch(() => {});
  }

  return function Moonbase() {
    const { Text, Button, Popout, Dialog, Heading } = require("common_components");

    const { extensions } = Flux.useStateFromStoresObject(
      [MoonbaseSettingsStore],
      () => {
        return { extensions: MoonbaseSettingsStore.extensions };
      }
    );

    const [query, setQuery] = React.useState("");

    const FilterBarClasses = spacepack.findByCode("tagsButtonWithCount:")[0]
      .exports;
    const FilterDialogClasses = spacepack.findByCode(
      "countContainer:",
      "tagContainer:"
    )[0].exports;
    const TagItem = spacepack.findByCode("IncreasedActivityForumTagPill:")[0]
      .exports.default;

    const ChevronSmallDownIcon = spacepack.findByCode(
      ChevronSmallDownIconSVG
    )[0].exports.default;
    const ChevronSmallUpIcon = spacepack.findByCode(ChevronSmallUpIconSVG)[0]
      .exports.default;
    const ArrowsUpDownIcon =
      spacepack.findByCode(ArrowsUpDownIconSVG)[0].exports.default;

    const { WindowStore } = require("common_stores");
    const windowSize = Flux.useStateFromStores([WindowStore], () => WindowStore.windowSize());

    const tagsContainer = React.useRef<HTMLDivElement>(null);
    const tagListInner = React.useRef<HTMLDivElement>(null);
    const [tagsButtonOffset, setTagsButtonOffset] = React.useState(0);
    // This calculates the position of the right-most pill in the first row
    React.useLayoutEffect(() => {
      if (tagsContainer.current === null || tagListInner.current === null)
        return;
      const { left: containerX, top: containerY } =
        tagsContainer.current.getBoundingClientRect();
      let offset = 0;
      for (const child of tagListInner.current.children) {
        const {
          right: childX,
          top: childY,
          height
        } = child.getBoundingClientRect();
        if (childY - containerY > height) break;
        const newOffset = childX - containerX;
        if (newOffset > offset) {
          offset = newOffset;
        }
      }
      setTagsButtonOffset(offset);
    }, [windowSize]);

    const [selectedTags, setSelectedTags] = React.useState(new Set<string>());
    const toggleTag = (tag: string) => {
      const newState = new Set(selectedTags);
      if (newState.has(tag)) newState.delete(tag);
      else newState.add(tag);
      setSelectedTags(newState);
    };

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
        )
    );

    return (
      <>
        <Text
          className={Margins.marginBottom20}
          variant="heading-lg/semibold"
          tag="h2"
        >
          Moonbase
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
        <div
          ref={tagsContainer}
          className={`${FilterBarClasses.tagsContainer} ${Margins.marginBottom8}`}
        >
          <Button
            size={Button.Sizes.MIN}
            color={Button.Colors.CUSTOM}
            className={FilterBarClasses.sortDropdown}
            innerClassName={FilterBarClasses.sortDropdownInner}
          >
            <ArrowsUpDownIcon />
            <Text
              className={FilterBarClasses.sortDropdownText}
              variant="text-sm/medium"
              color="interactive-normal"
            >
              Sort & filter
            </Text>
            <ChevronSmallDownIcon size={20} />
          </Button>
          <div className={FilterBarClasses.divider} />
          {/* TODO: make this scrollable with a ListNavigator */}
          <div className={FilterBarClasses.tagList}>
            <div ref={tagListInner} className={FilterBarClasses.tagListInner}>
              {Object.keys(tagNames).map((tag) => (
                <TagItem
                  key={tag}
                  className={FilterBarClasses.tag}
                  tag={{ name: tagNames[tag as keyof typeof tagNames] }}
                  onClick={() => toggleTag(tag)}
                  selected={selectedTags.has(tag)}
                />
              ))}
            </div>
          </div>
          <Popout
            renderPopout={({ setPopoutRef, closePopout }: any) => (
              <Dialog
                ref={setPopoutRef}
                className={FilterDialogClasses.container}
              >
                <div className={FilterDialogClasses.header}>
                  <div className={FilterDialogClasses.headerLeft}>
                    <Heading
                      color="interactive-normal"
                      variant="text-xs/bold"
                      className={FilterDialogClasses.headerText}
                    >
                      Select tags
                    </Heading>
                    <div className={FilterDialogClasses.countContainer}>
                      <Text
                        className={FilterDialogClasses.countText}
                        color="none"
                        variant="text-xs/medium"
                      >
                        {selectedTags.size}
                      </Text>
                    </div>
                  </div>
                </div>
                <div className={FilterDialogClasses.tagContainer}>
                  {Object.keys(tagNames).map((tag) => (
                    <TagItem
                      key={tag}
                      className={FilterDialogClasses.tag}
                      tag={{ name: tagNames[tag as keyof typeof tagNames] }}
                      onClick={() => toggleTag(tag)}
                      selected={selectedTags.has(tag)}
                    />
                  ))}
                </div>
                <div className={FilterDialogClasses.separator} />
                <Button
                  look={Button.Looks.LINK}
                  size={Button.Sizes.MIN}
                  color={Button.Colors.CUSTOM}
                  className={FilterDialogClasses.clear}
                  onClick={() => {
                    setSelectedTags(new Set());
                    closePopout();
                  }}
                >
                  <Text variant="text-sm/medium" color="text-link">
                    Clear all
                  </Text>
                </Button>
              </Dialog>
            )}
            position="bottom"
            align="right"
          >
            {(props: any, { isShown }: { isShown: boolean }) => (
              <Button
                {...props}
                size={Button.Sizes.MIN}
                color={Button.Colors.CUSTOM}
                style={{
                  left: tagsButtonOffset
                }}
                // TODO: Use Discord's class name utility
                className={`${FilterBarClasses.tagsButton} ${
                  selectedTags.size > 0
                    ? FilterBarClasses.tagsButtonWithCount
                    : ""
                }`}
                innerClassName={FilterBarClasses.tagsButtonInner}
              >
                {selectedTags.size > 0 ? (
                  <div
                    style={{ boxSizing: "content-box" }}
                    className={FilterBarClasses.countContainer}
                  >
                    <Text
                      className={FilterBarClasses.countText}
                      color="none"
                      variant="text-xs/medium"
                    >
                      {selectedTags.size}
                    </Text>
                  </div>
                ) : (
                  <>All</>
                )}
                {isShown ? (
                  <ChevronSmallUpIcon size={20} />
                ) : (
                  <ChevronSmallDownIcon size={20} />
                )}
              </Button>
            )}
          </Popout>
        </div>
        {filtered.map((ext) => (
          <ExtensionCard id={ext.id} key={ext.id} />
        ))}
      </>
    );
  };
};
