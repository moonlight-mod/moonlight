import {
  ChatButtonList,
  ChatButtonListAnchors,
  ChatButtonListItem
} from "@moonlight-mod/types/coreExtensions/componentEditor";
import React from "@moonlight-mod/wp/react";

const items: Record<string, ChatButtonListItem> = {};
const itemsToRemove: Set<ChatButtonListAnchors> = new Set();

function addEntries(
  elements: React.ReactNode[],
  entries: Record<string, ChatButtonListItem>,
  removedEntries: Iterable<ChatButtonListAnchors>
) {
  for (const [id, entry] of Object.entries(entries)) {
    const component = <entry.component key={id} />;

    if (entry.anchor === undefined) {
      if (entry.before) {
        elements.splice(0, 0, component);
      } else {
        elements.push(component);
      }
    } else {
      const index = elements.findIndex((elem) => (elem as React.ReactElement).key === entry.anchor);
      elements.splice(index! + (entry.before ? 0 : 1), 0, component);
    }
  }

  for (const id of removedEntries) {
    if (id === undefined) {
      continue;
    }

    const index = elements.findIndex((elem) => (elem as React.ReactElement).key === id);
    elements.splice(index, 1);
  }
}

export const chatButtonList: ChatButtonList = {
  addButton(id, component, anchor, before = false) {
    items[id] = {
      component,
      anchor,
      before
    };
  },
  removeButton(id) {
    itemsToRemove.add(id);
  },
  _patchButtons(elements) {
    addEntries(elements, items, itemsToRemove);

    return elements;
  }
};

export default chatButtonList;
