import { fieldKind, type FieldLike } from "./field";

/**
 * Values of a record are JSON-friendly: numbers, strings, booleans, arrays and objects.
 * Dates are ISO 8601 strings: "2026-10-31" for DATE, "13:45:00" for TIME, "2026-10-31T13:45:00"
 * for DATETIME and TIMESTAMP, and a UTC instant ("2026-10-31T11:45:00.000Z") for TIMESTAMP_TZ.
 * Date objects are accepted wherever a date is expected.
 */

/** Result of reading what the user entered: the record value, or why it could not be read. */
export type Parsed =
    | { ok: true, value: unknown }
    | { ok: false, error: 'number' | 'date' | 'json' };

const pad = (n: number, width = 2) => String(n).padStart(width, '0');

const localDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const localTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

/** A value given as a Date or as an ISO string with an offset, as a Date; anything else as undefined. */
function instant(value: unknown): Date | undefined {
    if (value instanceof Date) return value;
    if (typeof value === 'string' && /(Z|[+-]\d\d:?\d\d)$/.test(value)) return new Date(value);
    return undefined;
}

export function isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
}

/** Record value of the field to the value held by its Vuetify control; OBJECT values become JSON text. */
export function toInput(field: FieldLike, value: unknown): unknown {
    const kind = fieldKind(field);
    switch (kind) {
        case 'multiEnum':
        case 'tags':
            return Array.isArray(value) ? value : [];
        case 'boolean':
        case 'enum':
        case 'unsupported':
            return value ?? null;
    }
    if (value === null || value === undefined) return '';
    switch (kind) {
        case 'date': {
            const date = instant(value);
            return date !== undefined ? localDate(date) : String(value).slice(0, 10);
        }
        case 'time':
            return value instanceof Date ? localTime(value) : String(value);
        case 'datetime': {
            const date = instant(value);
            return date !== undefined
                ? `${localDate(date)}T${localTime(date)}`
                : String(value).replace(' ', 'T').slice(0, 19);
        }
        case 'json':
        case 'object':
        case 'objectList':
            return JSON.stringify(value, null, 2);
        default:
            return String(value);
    }
}

/**
 * Value held by the Vuetify control of the field to the record value; empty input is null.
 * OBJECT values are converted from JSON text here; sub-forms edit them without conversion.
 */
export function fromInput(field: FieldLike, input: unknown): Parsed {
    const kind = fieldKind(field);
    if (kind === 'multiEnum' || kind === 'tags')
        return { ok: true, value: Array.isArray(input) ? input : [] };
    if (isEmpty(input)) return { ok: true, value: null };
    switch (kind) {
        case 'integer':
        case 'number': {
            const value = typeof input === 'number' ? input : Number(String(input).trim());
            return Number.isFinite(value) ? { ok: true, value } : { ok: false, error: 'number' };
        }
        case 'datetime': {
            if (field.type !== 'TIMESTAMP_TZ') return { ok: true, value: input };
            const date = new Date(String(input));
            return Number.isNaN(date.getTime()) ? { ok: false, error: 'date' } : { ok: true, value: date.toISOString() };
        }
        case 'json':
        case 'object':
        case 'objectList':
            try {
                return { ok: true, value: JSON.parse(String(input)) };
            } catch {
                return { ok: false, error: 'json' };
            }
        default:
            return { ok: true, value: input };
    }
}
