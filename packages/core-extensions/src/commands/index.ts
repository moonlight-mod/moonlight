import { Patch, ExtensionWebpackModule } from "@moonlight-mod/types";
import { APPLICATION_ID } from "@moonlight-mod/types/coreExtensions/commands";

export const patches: Patch[] = [
  {
    find: '"shrug",',
    replace: [
      // inject commands
      {
        match: /return (\i)\.filter/,
        replacement: (orig, commands) =>
          `return [...${commands},...require("commands_commands").default._getCommands()].filter`
      },

      // section
      {
        match: /(?<=\i={)(?=\[\i\.\i\.BUILT_IN]:{id:\i\.\i\.BUILT_IN,type:(\i.\i\.BUILT_IN))/,
        replacement: (_, type) =>
          `"${APPLICATION_ID}":{id:"${APPLICATION_ID}",type:${type},get name(){return "moonlight"}},`
      }
    ]
  },

  // index our section
  {
    find: '"ApplicationCommandIndexStore"',
    replace: {
      match: /(?<=let \i=(\i)\((\i\.\i)\[\i\.\i\.BUILT_IN\],(\i),!0,!0,(\i)\);)null!=(\i)&&(\i)\.push\(\i\)/,
      replacement: (_, createSection, sections, deny, props, section, commands) =>
        `null!=${section}&&(${section}.data=${section}.data.filter(c=>c.applicationId=="-1"));
        null!=${section}&&${commands}.push(${section});
        const moonlightCommands=${createSection}(${sections}["${APPLICATION_ID}"],${deny},!0,!0,${props});
        null!=moonlightCommands&&(moonlightCommands.data=moonlightCommands.data.filter(c=>c.applicationId=="${APPLICATION_ID}"));
        null!=moonlightCommands&&${commands}.push(moonlightCommands)`
    }
  },

  // grab legacy commands (needed for adding actions that act like sed/plus reacting)
  {
    find: "={tts:{action:",
    replace: {
      match: /Object\.setPrototypeOf\((\i),null\)/,
      replacement: (_, legacyCommands) => `require("commands_commands")._getLegacyCommands(${legacyCommands})`
    }
  },

  // add icon
  {
    find: ",hasSpaceTerminator:",
    replace: {
      match: /(\i)\.type===/,
      replacement: (orig, section) => `${section}.id!=="${APPLICATION_ID}"&&${orig}`
    }
  },
  {
    find: ".icon,bot:null==",
    replace: {
      match: /(\.useMemo\(\(\)=>{(var \i;)?)((return |if\()(\i)\.type)/,
      replacement: (_, before, beforeVar, after, afterIf, section) => `${before}
      if (${section}.id==="${APPLICATION_ID}") return "https://moonlight-mod.github.io/favicon.png";
      ${after}`
    }
  },
  // fix icon sizing because they expect built in to be 24 and others to be 32
  {
    find: ".builtInSeparator}):null]",
    replace: {
      match: /(\i)\.type===\i\.\i\.BUILT_IN/,
      replacement: (orig, section) => `${section}.id!=="${APPLICATION_ID}"&&${orig}`
    }
  },

  // tell it this app id is authorized
  {
    find: /let{customInstallUrl:\i,installParams:\i,integrationTypesConfig:\i}/,
    replace: {
      match: /\|\|(\i)===\i\.\i\.BUILT_IN/,
      replacement: (orig, id) => `${orig}||${id}==="${APPLICATION_ID}"`
    }
  }
];

export const webpackModules: Record<string, ExtensionWebpackModule> = {
  commands: {}
};
