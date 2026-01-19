// Uniforms adapter for settings form
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
