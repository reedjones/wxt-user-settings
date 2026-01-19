import { addEntrypoint, defineWxtModule } from 'wxt/modules';
import { resolve } from 'path';
import { writeFileSync, mkdirSync } from 'fs';
import {
  generateTypes,
  generateRuntime,
  generateUISchemaAdapter,
  generateUniformsAdapter,
  generateEntrypoint,
  generateHTML,
  generateStyle,
} from './generators';
import type { UserSettingsConfig } from './types';
export type { FieldSchema, SettingsSchema, UserSettingsConfig } from './types';

export default defineWxtModule<UserSettingsConfig>({
  name: 'user-settings',
  configKey: 'userSettings',
  async setup(wxt, options) {
    if (!options?.schema) {
      console.warn('No user settings schema provided');
      return;
    }

    const { schema, title = 'Settings', description, adapter = 'ui-schema', storage = 'local' } = options;

    const defaultValues = Object.entries(schema).reduce((acc, [key, field]) => {
      if (field.defaultValue !== undefined) {
        acc[key] = field.defaultValue;
      }
      return acc;
    }, {} as Record<string, any>);

    const settingsDir = resolve(wxt.config.root, '.wxt/user-settings');
    const adaptersDir = resolve(settingsDir, 'adapters');
    const entrypointPath = resolve(settingsDir, 'index.html');

    wxt.hook('prepare:types', async (_, entries) => {
      entries.push({
        path: resolve(wxt.config.wxtDir, 'user-settings/types.ts'),
        text: generateTypes(schema, { title, description, storage }),
        tsReference: true,
      });
    });

    try {
      mkdirSync(settingsDir, { recursive: true });
      mkdirSync(adaptersDir, { recursive: true });

      // Write generated files
      writeFileSync(
        resolve(settingsDir, 'types.ts'),
        generateTypes(schema, { title, description, storage })
      );
      writeFileSync(resolve(settingsDir, 'runtime.ts'), generateRuntime(storage, defaultValues));
      writeFileSync(resolve(settingsDir, 'main.tsx'), generateEntrypoint(adapter));
      writeFileSync(entrypointPath, generateHTML(title));
      writeFileSync(resolve(settingsDir, 'style.css'), generateStyle());

      writeFileSync(resolve(adaptersDir, 'ui-schema.tsx'), generateUISchemaAdapter());
      writeFileSync(resolve(adaptersDir, 'uniforms.tsx'), generateUniformsAdapter());

      addEntrypoint(wxt, {
        type: 'unlisted-page',
        name: 'user-settings',
        inputPath: entrypointPath,
        outputDir: wxt.config.outDir,
        options: {},
      });

      // Export runtime for use in extension
      writeFileSync(
        resolve(wxt.config.root, 'user-settings.ts'),
        `export * from './.wxt/user-settings/types';\nexport * from './.wxt/user-settings/runtime';`
      );

      console.log('✓ User settings module generated successfully');
    } catch (error) {
      console.error('Failed to generate user settings module:', error);
    }
  },
});