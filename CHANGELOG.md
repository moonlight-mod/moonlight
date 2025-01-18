## Moonbase

- Added changelog for moonlight updates (but it won't show this one D:)
- Added a button to update all extensions
- Added an icon to distinguish the repository of an extension
- Extensions now stay at the top even after updating (thanks @maddymeows!)
- Moved some buttons to the extension tab bar
- Added missing row gap to extension info
- Improved update handling

## Core

- Updated mappings
  - For extension developers: there were a lot of type changes! Your extension should still run, but there may be issues with compilation. Please let us know if we got any types wrong.
- Added new `donate` key in manifest
  - For extension developers: Put your donate links here! Don't have/want donations? Put a charity you like!
- Added new patches to Quiet Loggers (thanks @gBasil!)
- Made `setConfigOption` actually async

## Misc

- Added packageManager to `package.json` for corepack (thanks @slonkazoid!)
- Began work on using the moonlight installer from a Flatpak
