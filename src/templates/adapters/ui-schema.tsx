// UI-Schema adapter for settings form
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
