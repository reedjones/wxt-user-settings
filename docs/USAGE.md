# Usage

## Configure the module

Add the module and the userSettings block in your WXT config.

Example:

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

## Schema fields

Each entry in userSettings.schema uses a FieldSchema with these properties:

- type: text | number | boolean | select | textarea | email | url | date | color
- label: Display label for the field
- defaultValue: Initial value (optional)
- placeholder: Placeholder text (optional)
- description: Helper text (optional)
- required: Whether the field is required (optional)
- validation: min, max, pattern, custom (optional)
- options: select options for select fields (optional)
- inputType: custom input type override (optional)
- props: additional UI props passed to adapters (optional)

## Storage options

Set userSettings.storage to one of:
- local
- sync
- managed

## Adapters

Built-in adapters:
- ui-schema
- uniforms

Custom adapters can be used by pointing userSettings.adapter at a TS or TSX entrypoint that exports a SettingsForm component.

    adapter: './entrypoints/user-settings/SettingsForm'

## Runtime API

The module generates a runtime helper with these methods:
- settings.getAll()
- settings.get(key)
- settings.set(key, value)
- settings.setMultiple(values)
- settings.saveAll(settings)
- settings.reset()
- settings.onChange(callback)
