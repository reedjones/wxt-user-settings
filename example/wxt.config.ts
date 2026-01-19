import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react', 'wxt-user-settings'],
  userSettings: {
    title: 'Example Settings',
    description: 'Settings powered by the wxt-user-settings module.',
    storage: 'local',
    adapter: '../../entrypoints/user-settings/SettingsForm',
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
      username: {
        type: 'text',
        label: 'Display name',
        defaultValue: 'Guest',
        placeholder: 'Enter your name',
      },
      itemsPerPage: {
        type: 'number',
        label: 'Items per page',
        defaultValue: 10,
        validation: {
          min: 5,
          max: 100,
        },
      },
    },
  },
});
