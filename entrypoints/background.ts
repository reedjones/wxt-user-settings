import { settings } from '../user-settings';

export default defineBackground(async () => {
    const allSettings = await settings.getAll();
    console.log('User settings loaded in background:', allSettings);

    settings.onChange((updated) => {
        console.log('User settings updated:', updated);
    });
});