import type { ExtensionWebpackModule, Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  // chat buttons
  {
    find: '"gift")}),',
    replace: [
      {
        match: /(?<=className:\i\(\)\(\i\.\i,\{\[\i\.\i\]:\i\}\),children:)(\i)/,
        replacement: (_, original) => `require("componentEditor_chatButtonList").default._patchButtons(${original})`
      }
    ]
  },
  // dm list
  {
    find: ".ImpressionNames.DM_LIST_RIGHT_CLICK_MENU_SHOWN",
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
        match: /(?<=visibleElementRef:\i}\):null]}\))]/,
        replacement: "],arguments[0])"
      }
    ],
    hardFail: true
  },

  // member list
  {
    find: ",nudgeAlignIntoViewport:!1,useRawTargetDimensions:!0,animation:",
    replace: [
      {
        match:
          /(?<=\(0,\i\.jsxs\)\(\i\.Fragment,{)children:(\[\(0,\i\.jsx\)\(\i,{user:\i}\),.+?onClickPremiumGuildIcon:\i}\)])/,
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
        replacement: (_, _leading, badges, trailing) =>
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
      match: /(?<=className:\i\(\)\(\i,\i\.\i\),)children:(\[.+?this\.renderSuppressConfirmModal\(\),.+?\])}\)/,
      replacement: (_, elements) =>
        `children:require("componentEditor_messages").default._patchAccessories(${elements},this.props)})`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  chatButtonList: {
    dependencies: [{ id: "react" }]
  },
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
