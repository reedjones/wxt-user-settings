import { renderTemplate } from '../template-loader';

export function generateEntrypoint(adapter: string): string {
    const adapterImport =
        adapter === 'ui-schema'
            ? "import { SettingsForm } from './adapters/ui-schema';"
            : adapter === 'uniforms'
                ? "import { SettingsForm } from './adapters/uniforms';"
                : `import { SettingsForm } from '${adapter}';`;

    return renderTemplate('entrypoint.tsx', {
        ADAPTER_IMPORT: adapterImport,
    });
}
