import { renderTemplate } from '../template-loader';

export function generateRuntime(storage: string, defaultValues: Record<string, unknown>): string {
    return renderTemplate('runtime.ts', {
        STORAGE_TYPE: storage,
        DEFAULT_VALUES: JSON.stringify(defaultValues, null, 2),
    });
}
