## Moonbase

- Overhauled restart notifications
  - Moonbase now waits for the user to save their changes before prompting to restart the client
  - Restarting the client in Moonbase now *fully* restarts the client when needed
  - Allowed extensions to specify "restart advice" for settings
- Improved update systems
  - Fixed the update banner having an invisible close button
  - Made updates clearer in Moonbase by adding a divider + filter
  - Extension settings now update immediately after updating, without having to restart
  - Added extension changelogs (`meta.changelog` in the manifest)
  - Added a refresh button to Moonbase
  - Added the ability to update moonlight from the system tray
- Moonbase now warns the user when enabling a dangerous extension
- Moonbase now checks the extension author when using the search filter
- Added a tooltip for conflicting extensions in Moonbase
- Added basic crash cause detection

## Core

- Reworked core loading to properly be asynchronous, fixing race conditions
  - **A full client restart is required when updating to this version!**
  - If you have any issues starting your client, or moonlight does not load, let us know!
  - Special thanks to @gBasil for helping us find this issue.
- Added better support for `\i` in patching and Spacepack
- Added better error handling in entrypoint Webpack modules to prevent crashes
- Added hard fail/"grouping" to patches
- Added being able to patch mapped modules by referencing their name in the patch find
- Fixed a bug with extensions patching the same Webpack module
  - Special thanks to @karashiiro for helping us find this issue.
- Added API parity to all moonlight global variables
- Updated all core extension manifests
- Added an optional config to the injector for special installation setups

## Documentation

- Updated the GitHub README and project website
- Added "Why moonlight?" section to the project website
- Updated Starlight
- Added better documentation for all core extensions
- Documented the new moonlight features
- Added documentation for writing mappings
- Added note about auto-detected Linux installs and running as root
- Added clearer download buttons for the moonlight installer
- Documented installing moonlight through Nix
- Added contribution guidelines
- Added reminder to restart fully when adding React DevTools
- Mention all files when editing the sample extension
- Documented extension manifests
- Documented adding types for Webpack module import statements
- Clarified how moonlight environments and globals behave
- Fixed an invalid suggestion for matching yourself with Spacepack
- Performed a general cleanup pass on grammar

## Misc

- Fixed Nix support by updating pnpm2nix (thank you @sersorrel!)
- Cleaned up the installer (thank you @pauliesnug!)
- Updated deprecated GitHub Actions to the latest version
- Updated & cleaned up sample extension
- Fixed auth requirement for RoboJules
- Merged 9 new extensions (thank you @Cynosphere, @redstonekasi!)
- Cleaned up GitHub organization permissions by moving to teams
