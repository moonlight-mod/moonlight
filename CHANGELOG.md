Discord made another big breaking change (bumped the minimum ECMAScript version). Most patches and module finds will
need to be fixed.

We took a little bit longer to get this update out due to refactoring and improvements to the developer experience of
moonlight's core.

## Core

- Mappings and esbuild-config are now in the monorepo
- New version format based off of CalVer (`YYYY.MM.revision`)
  - Discord is an ever moving target, this makes more sense compared to an arbitrary version
- `develop` branch no longer exists
  - This only breaks Nix, remove the branch from your flake input's URL
- Build scripts have been improved
- Version tags are now signed
- Mappings, types and esbuild-config are now published on release

## Core Extensions

### Settings

- Fix patch _again_

### Markdown

- Fix Slate decorator patch

### Commands

- Fix option choices breaking due to missing `displayName` field

### Experiments

- Remove now obsolete patches and option for Discord's devtools

## Mappings

- All (but 7) mappings fixed
