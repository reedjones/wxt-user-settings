export const templateSources = {
  "runtime.ts": `// Auto-generated user settings runtime
import { browser } from 'wxt/browser';
import type { UserSettings, SettingKey } from './types';

const STORAGE_KEY = 'user_settings';
const STORAGE_TYPE = '__STORAGE_TYPE__' as const;

export class SettingsManager {
    private cache: UserSettings | null = null;

    async getAll(): Promise<UserSettings> {
        if (this.cache) return this.cache;

        const result = await browser.storage[STORAGE_TYPE].get(STORAGE_KEY);
        this.cache = { ...__DEFAULT_VALUES__, ...(result[STORAGE_KEY] || {}) } as UserSettings;
        return this.cache;
    }

    async get<K extends SettingKey>(key: K): Promise<UserSettings[K]> {
        const settings = await this.getAll();
        return settings[key];
    }

    async set<K extends SettingKey>(key: K, value: UserSettings[K]): Promise<void> {
        const settings = await this.getAll();
        settings[key] = value;
        await this.saveAll(settings);
    }

    async setMultiple(values: Partial<UserSettings>): Promise<void> {
        const settings = await this.getAll();
        Object.assign(settings, values);
        await this.saveAll(settings as UserSettings);
    }

    async saveAll(settings: UserSettings): Promise<void> {
        this.cache = settings;
        await browser.storage[STORAGE_TYPE].set({ [STORAGE_KEY]: settings });
    }

    async reset(): Promise<void> {
        this.cache = null;
        await browser.storage[STORAGE_TYPE].remove(STORAGE_KEY);
    }

    onChange(callback: (settings: UserSettings) => void): () => void {
        const listener = (changes: any, area: string) => {
            if (area === STORAGE_TYPE && changes[STORAGE_KEY]) {
                this.cache = changes[STORAGE_KEY].newValue;
                callback(this.cache as UserSettings);
            }
        };
        browser.storage.onChanged.addListener(listener);
        return () => browser.storage.onChanged.removeListener(listener);
    }
}

export const settings = new SettingsManager();
`,
  "adapters/ui-schema.tsx": `// UI-Schema adapter for settings form
import React from 'react';
import { Form } from '@ui-schema/ui-schema';
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap';
import { settings } from '../runtime';
import { settingsSchema, settingsConfig } from '../types';
import type { UserSettings } from '../types';

const fieldTypeMap: Record<string, string> = {
    text: 'string',
    email: 'string',
    url: 'string',
    textarea: 'string',
    number: 'number',
    boolean: 'boolean',
    select: 'string',
    date: 'string',
    color: 'string',
};

const widgetMap: Record<string, string> = {
    textarea: 'Text',
    select: 'Select',
    boolean: 'Switch',
    date: 'Date',
    color: 'Color',
};

export const SettingsForm: React.FC = () => {
    const [formData, setFormData] = React.useState<UserSettings | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        settings.getAll().then((data) => {
            setFormData(data);
            setLoading(false);
        });
    }, []);

    const schema = React.useMemo(() => {
        const properties: Record<string, any> = {};
        const required: string[] = [];

        Object.entries(settingsSchema).forEach(([key, field]) => {
            const schemaField: any = {
                type: fieldTypeMap[field.type] || 'string',
                title: field.label,
            };

            if (field.description) schemaField.description = field.description;
            if (field.placeholder) schemaField.default = field.placeholder;
            if (field.type === 'select' && field.options) {
                schemaField.enum = field.options.map((opt) => opt.value);
            }
            if (field.validation) {
                if (field.validation.min !== undefined) schemaField.minimum = field.validation.min;
                if (field.validation.max !== undefined) schemaField.maximum = field.validation.max;
                if (field.validation.pattern) schemaField.pattern = field.validation.pattern;
            }
            if (field.inputType || widgetMap[field.type]) {
                schemaField.widget = field.inputType || widgetMap[field.type];
            }

            properties[key] = schemaField;
            if (field.required) required.push(key);
        });

        return createOrderedMap({
            type: 'object',
            title: settingsConfig.title,
            description: settingsConfig.description,
            properties,
            required,
        });
    }, []);

    const handleChange = React.useCallback((data: any) => {
        setFormData(data.valuesToJS());
    }, []);

    const handleSave = React.useCallback(async () => {
        if (formData) {
            await settings.saveAll(formData);
            alert('Settings saved successfully!');
        }
    }, [formData]);

    if (loading) return <div>Loading settings...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Form schema={schema} onChange={handleChange} value={createOrderedMap(formData || {})} />
            <button onClick={handleSave} style={{ marginTop: '20px', padding: '10px 20px' }}>
                Save Settings
            </button>
        </div>
    );
};
`,
  "adapters/uniforms.tsx": `// Uniforms adapter for settings form
import React from 'react';
import { AutoForm } from 'uniforms';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import { settings } from '../runtime';
import { settingsSchema, settingsConfig } from '../types';
import type { UserSettings } from '../types';

const fieldTypeMap: Record<string, string> = {
    text: 'string',
    email: 'string',
    url: 'string',
    textarea: 'string',
    number: 'number',
    boolean: 'boolean',
    select: 'string',
    date: 'string',
    color: 'string',
};

export const SettingsForm: React.FC = () => {
    const [formData, setFormData] = React.useState<UserSettings | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        settings.getAll().then((data) => {
            setFormData(data);
            setLoading(false);
        });
    }, []);

    const bridge = React.useMemo(() => {
        const properties: Record<string, any> = {};
        const required: string[] = [];

        Object.entries(settingsSchema).forEach(([key, field]) => {
            const schemaField: any = {
                type: fieldTypeMap[field.type] || 'string',
                title: field.label,
            };

            if (field.description) schemaField.description = field.description;
            if (field.type === 'select' && field.options) {
                schemaField.enum = field.options.map((opt) => opt.value);
                schemaField.options = field.options.map((opt) => ({ label: opt.label, value: opt.value }));
            }
            if (field.validation) {
                if (field.validation.min !== undefined) schemaField.minimum = field.validation.min;
                if (field.validation.max !== undefined) schemaField.maximum = field.validation.max;
                if (field.validation.pattern) schemaField.pattern = field.validation.pattern;
            }
            if (field.type === 'textarea') schemaField.uniforms = { multiline: true };

            properties[key] = schemaField;
            if (field.required) required.push(key);
        });

        const schema = {
            type: 'object',
            title: settingsConfig.title,
            description: settingsConfig.description,
            properties,
            required,
        };

        return new JSONSchemaBridge(schema, () => { });
    }, []);

    const handleSubmit = React.useCallback(async (data: UserSettings) => {
        await settings.saveAll(data);
        alert('Settings saved successfully!');
    }, []);

    if (loading) return <div>Loading settings...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>{settingsConfig.title}</h1>
            {settingsConfig.description && <p>{settingsConfig.description}</p>}
            <AutoForm schema={bridge} model={formData} onSubmit={handleSubmit} />
        </div>
    );
};
`,
  "entrypoint.tsx": `// Auto-generated settings page entrypoint
import React from 'react';
import ReactDOM from 'react-dom/client';
__ADAPTER_IMPORT__
import './style.css';

const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <SettingsForm />
        </React.StrictMode>
    );
}
`,
  "index.html": `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__TITLE__</title>
</head>

<body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
</body>

</html>`,
  "style.css": `:root {
  color-scheme: light dark;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}

body {
  margin: 0;
  background: #0f172a;
  color: #e2e8f0;
}

button {
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background: #2563eb;
}
`
} as const;
