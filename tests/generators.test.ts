import { describe, it, expect } from 'vitest';
import { generateTypes, generateRuntime, generateEntrypoint } from '../src/generators';
import type { SettingsSchema } from '../src/types';
import { renderTemplate } from '../src/template-loader';

const schema: SettingsSchema = {
    theme: {
        type: 'select',
        label: 'Theme',
        required: true,
        options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
        ],
    },
    notify: {
        type: 'boolean',
        label: 'Notify',
        defaultValue: true,
    },
};

describe('generators', () => {
    it('generates types with schema and config', () => {
        const output = generateTypes(schema, {
            title: 'Settings',
            description: 'Test',
            storage: 'local',
        });

        expect(output).toContain('export interface UserSettings');
        expect(output).toContain('theme: "light" | "dark";');
        expect(output).toContain('notify?: boolean;');
        expect(output).toContain('settingsConfig');
    });

    it('generates runtime with replacements', () => {
        const output = generateRuntime('sync', { notify: true });
        expect(output).toContain("const STORAGE_TYPE = 'sync' as const;");
        expect(output).toContain('notify');
    });

    it('generates entrypoint with adapter import', () => {
        const uniforms = generateEntrypoint('uniforms');
        expect(uniforms).toContain("import { SettingsForm } from './adapters/uniforms';");

        const custom = generateEntrypoint('my-adapter');
        expect(custom).toContain("import { SettingsForm } from 'my-adapter';");
    });
});

describe('template loader', () => {
    it('renders templates with replacements', () => {
        const html = renderTemplate('index.html', { TITLE: 'User Settings' });
        expect(html).toContain('<title>User Settings</title>');
    });
});
