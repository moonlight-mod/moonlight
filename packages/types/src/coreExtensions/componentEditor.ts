type Patcher<T> = (elements: React.ReactNode[], props: T) => React.ReactNode[];

//#region Chat Buttons
export type ChatButtonListAnchors = "gift" | "gif" | "sticker" | "emoji" | "activity" | undefined;

export enum ChatButtonListAnchorIndicies {
  gift = 0,
  "gif",
  "sticker",
  "emoji",
  "activity"
}

export type ChatButtonListItem = {
  component: React.FC<any>;
  anchor: ChatButtonListAnchors;
  before: boolean;
};

export type ChatButtonList = {
  addButton: (id: string, component: React.FC<any>, anchor?: ChatButtonListAnchors, before?: boolean) => void;
  removeButton: (id: ChatButtonListAnchors) => void;
  //TODO: fix props type
  /**
   * @private
   */
  _patchButtons: Patcher<any>;
};
//#endregion

//#region DM List
export type DMListAnchors =
  | "content"
  | "favorite-server-indicator"
  | "ignored-indicator"
  | "blocked-indicator"
  | "close-button"
  | undefined;
export type DMListDecoratorAnchors = "system-tag" | undefined;

export enum DMListAnchorIndicies {
  content = 0,
  "favorite-server-indicator",
  "ignored-indicator",
  "blocked-indicator",
  "close-button"
}
export enum DMListDecoratorAnchorIndicies {
  "system-tag" = 0
}

export type DMListItem = {
  component: React.FC<any>;
  anchor: DMListAnchors;
  before: boolean;
};
export type DMListDecorator = {
  component: React.FC<any>;
  anchor: DMListDecoratorAnchors;
  before: boolean;
};

export type DMList = {
  addItem: (id: string, component: React.FC<any>, anchor?: DMListAnchors, before?: boolean) => void;
  addDecorator: (id: string, component: React.FC<any>, anchor?: DMListDecoratorAnchors, before?: boolean) => void;
  //TODO: fix props type
  /**
   * @private
   */
  _patchItems: Patcher<any>;
  /**
   * @private
   */
  _patchDecorators: Patcher<any>;
};
//#endregion

//#region Member List
export type MemberListDecoratorAnchors = "bot-tag" | "owner-crown" | "boost-icon" | undefined;

export enum MemberListDecoratorAnchorIndicies {
  "bot-tag" = 0,
  "owner-crown",
  "boost-icon"
}

export type MemberListDecorator = {
  component: React.FC<any>;
  anchor: MemberListDecoratorAnchors;
  before: boolean;
};

export type MemberList = {
  addItem: (id: string, component: React.FC<any>) => void;
  addDecorator: (id: string, component: React.FC<any>, anchor?: MemberListDecoratorAnchors, before?: boolean) => void;
  //TODO: fix props type
  /**
   * @private
   */
  _patchItems: Patcher<any>;
  /**
   * @private
   */
  _patchDecorators: Patcher<any>;
};
//#endregion

//#region Messages
export type MessageUsernameAnchors = "communication-disabled" | "username" | undefined;
export type MessageUsernameBadgeAnchors =
  | "nitro-author"
  | "role-icon"
  | "new-member"
  | "leaderboard-champion"
  | "connections"
  | undefined;
export type MessageBadgeAnchors = "silent" | "potion" | undefined;

export type MessageUsername = {
  component: React.FC<any>;
  anchor: MessageUsernameAnchors;
  before: boolean;
};
export type MessageUsernameBadge = {
  component: React.FC<any>;
  anchor: MessageUsernameBadgeAnchors;
  before: boolean;
};
export type MessageBadge = {
  component: React.FC<any>;
  anchor: MessageBadgeAnchors;
  before: boolean;
};

export enum MessageUsernameIndicies {
  "communication-disabled" = 0,
  username
}
export enum MessageUsernameBadgeIndicies {
  "nitro-author" = 0,
  "role-icon",
  "new-member",
  "leaderboard-champion",
  connections
}
export enum MessageBadgeIndicies {
  silent = 0,
  potion
}

export type Messages = {
  /**
   * Adds a component to the username of a message
   */
  addToUsername: (id: string, component: React.FC<any>, anchor?: MessageUsernameAnchors, before?: boolean) => void;
  /**
   * Adds a component to the username badge area of a message (e.g. where role icons/new member badge is)
   */
  addUsernameBadge: (
    id: string,
    component: React.FC<any>,
    anchor?: MessageUsernameBadgeAnchors,
    before?: boolean
  ) => void;
  /**
   * Adds a component to the end of a message header (e.g. silent indicator)
   */
  addBadge: (id: string, component: React.FC<any>, anchor?: MessageBadgeAnchors, before?: boolean) => void;
  /**
   * Adds a component to message accessories (e.g. embeds)
   */
  addAccessory: (id: string, component: React.FC<any>) => void;
  /**
   * @private
   */
  _patchUsername: Patcher<any>;
  /**
   * @private
   */
  _patchUsernameBadges: Patcher<any>;
  /**
   * @private
   */
  _patchBadges: Patcher<any>;
  /**
   * @private
   */
  _patchAccessories: Patcher<any>;
};
//#endregion

export type ChatButtonListExports = {
  default: ChatButtonList;
};

export type DMListExports = {
  default: DMList;

  /**
   * @deprecated Use the default export
   */
  dmList: DMList;
};

export type MemberListExports = {
  default: MemberList;

  /**
   * @deprecated Use the default export
   */
  memberList: MemberList;
};

export type MessagesExports = {
  default: Messages;

  /**
   * @deprecated Use the default export
   */
  messages: Messages;
};
