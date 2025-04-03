/* eslint-disable ts/prefer-literal-enum-member -- binary */
import { WindowStore } from "@moonlight-mod/wp/common_stores";
import { MenuCheckboxItem, MenuGroup, MenuItem } from "@moonlight-mod/wp/contextMenu_contextMenu";
import {
  ArrowsUpDownIcon,
  Button,
  ChevronSmallDownIcon,
  ChevronSmallUpIcon,
  Dialog,
  Heading,
  Menu,
  Popout,
  RetryIcon,
  Text,
  Tooltip
} from "@moonlight-mod/wp/discord/components/common/index";
import TagItem from "@moonlight-mod/wp/discord/modules/forums/web/Tag";
import { useStateFromStores } from "@moonlight-mod/wp/discord/packages/flux";
import Margins from "@moonlight-mod/wp/discord/styles/shared/Margins.css";
import { MoonbaseSettingsStore } from "@moonlight-mod/wp/moonbase_stores";
import * as React from "@moonlight-mod/wp/react";
import spacepack from "@moonlight-mod/wp/spacepack_spacepack";
import { tagNames } from "./info";

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
  .lazyLoad("\"Missing channel in Channel.openChannelContextMenu\"", /e\("(\d+)"\)/g, /webpackId:(\d+?),/)
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
      <Menu hideScroller={true} navId="sort-filter" onClose={closePopout}>
        <MenuGroup label="Type">
          <MenuCheckboxItem
            action={() => toggleFilter(Filter.Core)}
            checked={(filter & Filter.Core) === Filter.Core}
            id="t-core"
            label="Core"
          />
          <MenuCheckboxItem
            action={() => toggleFilter(Filter.Normal)}
            checked={(filter & Filter.Normal) === Filter.Normal}
            id="t-normal"
            label="Normal"
          />
          <MenuCheckboxItem
            action={() => toggleFilter(Filter.Developer)}
            checked={(filter & Filter.Developer) === Filter.Developer}
            id="t-developer"
            label="Developer"
          />
        </MenuGroup>
        <MenuGroup label="State">
          <MenuCheckboxItem
            action={() => toggleFilter(Filter.Enabled)}
            checked={(filter & Filter.Enabled) === Filter.Enabled}
            id="s-enabled"
            label="Enabled"
          />
          <MenuCheckboxItem
            action={() => toggleFilter(Filter.Disabled)}
            checked={(filter & Filter.Disabled) === Filter.Disabled}
            id="s-disabled"
            label="Disabled"
          />
        </MenuGroup>
        <MenuGroup label="Location">
          <MenuCheckboxItem
            action={() => toggleFilter(Filter.Installed)}
            checked={(filter & Filter.Installed) === Filter.Installed}
            id="l-installed"
            label="Installed"
          />
          <MenuCheckboxItem
            action={() => toggleFilter(Filter.Repository)}
            checked={(filter & Filter.Repository) === Filter.Repository}
            id="l-repository"
            label="Repository"
          />
        </MenuGroup>
        <MenuGroup>
          <MenuCheckboxItem
            action={() => toggleFilter(Filter.Incompatible)}
            checked={(filter & Filter.Incompatible) === Filter.Incompatible}
            id="l-incompatible"
            label="Show incompatible"
          />
          <MenuCheckboxItem
            action={() => toggleFilter(Filter.Deprecated)}
            checked={(filter & Filter.Deprecated) === Filter.Deprecated}
            id="l-deprecated"
            label="Show deprecated"
          />
          <MenuItem
            action={() => {
              setFilter(defaultFilter);
              closePopout();
            }}
            className={SortMenuClasses.clearText}
            id="reset-all"
            label="Reset to default"
          />
        </MenuGroup>
      </Menu>
    </div>
  );
}

