import type {
  MemberList,
  MemberListDecorator
} from "@moonlight-mod/types/coreExtensions/componentEditor";
import {
  MemberListDecoratorAnchorIndicies
} from "@moonlight-mod/types/coreExtensions/componentEditor";
import React from "@moonlight-mod/wp/react";

const items: Record<string, React.FC<any>> = {};
const decorators: Record<string, MemberListDecorator> = {};

export const memberList: MemberList = {
  addItem(id, component) {
    items[id] = component;
  },
  addDecorator(id, component, anchor, before = false) {
    decorators[id] = {
      component,
      anchor,
      before
    };
  },
  _patchItems(elements, props) {
    for (const [id, Component] of Object.entries(items)) {
      elements.push(<Component {...props} key={id} />);
    }

    return elements;
  },
  _patchDecorators(elements, props) {
    const originalElements = [...elements];
    for (const [id, entry] of Object.entries(decorators)) {
      const component = <entry.component {...props} key={id} />;

      if (entry.anchor === undefined) {
        if (entry.before) {
          elements.splice(0, 0, component);
        }
        else {
          elements.push(component);
        }
      }
      else {
        const index = elements.indexOf(originalElements[MemberListDecoratorAnchorIndicies[entry.anchor]!]);
        elements.splice(index! + (entry.before ? 0 : 1), 0, component);
      }
    }

    return elements;
  }
};

export default memberList;
