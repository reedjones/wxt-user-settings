# Project Memory

## Purpose
This document captures repeatable steps, decisions, and key locations for maintaining the wxt-user-settings module and example.

## Key Locations
- Module entry: [src/index.ts](src/index.ts)
- Runtime template: [src/templates/runtime.ts](src/templates/runtime.ts)
- Template source bundle: [src/generated/templates.ts](src/generated/templates.ts)
- Example config: [example/wxt.config.ts](example/wxt.config.ts)

## Storage Runtime Notes
- Use `browser.storage` (not `chrome.storage`). WXT provides the `browser` namespace; with auto-imports enabled, you typically don’t need to import it explicitly.
- Only use extension APIs inside `defineBackground`/`defineContentScript`/`defineUnlistedScript` main functions to avoid non-extension environment errors.

## Regeneration Workflow
1) Update templates in [src/templates/runtime.ts](src/templates/runtime.ts) (and other templates as needed).
2) Regenerate template sources:
   - Run: `pnpm run generate:templates`
3) Rebuild package:
   - Run: `pnpm run build`
4) Reinstall example to pick up local file package changes:
   - Run: `pnpm -C example install`
5) Regenerate example artifacts:
   - Run: `pnpm -C example exec wxt prepare`

## Example Entrypoint Notes
- User settings adapter should point to the example entrypoint:
  - `userSettings.adapter` in [example/wxt.config.ts](example/wxt.config.ts) should use `./entrypoints/user-settings/SettingsForm`.

## Known Pitfalls
- HTML entrypoints should not be parsed with `importEntrypoint` (intended for TS/JS).
- If build errors mention HTML being parsed as JS, ensure HTML pages are added without `importEntrypoint` options.
