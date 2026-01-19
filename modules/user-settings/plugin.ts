import { addWxtPlugin, defineWxtModule } from 'wxt/modules';

export default defineWxtModule((wxt) => {
  addWxtPlugin(wxt, 'wxt-user-settings/client-plugin');
});