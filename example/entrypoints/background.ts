import { settings } from '../user-settings';

export default defineBackground(async () => {
  const current = await settings.getAll();
  console.log('Background settings loaded:', current);

  settings.onChange((next) => {
    console.log('Background settings updated:', next);
  });
});
