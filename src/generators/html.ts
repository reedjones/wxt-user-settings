import { renderTemplate } from '../template-loader';

export function generateHTML(title: string): string {
    return renderTemplate('index.html', { TITLE: title });
}
