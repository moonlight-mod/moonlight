## Core

- Rewrote moonlight's script blocking mechanism (thanks @marshift for the inspiration!)
  - The browser extension may work unreliably right now; we're working on it:tm:
  - If you encounter any issues with loading Discord, please let us know
- Cleaned up some things in the Nix flake (thank you @isabelroses!)
- Fixed disabled extensions still implicitly enabling other extensions

## Core extensions

- Disable Sentry: Updated to support the newly bundled .asar
- Native Fixes: Removed Linux updater
  - Discord on Linux has a built-in Linux updater now! Thank you for your service over the years, `nativeFixes/host.ts` :saluting_face:
  - If you cannot patch moonlight from the moonlight installer, make sure it is updated to the latest version

## Mappings

- Fixes for latest Discord
