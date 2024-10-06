import { Patch } from "@moonlight-mod/types";

export const patches: Patch[] = [
  {
    find: "RustAudioDeviceModule",
    replace: [
      {
        match: /static supported\(\)\{.+?\}/,
        replacement: "static supported(){return true}"
      },
      {
        match: "supported(){return!0}",
        replacement: "supported(){return true}"
      }
    ]
  },
  {
    find: '.CAMERA_BACKGROUND_LIVE="cameraBackgroundLive"',
    replace: {
      match: /.\..{1,2}\.NATIVE,/,
      replacement: ""
    }
  },
  {
    find: "Using Unified Plan (",
    replace: {
      match: /return .\..{1,2}\?\((.)\.info/,
      replacement: (_, logger) => `return true?(${logger}.info`
    }
  },
  {
    find: '"UnifiedConnection("',
    replace: {
      match: /this\.videoSupported=.\..{1,2};/,
      replacement: "this.videoSupported=true;"
    }
  },
  {
    find: "OculusBrowser",
    replace: [
      {
        match: /"Firefox"===(.)\(\)\.name/g,
        replacement: (orig, info) => `true||${orig}`
      }
    ]
  },
  {
    find: ".getMediaEngine().getDesktopSource",
    replace: {
      match: /.\.isPlatformEmbedded/,
      replacement: "false"
    }
  }
];
