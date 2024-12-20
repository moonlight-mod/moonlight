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
  MenuGroup,
  MenuCheckboxItem,
  MenuItem
} from "@moonlight-mod/wp/discord/components/common/index";
import * as Components from "@moonlight-mod/wp/discord/components/common/index";

export enum Filter {
  Core = 1 << 0,
  Normal = 1 << 1,
  Developer = 1 << 2,
  Enabled = 1 << 3,
  Disabled = 1 << 4,
  Installed = 1 << 5,
  Repository = 1 << 6,
  Incompatible = 1 << 7
}
export const defaultFilter = 127 as Filter;

const Margins = spacepack.findByCode("marginCenterHorz:")[0].exports;
const SortMenuClasses = spacepack.findByCode("container:", "clearText:")[0].exports;

let FilterDialogClasses: any;
let FilterBarClasses: any;
spacepack
  .lazyLoad('"Missing channel in Channel.openChannelContextMenu"', /e\("(\d+)"\)/g, /webpackId:(\d+?),/)
  .then(() => {
    FilterBarClasses = spacepack.findByCode("tagsButtonWithCount:")[0].exports;
    FilterDialogClasses = spacepack.findByCode("countContainer:", "tagContainer:")[0].exports;
  });

const TagItem = spacepack.findByCode('"forum-tag-"')[0].exports.Z;

// FIXME: type component keys
const { ChevronSmallDownIcon, ChevronSmallUpIcon, ArrowsUpDownIcon } = Components;

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
    <Dialog ref={setPopoutRef} className={FilterDialogClasses.container}>
      <div className={FilterDialogClasses.header}>
        <div className={FilterDialogClasses.headerLeft}>
          <Heading color="interactive-normal" variant="text-xs/bold" className={FilterDialogClasses.headerText}>
            Select tags
          </Heading>
          <div className={FilterDialogClasses.countContainer}>
            <Text className={FilterDialogClasses.countText} color="none" variant="text-xs/medium">
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
          <FilterButtonPopout filter={filter} setFilter={setFilter} closePopout={closePopout} />
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
            <ArrowsUpDownIcon size="xs" />
            <Text className={FilterBarClasses.sortDropdownText} variant="text-sm/medium" color="interactive-normal">
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
              selectedTags.size > 0 ? FilterBarClasses.tagsButtonWithCount : ""
            }`}
            innerClassName={FilterBarClasses.tagsButtonInner}
          >
            {selectedTags.size > 0 ? (
              <div style={{ boxSizing: "content-box" }} className={FilterBarClasses.countContainer}>
                <Text className={FilterBarClasses.countText} color="none" variant="text-xs/medium">
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
    </div>
  );
}
