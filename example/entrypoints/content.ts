import { settings } from '../user-settings';

export default defineContentScript({
  matches: ['*://*.google.com/*'],
  async main() {
    const current = await settings.getAll();
    console.log('Content script settings:', current);
  },
});
