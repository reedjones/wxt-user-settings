# wxt-user-settings

WXT module that generates a settings page and runtime API based on a schema.

## Features

- Generates a settings page (unlisted) from a schema
- Runtime API for get/set/reset and change listeners
- Pluggable adapters (built-in: ui-schema, uniforms)

## Install

```bash
pnpm add wxt-user-settings
```

## Quick start

Add the module and schema in your WXT config:

```ts
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['wxt-user-settings'],
  userSettings: {
    title: 'Example Settings',
    description: 'Settings powered by wxt-user-settings.',
    storage: 'local',
    adapter: 'ui-schema',
    schema: {
      theme: {
        type: 'select',
        label: 'Theme',
        required: true,
        defaultValue: 'light',
        options: [
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ],
      },
      notifications: {
        type: 'boolean',
        label: 'Enable notifications',
        defaultValue: true,
      },
    },
  },
});
```

Use the runtime API (generated during prepare/build):

```ts
import { settings } from './user-settings';

const all = await settings.getAll();
await settings.set('theme', 'dark');

const stop = settings.onChange((next) => {
  console.log('Updated settings:', next);
});
```

## Custom adapter

If you want a custom UI, point `userSettings.adapter` to a TS/TSX entrypoint that exports a `SettingsForm` component.

```ts
adapter: './entrypoints/user-settings/SettingsForm'
```

## Documentation

- Usage and schema reference: [docs/USAGE.md](docs/USAGE.md)
- Development workflows: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- Example project: [example/README.md](example/README.md)
