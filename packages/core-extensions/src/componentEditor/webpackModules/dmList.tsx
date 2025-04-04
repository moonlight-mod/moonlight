import {
  DMList,
  DMListItem,
  DMListDecorator,
  DMListAnchorIndicies,
  DMListDecoratorAnchorIndicies
} from "@moonlight-mod/types/coreExtensions/componentEditor";
import React from "@moonlight-mod/wp/react";

const items: Record<string, DMListItem> = {};
const decorators: Record<string, DMListDecorator> = {};

function addEntries(
  elements: React.ReactNode[],
  entries: Record<string, DMListItem | DMListDecorator>,
  indicies: Partial<Record<keyof typeof DMListAnchorIndicies | keyof typeof DMListDecoratorAnchorIndicies, number>>,
  props: any
) {
  const originalElements = [...elements];
  for (const [id, entry] of Object.entries(entries)) {
    const component = <entry.component {...props} key={id} />;

    if (entry.anchor === undefined) {
      if (entry.before) {
        elements.splice(0, 0, component);
      } else {
        elements.push(component);
      }
    } else {
      const index = elements.indexOf(originalElements[indicies[entry.anchor]!]);
      elements.splice(index! + (entry.before ? 0 : 1), 0, component);
    }
  }
}

export const dmList: DMList = {
  addItem(id, component, anchor, before = false) {
    items[id] = {
      component,
      anchor,
      before
    };
  },
  addDecorator(id, component, anchor, before = false) {
    decorators[id] = {
      component,
      anchor,
      before
    };
  },
  _patchItems(elements, props) {
    addEntries(elements, items, DMListAnchorIndicies, props);
    return elements;
  },
  _patchDecorators(elements, props) {
    addEntries(elements, decorators, DMListDecoratorAnchorIndicies, props);
    return elements;
  }
};

export default dmList;
