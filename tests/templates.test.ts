import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { templateSources } from '../src/generated/templates';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const templatesDir = resolve(rootDir, 'src', 'templates');

describe('templateSources', () => {
    it('matches on-disk templates', () => {
        for (const [key, value] of Object.entries(templateSources)) {
            const filePath = resolve(templatesDir, key);
            const fileContents = readFileSync(filePath, 'utf8');
            const normalize = (text: string) => text.replace(/\r\n/g, '\n');
            expect(normalize(value)).toBe(normalize(fileContents));
        }
    });
});
