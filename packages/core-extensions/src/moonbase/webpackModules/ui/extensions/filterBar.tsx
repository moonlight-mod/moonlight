import { tagNames } from "./info";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import * as React from "@moonlight-mod/wp/react";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import { WindowStore } from "@moonlight-mod/wp/common_stores";
import {
  Button,
  Text,
  Heading,
  Popout,
  Dialog,
  Menu,
  ChevronSmallDownIcon,
  ChevronSmallUpIcon,
  ArrowsUpDownIcon,
  RetryIcon,
  Tooltip
} from "@moonlight-mod/wp/discord/components/common/index";
import { MenuGroup, MenuCheckboxItem, MenuItem } from "@moonlight-mod/wp/contextMenu_contextMenu";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";
import TagItem from "@moonlight-mod/wp/discord/modules/forums/web/Tag";

export enum Filter {
  Core = 1 << 0,
  Normal = 1 << 1,
  Developer = 1 << 2,
  Enabled = 1 << 3,
  Disabled = 1 << 4,
  Installed = 1 << 5,
  Repository = 1 << 6,
  Incompatible = 1 << 7,
  Deprecated = 1 << 8
}
export const defaultFilter = 127 as Filter;

let HeaderClasses: any;
let ForumsClasses: any;
let SortMenuClasses: any;
spacepack
  .lazyLoad('"Missing channel in Channel.openChannelContextMenu"', /e\("(\d+)"\)/g, /webpackId:(\d+?),/)
  .then(() => {
    ForumsClasses = spacepack.require("discord/modules/forums/web/Forums.css");
    HeaderClasses = spacepack.require("discord/modules/forums/web/Header.css");
    SortMenuClasses = spacepack.require("discord/modules/forums/web/SortMenu.css");
  });

function toggleTag(selectedTags: Set<string>, setSelectedTags: (tags: Set<string>) => void, tag: string) {
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
  const toggleFilter = (set: Filter) => setFilter(filter & set ? filter & ~set : filter | set);

  return (
    <div className={SortMenuClasses.container}>
      <Menu navId="sort-filter" hideScroller={true} onClose={closePopout}>
        <MenuGroup label="Type">
          <MenuCheckboxItem
            id="t-core"
            label="Core"
            checked={(filter & Filter.Core) === Filter.Core}
            action={() => toggleFilter(Filter.Core)}
          />
          <MenuCheckboxItem
            id="t-normal"
            label="Normal"
            checked={(filter & Filter.Normal) === Filter.Normal}
            action={() => toggleFilter(Filter.Normal)}
          />
          <MenuCheckboxItem
            id="t-developer"
            label="Developer"
            checked={(filter & Filter.Developer) === Filter.Developer}
            action={() => toggleFilter(Filter.Developer)}
          />
        </MenuGroup>
        <MenuGroup label="State">
          <MenuCheckboxItem
            id="s-enabled"
            label="Enabled"
            checked={(filter & Filter.Enabled) === Filter.Enabled}
            action={() => toggleFilter(Filter.Enabled)}
          />
          <MenuCheckboxItem
            id="s-disabled"
            label="Disabled"
            checked={(filter & Filter.Disabled) === Filter.Disabled}
            action={() => toggleFilter(Filter.Disabled)}
          />
        </MenuGroup>
        <MenuGroup label="Location">
          <MenuCheckboxItem
            id="l-installed"
            label="Installed"
            checked={(filter & Filter.Installed) === Filter.Installed}
            action={() => toggleFilter(Filter.Installed)}
          />
          <MenuCheckboxItem
            id="l-repository"
            label="Repository"
            checked={(filter & Filter.Repository) === Filter.Repository}
            action={() => toggleFilter(Filter.Repository)}
          />
        </MenuGroup>
        <MenuGroup>
          <MenuCheckboxItem
            id="l-incompatible"
            label="Show incompatible"
            checked={(filter & Filter.Incompatible) === Filter.Incompatible}
            action={() => toggleFilter(Filter.Incompatible)}
          />
          <MenuCheckboxItem
            id="l-deprecated"
            label="Show deprecated"
            checked={(filter & Filter.Deprecated) === Filter.Deprecated}
            action={() => toggleFilter(Filter.Deprecated)}
          />
          <MenuItem
            id="reset-all"
            className={SortMenuClasses.clearText}
            label="Reset to default"
            action={() => {
              setFilter(defaultFilter);
              closePopout();
            }}
          />
        </MenuGroup>
      </Menu>
    </div>
  );
}

