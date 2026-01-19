import { getTemplateSource } from '../template-loader';

export function generateUISchemaAdapter(): string {
    return getTemplateSource('adapters/ui-schema.tsx');
}

export function generateUniformsAdapter(): string {
    return getTemplateSource('adapters/uniforms.tsx');
}
