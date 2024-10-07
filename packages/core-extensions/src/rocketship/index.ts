import { Patch } from "@moonlight-mod/types";

const logger = moonlight.getLogger("rocketship");
const getDisplayMediaOrig = navigator.mediaDevices.getDisplayMedia;

async function getVenmicStream() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    logger.debug("Devices:", devices);

    // This isn't vencord :(
    const id = devices.find((device) => device.label === "vencord-screen-share")
      ?.deviceId;
    if (!id) return null;
    logger.debug("Got venmic device ID:", id);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: {
          exact: id
        },
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false
      }
    });

    return stream.getAudioTracks();
  } catch (error) {
    logger.warn("Failed to get venmic stream:", error);
    return null;
  }
}

navigator.mediaDevices.getDisplayMedia = async function getDisplayMediaRedirect(
  options
) {
  const orig = await getDisplayMediaOrig.call(this, options);

  const venmic = await getVenmicStream();
  logger.debug("venmic", venmic);
  if (venmic != null) {
    // venmic will be proxying all audio, so we need to remove the original
    // tracks to not cause overlap
    for (const track of orig.getAudioTracks()) {
      orig.removeTrack(track);
    }

    for (const track of venmic) {
      orig.addTrack(track);
    }
  }

  return orig;
};

export const patches: Patch[] = [
  // "Ensure discord_voice is happy"
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
  // Remove Native media engine from list of choices
  {
    find: '.CAMERA_BACKGROUND_LIVE="cameraBackgroundLive"',
    replace: {
      match: /.\..{1,2}\.NATIVE,/,
      replacement: ""
    }
  },
  // Stub out browser checks to allow us to use WebRTC voice on Embedded
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