function TagButtonPopout({ selectedTags, setSelectedTags, setPopoutRef, closePopout }: any) {
  return (
    <Dialog ref={setPopoutRef} className={HeaderClasses.container}>
      <div className={HeaderClasses.header}>
        <div className={HeaderClasses.headerLeft}>
          <Heading color="interactive-normal" variant="text-xs/bold" className={HeaderClasses.headerText}>
            Select tags
          </Heading>
          <div className={HeaderClasses.countContainer}>
            <Text className={HeaderClasses.countText} color="none" variant="text-xs/medium">
              {selectedTags.size}
            </Text>
          </div>
        </div>
      </div>
      <div className={HeaderClasses.tagContainer}>
        {Object.keys(tagNames).map((tag) => (
          <TagItem
            key={tag}
            className={HeaderClasses.tag}
            tag={{ name: tagNames[tag as keyof typeof tagNames], id: tagNames[tag as keyof typeof tagNames] }}
            onClick={() => toggleTag(selectedTags, setSelectedTags, tag)}
            selected={selectedTags.has(tag)}
          />
        ))}
      </div>
      <div className={HeaderClasses.separator} />
      <Button
        look={Button.Looks.LINK}
        size={Button.Sizes.MIN}
        color={Button.Colors.CUSTOM}
        className={HeaderClasses.clear}
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

export default function FilterBar({
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
  const windowSize = useStateFromStores([WindowStore], () => WindowStore.windowSize());

  const tagsContainer = React.useRef<HTMLDivElement>(null);
  const tagListInner = React.useRef<HTMLDivElement>(null);
  const filterPopout = React.useRef<HTMLDivElement>(null);
  const tagPopout = React.useRef<HTMLDivElement>(null);
  const [tagsButtonOffset, setTagsButtonOffset] = React.useState(0);
  const [checkingUpdates, setCheckingUpdates] = React.useState(false);

  React.useLayoutEffect(() => {
    if (tagsContainer.current === null || tagListInner.current === null) return;
    const { left: containerX, top: containerY } = tagsContainer.current.getBoundingClientRect();
    let offset = 0;
    for (const child of tagListInner.current.children) {
      const { right: childX, top: childY, height } = child.getBoundingClientRect();
      if (childY - containerY > height) break;
      const newOffset = childX - containerX;
      if (newOffset > offset) {
        offset = newOffset;
      }
    }
    setTagsButtonOffset(offset);
  }, [windowSize, tagsContainer.current, tagListInner.current, tagListInner.current?.getBoundingClientRect()?.width]);

  return (
    <div
      ref={tagsContainer}
      style={{
        paddingTop: "12px"
      }}
      className={`${ForumsClasses.tagsContainer} ${Margins.marginBottom8}`}
    >
      <Tooltip text="Refresh updates" position="top">
        {(props: any) => (
          <Button
            {...props}
            size={Button.Sizes.MIN}
            color={Button.Colors.CUSTOM}
            className={`${ForumsClasses.sortDropdown} moonbase-retry-button`}
            innerClassName={ForumsClasses.sortDropdownInner}
            onClick={() => {
              (async () => {
                try {
                  setCheckingUpdates(true);
                  await MoonbaseSettingsStore.checkUpdates();
                } finally {
                  // artificial delay because the spin is fun
                  await new Promise((r) => setTimeout(r, 500));
                  setCheckingUpdates(false);
                }
              })();
            }}
          >
            <RetryIcon size={"custom"} width={16} className={checkingUpdates ? "moonbase-speen" : ""} />
          </Button>
        )}
      </Tooltip>
      <Popout
        // @ts-expect-error need to update type
        targetElementRef={filterPopout}
        renderPopout={({ closePopout }: any) => (
          <FilterButtonPopout filter={filter} setFilter={setFilter} closePopout={closePopout} />
        )}
        position="bottom"
        align="left"
      >
        {(props: any, { isShown }: { isShown: boolean }) => (
          <Button
            {...props}
            buttonRef={filterPopout}
            size={Button.Sizes.MIN}
            color={Button.Colors.CUSTOM}
            className={ForumsClasses.sortDropdown}
            innerClassName={ForumsClasses.sortDropdownInner}
          >
            <ArrowsUpDownIcon size="xs" />
            <Text className={ForumsClasses.sortDropdownText} variant="text-sm/medium" color="interactive-normal">
              Sort & filter
            </Text>
            {isShown ? (
              <ChevronSmallUpIcon size={"custom"} width={20} />
            ) : (
              <ChevronSmallDownIcon size={"custom"} width={20} />
            )}
          </Button>
        )}
      </Popout>
      <div className={ForumsClasses.divider} />
      <div className={ForumsClasses.tagList}>
        <div ref={tagListInner} className={ForumsClasses.tagListInner}>
          {Object.keys(tagNames).map((tag) => (
            <TagItem
              key={tag}
              className={ForumsClasses.tag}
              tag={{ name: tagNames[tag as keyof typeof tagNames], id: tag }}
              onClick={() => toggleTag(selectedTags, setSelectedTags, tag)}
              selected={selectedTags.has(tag)}
            />
          ))}
        </div>
      </div>
      <Popout
        // @ts-expect-error need to update type
        targetElementRef={tagPopout}
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
            buttonRef={tagPopout}
            size={Button.Sizes.MIN}
            color={Button.Colors.CUSTOM}
            style={{
              left: tagsButtonOffset
            }}
            // TODO: Use Discord's class name utility
            className={`${ForumsClasses.tagsButton} ${selectedTags.size > 0 ? ForumsClasses.tagsButtonWithCount : ""}`}
            innerClassName={ForumsClasses.tagsButtonInner}
          >
            {selectedTags.size > 0 ? (
              <div style={{ boxSizing: "content-box" }} className={ForumsClasses.countContainer}>
                <Text className={ForumsClasses.countText} color="none" variant="text-xs/medium">
                  {selectedTags.size}
                </Text>
              </div>
            ) : (
              <>All</>
            )}
            {isShown ? (
              <ChevronSmallUpIcon size={"custom"} width={20} />
            ) : (
              <ChevronSmallDownIcon size={"custom"} width={20} />
            )}
          </Button>
        )}
      </Popout>
      <Button
        size={Button.Sizes.MIN}
        color={Button.Colors.CUSTOM}
        className={`${ForumsClasses.tagsButton} ${ForumsClasses.tagsButtonPlaceholder}`}
        innerClassName={ForumsClasses.tagsButtonInner}
      >
        {selectedTags.size > 0 ? (
          <div style={{ boxSizing: "content-box" }} className={ForumsClasses.countContainer}>
            <Text className={ForumsClasses.countText} color="none" variant="text-xs/medium">
              {selectedTags.size}
            </Text>
          </div>
        ) : null}

        <ChevronSmallUpIcon size={"custom"} width={20} />
      </Button>
    </div>
  );
}