function TagButtonPopout({ selectedTags, setSelectedTags, setPopoutRef, closePopout }: any) {
  return (
    <Dialog className={HeaderClasses.container} ref={setPopoutRef}>
      <div className={HeaderClasses.header}>
        <div className={HeaderClasses.headerLeft}>
          <Heading className={HeaderClasses.headerText} color="interactive-normal" variant="text-xs/bold">
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
        {Object.keys(tagNames).map(tag => (
          <TagItem
            className={HeaderClasses.tag}
            key={tag}
            onClick={() => toggleTag(selectedTags, setSelectedTags, tag)}
            selected={selectedTags.has(tag)}
            tag={{ name: tagNames[tag as keyof typeof tagNames], id: tagNames[tag as keyof typeof tagNames] }}
          />
        ))}
      </div>
      <div className={HeaderClasses.separator} />
      <Button
        className={HeaderClasses.clear}
        color={Button.Colors.CUSTOM}
        look={Button.Looks.LINK}
        onClick={() => {
          setSelectedTags(new Set());
          closePopout();
        }}
        size={Button.Sizes.MIN}
      >
        <Text color="text-link" variant="text-sm/medium">
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
      className={`${ForumsClasses.tagsContainer} ${Margins.marginBottom8}`}
      ref={tagsContainer}
      style={{
        paddingTop: "12px"
      }}
    >
      <Tooltip position="top" text="Refresh updates">
        {(props: any) => (
          <Button
            {...props}
            className={`${ForumsClasses.sortDropdown} moonbase-retry-button ${checkingUpdates ? "moonbase-speen" : ""}`}
            color={Button.Colors.CUSTOM}
            innerClassName={ForumsClasses.sortDropdownInner}
            onClick={() => {
              (async () => {
                try {
                  setCheckingUpdates(true);
                  await MoonbaseSettingsStore.checkUpdates();
                }
                finally {
                  // artificial delay because the spin is fun
                  await new Promise(r => setTimeout(r, 500));
                  setCheckingUpdates(false);
                }
              })();
            }}
            size={Button.Sizes.MIN}
          >
            <RetryIcon size="custom" width={16} />
          </Button>
        )}
      </Tooltip>
      <Popout
        align="left"
        position="bottom"
        renderPopout={({ closePopout }: any) => (
          <FilterButtonPopout closePopout={closePopout} filter={filter} setFilter={setFilter} />
        )}
      >
        {(props: any, { isShown }: { isShown: boolean }) => (
          <Button
            {...props}
            className={ForumsClasses.sortDropdown}
            color={Button.Colors.CUSTOM}
            innerClassName={ForumsClasses.sortDropdownInner}
            size={Button.Sizes.MIN}
          >
            <ArrowsUpDownIcon size="xs" />
            <Text className={ForumsClasses.sortDropdownText} color="interactive-normal" variant="text-sm/medium">
              Sort & filter
            </Text>
            {isShown
              ? (
                  <ChevronSmallUpIcon size="custom" width={20} />
                )
              : (
                  <ChevronSmallDownIcon size="custom" width={20} />
                )}
          </Button>
        )}
      </Popout>
      <div className={ForumsClasses.divider} />
      <div className={ForumsClasses.tagList}>
        <div className={ForumsClasses.tagListInner} ref={tagListInner}>
          {Object.keys(tagNames).map(tag => (
            <TagItem
              className={ForumsClasses.tag}
              key={tag}
              onClick={() => toggleTag(selectedTags, setSelectedTags, tag)}
              selected={selectedTags.has(tag)}
              tag={{ name: tagNames[tag as keyof typeof tagNames], id: tag }}
            />
          ))}
        </div>
      </div>
      <Popout
        align="right"
        position="bottom"
        renderPopout={({ setPopoutRef, closePopout }: any) => (
          <TagButtonPopout
            closePopout={closePopout}
            selectedTags={selectedTags}
            setPopoutRef={setPopoutRef}
            setSelectedTags={setSelectedTags}
          />
        )}
      >
        {(props: any, { isShown }: { isShown: boolean }) => (
          <Button
            {...props}
            // TODO: Use Discord's class name utility
            className={`${ForumsClasses.tagsButton} ${selectedTags.size > 0 ? ForumsClasses.tagsButtonWithCount : ""}`}
            color={Button.Colors.CUSTOM}
            innerClassName={ForumsClasses.tagsButtonInner}
            size={Button.Sizes.MIN}
            style={{
              left: tagsButtonOffset
            }}
          >
            {selectedTags.size > 0
              ? (
                  <div className={ForumsClasses.countContainer} style={{ boxSizing: "content-box" }}>
                    <Text className={ForumsClasses.countText} color="none" variant="text-xs/medium">
                      {selectedTags.size}
                    </Text>
                  </div>
                )
              : (
                  <>All</>
                )}
            {isShown
              ? (
                  <ChevronSmallUpIcon size="custom" width={20} />
                )
              : (
                  <ChevronSmallDownIcon size="custom" width={20} />
                )}
          </Button>
        )}
      </Popout>
      <Button
        className={`${ForumsClasses.tagsButton} ${ForumsClasses.tagsButtonPlaceholder}`}
        color={Button.Colors.CUSTOM}
        innerClassName={ForumsClasses.tagsButtonInner}
        size={Button.Sizes.MIN}
      >
        {selectedTags.size > 0
          ? (
              <div className={ForumsClasses.countContainer} style={{ boxSizing: "content-box" }}>
                <Text className={ForumsClasses.countText} color="none" variant="text-xs/medium">
                  {selectedTags.size}
                </Text>
              </div>
            )
          : null}

        <ChevronSmallUpIcon size="custom" width={20} />
      </Button>
    </div>
  );
}
