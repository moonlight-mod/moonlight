import type {
  MessageBadge,
  Messages,
  MessageUsername,
  MessageUsernameBadge
} from "@moonlight-mod/types/coreExtensions/componentEditor";
import {
  MessageBadgeIndicies,
  MessageUsernameBadgeIndicies,
  MessageUsernameIndicies
} from "@moonlight-mod/types/coreExtensions/componentEditor";
import React from "@moonlight-mod/wp/react";

const username: Record<string, MessageUsername> = {};
const usernameBadges: Record<string, MessageUsernameBadge> = {};
const badges: Record<string, MessageBadge> = {};
const accessories: Record<string, React.FC<any>> = {};

function addEntries(
  elements: React.ReactNode[],
  entries: Record<string, MessageUsername | MessageUsernameBadge | MessageBadge>,
  indicies: Partial<
    Record<
      | keyof typeof MessageUsernameIndicies
      | keyof typeof MessageUsernameBadgeIndicies
      | keyof typeof MessageBadgeIndicies,
      number
    >
  >,
  props: any
) {
  const originalElements = [...elements];
  for (const [id, entry] of Object.entries(entries)) {
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
      const index = elements.indexOf(originalElements[indicies[entry.anchor]!]);
      elements.splice(index! + (entry.before ? 0 : 1), 0, component);
    }
  }
}

function addComponents(elements: React.ReactNode[], components: Record<string, React.FC<any>>, props: any) {
  for (const [id, Component] of Object.entries(components)) {
    const component = <Component {...props} key={id} />;
    elements.push(component);
  }
}

export const messages: Messages = {
  addToUsername(id, component, anchor, before = false) {
    username[id] = {
      component,
      anchor,
      before
    };
  },
  addUsernameBadge(id, component, anchor, before = false) {
    usernameBadges[id] = {
      component,
      anchor,
      before
    };
  },
  addBadge(id, component, anchor, before = false) {
    badges[id] = {
      component,
      anchor,
      before
    };
  },
  addAccessory(id, component) {
    accessories[id] = component;
  },
  _patchUsername(elements, props) {
    addEntries(elements, username, MessageUsernameIndicies, props);
    return elements;
  },
  _patchUsernameBadges(elements, props) {
    addEntries(elements, usernameBadges, MessageUsernameBadgeIndicies, props);
    return elements;
  },
  _patchBadges(elements, props) {
    addEntries(elements, badges, MessageBadgeIndicies, props);
    return elements;
  },
  _patchAccessories(elements, props) {
    addComponents(elements, accessories, props);
    return elements;
  }
};

export default messages;
