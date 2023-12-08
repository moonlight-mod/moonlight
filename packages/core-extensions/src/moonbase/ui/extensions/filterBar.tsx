import { WebpackRequireType } from "@moonlight-mod/types";
import { tagNames } from "../extensions/info";
import {
  ArrowsUpDownIconSVG,
  ChevronSmallDownIconSVG,
  ChevronSmallUpIconSVG
} from "../../types";

export const defaultFilter = {
  core: true,
  normal: true,
  developer: true,
  enabled: true,
  disabled: true,
  installed: true,
  repository: true
};
export type Filter = typeof defaultFilter;

export default async (require: WebpackRequireType) => {
  const spacepack = require("spacepack_spacepack").spacepack;
  const React = require("common_react");
  const Flux = require("common_flux");
  const { WindowStore } = require("common_stores");

  const {
    Button,
    Text,
    Heading,
    Popout,
    Dialog
  } = require("common_components");

  const channelModule =
    require.m[
      spacepack.findByCode(
        '"Missing channel in Channel.openChannelContextMenu"'
      )[0].id
    ].toString();
  const moduleId = channelModule.match(/webpackId:"(.+?)"/)![1];
  await require.el(moduleId);

  const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;
  const SortMenuClasses = spacepack.findByCode("container:", "clearText:")[0]
    .exports;
  const FilterDialogClasses = spacepack.findByCode(
    "countContainer:",
    "tagContainer:"
  )[0].exports;
  const FilterBarClasses = spacepack.findByCode("tagsButtonWithCount:")[0]
    .exports;

  const TagItem = spacepack.findByCode("IncreasedActivityForumTagPill:")[0]
    .exports.default;

  const ChevronSmallDownIcon = spacepack.findByCode(ChevronSmallDownIconSVG)[0]
    .exports.default;
  const ChevronSmallUpIcon = spacepack.findByCode(ChevronSmallUpIconSVG)[0]
    .exports.default;
  const ArrowsUpDownIcon =
    spacepack.findByCode(ArrowsUpDownIconSVG)[0].exports.default;

  function toggleTag(
    selectedTags: Set<string>,
    setSelectedTags: (tags: Set<string>) => void,
    tag: string
  ) {
    const newState = new Set(selectedTags);
    if (newState.has(tag)) newState.delete(tag);
    else newState.add(tag);
    setSelectedTags(newState);
  }

  function FilterButtonPopout({
    filter,
    setFilter,
    closePopout
  }: {
    filter: Filter;
    setFilter: (filter: Filter) => void;
    closePopout: () => void;
  }) {
    const {
      Menu,
      MenuItem,
      MenuGroup,
      MenuCheckboxItem
    } = require("common_components");

    return (
      <div className={SortMenuClasses.container}>
        <Menu navId="sort-filter" hideScrollbar={true} onClose={closePopout}>
          <MenuGroup label="Type">
            <MenuCheckboxItem
              id="t-core"
              label="Core"
              checked={filter.core}
              action={() => setFilter({ ...filter, core: !filter.core })}
            />
            <MenuCheckboxItem
              id="t-normal"
              label="Normal"
              checked={filter.normal}
              action={() => setFilter({ ...filter, normal: !filter.normal })}
            />
            <MenuCheckboxItem
              id="t-developer"
              label="Developer"
              checked={filter.developer}
              action={() =>
                setFilter({ ...filter, developer: !filter.developer })
              }
            />
          </MenuGroup>
          <MenuGroup label="State">
            <MenuCheckboxItem
              id="s-enabled"
              label="Enabled"
              checked={filter.enabled}
              action={() => setFilter({ ...filter, enabled: !filter.enabled })}
            />
            <MenuCheckboxItem
              id="s-disabled"
              label="Disabled"
              checked={filter.disabled}
              action={() =>
                setFilter({ ...filter, disabled: !filter.disabled })
              }
            />
          </MenuGroup>
          <MenuGroup label="Location">
            <MenuCheckboxItem
              id="l-installed"
              label="Installed"
              checked={filter.installed}
              action={() =>
                setFilter({ ...filter, installed: !filter.installed })
              }
            />
            <MenuCheckboxItem
              id="l-repository"
              label="Repository"
              checked={filter.repository}
              action={() =>
                setFilter({ ...filter, repository: !filter.repository })
              }
            />
          </MenuGroup>
          <MenuGroup>
            <MenuItem
              id="reset-all"
              className={SortMenuClasses.clearText}
              label={
                <Text variant="text-sm/medium" color="none">
                  Reset to default
                </Text>
              }
              action={() => {
                setFilter({ ...defaultFilter });
                closePopout();
              }}
            />
          </MenuGroup>
        </Menu>
      </div>
    );
  }

  function TagButtonPopout({
    selectedTags,
    setSelectedTags,
    setPopoutRef,
    closePopout
  }: any) {
    return (
      <Dialog ref={setPopoutRef} className={FilterDialogClasses.container}>
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
              onClick={() => toggleTag(selectedTags, setSelectedTags, tag)}
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
    );
  }

  return function FilterBar({
    filter,
    setFilter,
    selectedTags,
    setSelectedTags
  }: {
    filter: Filter;
    setFilter: (filter: Filter) => void;
    selectedTags: Set<string>;
    setSelectedTags: (tags: Set<string>) => void;
  }) {
    const windowSize = Flux.useStateFromStores([WindowStore], () =>
      WindowStore.windowSize()
    );

    const tagsContainer = React.useRef<HTMLDivElement>(null);
    const tagListInner = React.useRef<HTMLDivElement>(null);
    const [tagsButtonOffset, setTagsButtonOffset] = React.useState(0);
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

    return (
      <div
        ref={tagsContainer}
        style={{
          paddingTop: "12px"
        }}
        className={`${FilterBarClasses.tagsContainer} ${Margins.marginBottom8}`}
      >
        <Popout
          renderPopout={({ closePopout }: any) => (
            <FilterButtonPopout
              filter={filter}
              setFilter={setFilter}
              closePopout={closePopout}
            />
          )}
          position="bottom"
          align="left"
        >
          {(props: any, { isShown }: { isShown: boolean }) => (
            <Button
              {...props}
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
              {isShown ? (
                <ChevronSmallUpIcon size={20} />
              ) : (
                <ChevronSmallDownIcon size={20} />
              )}
            </Button>
          )}
        </Popout>
        <div className={FilterBarClasses.divider} />
        <div className={FilterBarClasses.tagList}>
          <div ref={tagListInner} className={FilterBarClasses.tagListInner}>
            {Object.keys(tagNames).map((tag) => (
              <TagItem
                key={tag}
                className={FilterBarClasses.tag}
                tag={{ name: tagNames[tag as keyof typeof tagNames] }}
                onClick={() => toggleTag(selectedTags, setSelectedTags, tag)}
                selected={selectedTags.has(tag)}
              />
            ))}
          </div>
        </div>
        <Popout
          renderPopout={({ setPopoutRef, closePopout }: any) => (
            <TagButtonPopout
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              setPopoutRef={setPopoutRef}
              closePopout={closePopout}
            />
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
    );
  };
};
