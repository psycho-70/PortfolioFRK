const HTML_TAG = /<\/?[a-z][\s\S]*>/i;

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

export const isRichText = (value: string) => HTML_TAG.test(value);

// Plain-text previews for cards, tables and the chatbot payloads.
export const stripHtml = (value?: string | null) => {
    if (!value) return '';
    const decoded = value
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, ' ')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&amp;/gi, '&');
    return decoded.replace(/\s+/g, ' ').trim();
};

// Renders stored content safely: new HTML records are sanitized by the API,
// while older plain-text records are escaped and split into paragraphs.
export const toDisplayHtml = (value?: string | null) => {
    if (!value) return '';
    if (!isRichText(value)) {
        return value
            .split(/\n{2,}/)
            .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
            .join('');
    }
    return value;
};
