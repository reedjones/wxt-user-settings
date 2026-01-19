import { getTemplateSource } from '../template-loader';

export function generateStyle(): string {
    return getTemplateSource('style.css');
}
