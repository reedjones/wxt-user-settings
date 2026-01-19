// Auto-generated user settings runtime
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
