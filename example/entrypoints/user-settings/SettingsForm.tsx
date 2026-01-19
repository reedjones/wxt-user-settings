import React from 'react';
import { settings, settingsSchema, settingsConfig } from '../../user-settings';
import type { UserSettings } from '../../user-settings';

export const SettingsForm: React.FC = () => {
    const [values, setValues] = React.useState<UserSettings | null>(null);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        settings.getAll().then(setValues);
        const stop = settings.onChange((next) => setValues({ ...next }));
        return () => stop();
    }, []);

    const updateValue = (key: keyof UserSettings, value: unknown) => {
        setValues((current) => ({ ...(current ?? ({} as UserSettings)), [key]: value }));
    };

    const handleSave = async () => {
        if (!values) return;
        setSaving(true);
        await settings.saveAll(values);
        setSaving(false);
    };

    if (!values) return <div style={{ padding: 20 }}>Loading settings…</div>;

    return (
        <div style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
            <h1>{settingsConfig.title}</h1>
            {settingsConfig.description && <p>{settingsConfig.description}</p>}

            <div style={{ display: 'grid', gap: 16 }}>
                {Object.entries(settingsSchema).map(([key, field]) => {
                    const value = (values as any)[key];

                    if (field.type === 'boolean') {
                        return (
                            <label key={key} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={Boolean(value)}
                                    onChange={(event) => updateValue(key as keyof UserSettings, event.target.checked)}
                                />
                                <span>{field.label}</span>
                            </label>
                        );
                    }

                    if (field.type === 'select' && field.options) {
                        return (
                            <label key={key} style={{ display: 'grid', gap: 6 }}>
                                <span>{field.label}</span>
                                <select
                                    value={value ?? ''}
                                    onChange={(event) => updateValue(key as keyof UserSettings, event.target.value)}
                                >
                                    {field.options.map((option) => (
                                        <option key={String(option.value)} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        );
                    }

                    return (
                        <label key={key} style={{ display: 'grid', gap: 6 }}>
                            <span>{field.label}</span>
                            <input
                                type={field.type === 'number' ? 'number' : 'text'}
                                value={value ?? ''}
                                placeholder={field.placeholder}
                                onChange={(event) =>
                                    updateValue(
                                        key as keyof UserSettings,
                                        field.type === 'number' ? Number(event.target.value) : event.target.value
                                    )
                                }
                            />
                        </label>
                    );
                })}
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                style={{ marginTop: 20, padding: '10px 16px' }}
            >
                {saving ? 'Saving…' : 'Save settings'}
            </button>
        </div>
    );
};
