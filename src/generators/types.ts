import type { SettingsSchema } from '../types';

export interface TypesConfig {
    title: string;
    description?: string;
    storage: 'local' | 'sync' | 'managed';
}

export function generateTypes(schema: SettingsSchema, config: TypesConfig): string {
    const typeLines = Object.entries(schema).map(([key, field]) => {
        let tsType = 'any';
        switch (field.type) {
            case 'text':
            case 'textarea':
            case 'email':
            case 'url':
            case 'color':
                tsType = 'string';
                break;
            case 'number':
                tsType = 'number';
                break;
            case 'boolean':
                tsType = 'boolean';
                break;
            case 'date':
                tsType = 'string | Date';
                break;
            case 'select':
                if (field.options) {
                    const values = field.options.map((opt) => JSON.stringify(opt.value)).join(' | ');
                    tsType = values || 'any';
                }
                break;
        }
        return `  ${key}${field.required ? '' : '?'}: ${tsType};`;
    });

    return `// Auto-generated types for user settings
export interface UserSettings {
${typeLines.join('\n')}
}

export type SettingKey = keyof UserSettings;

export const settingsSchema = ${JSON.stringify(schema, null, 2)} as const;

export const settingsConfig = ${JSON.stringify(
        { title: config.title, description: config.description, storage: config.storage },
        null,
        2
    )} as const;
`;
}
