Discord pushed two breaking updates within two days. A lot of modules had to be remapped due to the common components module disappearing.

Extensions that relied on common components will need to be updated by their authors.

## Core

- Internal refactoring to support loading multiple initial Webpack chunks
  - This was done to fix launch signature not generating
- Enable persistence on Linux

### Injector & Node Preload

- Send back a response from preload when the `web` chunk is loaded to workaround initial chunks with numeric names being added
  - The web extension still needs this fixed

### Module Patching

- Patched and injected modules now have a require wrapper to log an error when a required module is not found

## Core Extensions

- Patch fixes where relevant

### Moonbase

- The config tab and extension settings have been slightly redesigned to fit within Discord's Mana/Void design system

### Spacepack

- Filter out proxies and support `A` and `Ay` as default keys in `findByExports`
  - You should still consider `findByExports` deprecated for use in extensions
- Fix `inspect` breaking when `patchAll` is disabled

### Native Fixes

- Linux Updater is now disabled on Canary due to Discord working on their own native updater solution

## Mappings

- 71 new mapped modules
