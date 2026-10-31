import { type FieldLike } from "./field";
/**
 * Values of a record are JSON-friendly: numbers, strings, booleans, arrays and objects.
 * Dates are ISO 8601 strings: "2026-10-31" for DATE, "13:45:00" for TIME, "2026-10-31T13:45:00"
 * for DATETIME and TIMESTAMP, and a UTC instant ("2026-10-31T11:45:00.000Z") for TIMESTAMP_TZ.
 * Date objects are accepted wherever a date is expected.
 */
/** Result of reading what the user entered: the record value, or why it could not be read. */
export type Parsed = {
    ok: true;
    value: unknown;
} | {
    ok: false;
    error: 'number' | 'date' | 'json';
};
export declare function isEmpty(value: unknown): boolean;
/** Record value of the field to the value held by its Vuetify control; OBJECT values become JSON text. */
export declare function toInput(field: FieldLike, value: unknown): unknown;
/**
 * Value held by the Vuetify control of the field to the record value; empty input is null.
 * OBJECT values are converted from JSON text here; sub-forms edit them without conversion.
 */
export declare function fromInput(field: FieldLike, input: unknown): Parsed;
