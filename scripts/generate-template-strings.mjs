import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const root = process.cwd();
const templatesDir = resolve(root, 'src', 'templates');
const outputFile = resolve(root, 'src', 'generated', 'templates.ts');

const templates = [
    'runtime.ts',
    'adapters/ui-schema.tsx',
    'adapters/uniforms.tsx',
    'entrypoint.tsx',
    'index.html',
    'style.css',
];

const entries = templates.map((key) => {
    const filePath = resolve(templatesDir, key);
    const content = readFileSync(filePath, 'utf8').replace(/`/g, '\\`');
    return `  "${key}": \`${content}\``;
});

const output = `export const templateSources = {\n${entries.join(',\n')}\n} as const;\n`;
writeFileSync(outputFile, output);

console.log(`✓ Generated template sources: ${outputFile}`);
