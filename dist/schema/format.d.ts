import { type FieldLike } from "./field";
/** Text of a record value for display, e.g. in a table cell; empty values give an empty string. */
export declare function formatValue(field: FieldLike, value: unknown, locale?: string): string;
