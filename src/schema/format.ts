import { fieldKind, type FieldLike } from "./field";

const JSON_PREVIEW_LENGTH = 60;

/** Parses a record date; a plain "YYYY-MM-DD" is a local date, not UTC midnight. */
function toDate(value: unknown): Date {
    if (value instanceof Date) return value;
    const text = String(value);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    return match !== null ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(text);
}

/** Text of a record value for display, e.g. in a table cell; empty values give an empty string. */
export function formatValue(field: FieldLike, value: unknown, locale?: string): string {
    if (value === null || value === undefined) return '';
    switch (fieldKind(field)) {
        case 'integer':
        case 'number': {
            if (typeof value !== 'number') return String(value);
            const scale = field.type === 'DECIMAL' ? field.parameters?.scale : undefined;
            return new Intl.NumberFormat(locale, typeof scale === 'number'
                ? { minimumFractionDigits: scale, maximumFractionDigits: scale }
                : { maximumFractionDigits: 20 }).format(value);
        }
        case 'boolean':
            return value ? 'Yes' : 'No';
        case 'date': {
            const date = toDate(value);
            return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString(locale);
        }
        case 'datetime': {
            const date = toDate(value);
            return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString(locale);
        }
        case 'multiEnum':
        case 'tags':
            return Array.isArray(value) ? value.join(', ') : String(value);
        case 'json':
        case 'object':
        case 'objectList': {
            const text = JSON.stringify(value);
            return text.length > JSON_PREVIEW_LENGTH ? `${text.slice(0, JSON_PREVIEW_LENGTH - 1)}…` : text;
        }
        case 'unsupported':
            return value instanceof Uint8Array ? `${value.length} bytes` : String(value);
        default:
            return String(value);
    }
}
