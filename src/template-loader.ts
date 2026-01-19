import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { templateSources } from './generated/templates';

export type TemplateKey = keyof typeof templateSources;

const baseDir = resolve(dirname(fileURLToPath(import.meta.url)), 'templates');

export function getTemplateSource(key: TemplateKey): string {
    const filePath = resolve(baseDir, key);
    if (existsSync(filePath)) {
        return readFileSync(filePath, 'utf8');
    }
    return templateSources[key];
}

export function renderTemplate(
    key: TemplateKey,
    replacements: Record<string, string>
): string {
    let content = getTemplateSource(key);
    for (const [name, value] of Object.entries(replacements)) {
        content = content.replaceAll(`__${name}__`, value);
    }
    return content;
}
