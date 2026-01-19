import { settings } from 'wxt-user-settings';

settings.getAll().then((all) => {
    console.log('User settings loaded in example page:', all);
});