import 'wxt';

export interface FieldSchema {
    type:
    | 'text'
    | 'number'
    | 'boolean'
    | 'select'
    | 'textarea'
    | 'email'
    | 'url'
    | 'date'
    | 'color';
    label: string;
    defaultValue?: any;
    placeholder?: string;
    description?: string;
    required?: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: string;
    };
    options?: Array<{ label: string; value: any }>;
    inputType?: string;
    props?: Record<string, any>;
}

export interface SettingsSchema {
    [key: string]: FieldSchema;
}

export interface UserSettingsConfig {
    schema: SettingsSchema;
    title?: string;
    description?: string;
    adapter?: 'ui-schema' | 'uniforms' | string;
    storage?: 'local' | 'sync' | 'managed';
    onSave?: string;
}

declare module 'wxt' {
    export interface InlineConfig {
        userSettings?: UserSettingsConfig;
    }
}
