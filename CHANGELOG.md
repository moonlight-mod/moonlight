## Core

Discord updated rspack. Most extensions will be broken until they are updated.

- Patching needed a workaround now that rspack optimizes module definitions to exclude `:function`
- Update mappings

## Core Extensions

- Fix patches where needed

### Moonbase

- Crash screen "possible causes" now properly detects when an extension's modules are in the stack

### spacepack

- Fixed `findObjectFromKeyValuePair` always retuning `null`
- Added `findObjectFromValueSubstring`
  - Useful for CSS modules as their export names are mangled now
