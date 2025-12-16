## Core

- Discord changed from camelCase to kebab-case on script names, script blocking regex needed to be updated to include `-`.
- Updated mappings

## Core extensions

### Component Editor

- Fix DM list

### Context Menu

- Fix patches _again_

### moonbase

- Fix crash screen not loading
- Fix crash screen patches that were broken for a while
- Added error boundaries to config and about tabs so they don't fallthrough to crash screen when broken
- Fixed jankiness with the confirmation modals (e.g. danger zone extensions) when confirming
- Update notice now goes to redesigned settings

### Settings

- Fixed context menu for redesigned settings

## Browser

- Developer Portal now loads with the browser extension enabled

## Other

- Discord changed how their CSS modules have unique classnames again, as such almost every theme is broken in some way
  - This also extends to some extensions that modify Discord's styles
