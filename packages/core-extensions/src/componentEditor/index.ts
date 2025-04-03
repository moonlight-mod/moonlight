import { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // dm list
  {
    find: ".interactiveSystemDM]:",
    replace: [
      {
        match: /decorators:(\i\.isSystemDM\(\)\?\(0,\i\.jsx\)\(.+?verified:!0}\):null)/,
        replacement: (_, decorators) =>
          `decorators:require("componentEditor_dmList").default._patchDecorators([${decorators}],arguments[0])`
      },
      {
        match: /(?<=selected:\i,)children:\[/,
        replacement: 'children:require("componentEditor_dmList").default._patchItems(['
      },
      {
        match: /(?<=(onMouseDown|nameplate):\i}\))]/,
        replacement: "],arguments[0])"
      }
    ],
    hardFail: true
  },

  // member list
  {
    find: ".lostPermission",
    replace: [
      {
        match: /(?<=\(0,\i\.jsxs\)\(\i\.Fragment,{)children:(\[\i\(\),.+?\i\(\)])/,
        replacement: (_, decorators) =>
          `children:require("componentEditor_memberList").default._patchDecorators(${decorators},arguments[0])`
      },
      {
        match: /name:null==\i\?\(0,\i\.jsx\)\("span"/,
        replacement: (orig: string) =>
          `children:require("componentEditor_memberList").default._patchItems([],arguments[0]),${orig}`
      }
    ]
  },

  // messages
  {
    find: '},"new-member")),',
    replace: [
      {
        match: /(?<=\.BADGES](=|:))(\i)(;|})/,
        replacement: (_, leading, badges, trailing) =>
          `require("componentEditor_messages").default._patchUsernameBadges(${badges},arguments[0])${trailing}`
      },
      {
        match: /(?<=className:\i,)badges:(\i)/,
        replacement: (_, badges) =>
          `badges:require("componentEditor_messages").default._patchBadges(${badges},arguments[0])`
      },
      {
        match: /(?<=username:\(0,\i\.jsxs\)\(\i\.Fragment,{)children:(\[.+?])}\),usernameSpanId:/,
        replacement: (_, elements) =>
          `children:require("componentEditor_messages").default._patchUsername(${elements},arguments[0])}),usernameSpanId:`
      }
    ]
  },
  {
    find: '.provider&&"Discord"===',
    replace: {
      match: /(?<=\.container\),)children:(\[.+?this\.renderSuppressConfirmModal\(\),.+?\])}\)/,
      replacement: (_, elements) =>
        `children:require("componentEditor_messages").default._patchAccessories(${elements},this.props)})`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  dmList: {
    dependencies: [{ id: "react" }]
  },
  memberList: {
    dependencies: [{ id: "react" }]
  },
  messages: {
    dependencies: [{ id: "react" }]
  }
};
