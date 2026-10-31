import { type FieldLike, type ModelLike } from "./field";
import { type ValidationMessages } from "./messages";
/** A check of one value: true when it passes, otherwise the message to show. */
export type FieldRule = (value: unknown) => true | string;
/**
 * Checks of a record value of the field, from its type, parameters and constraints.
 * Constraints that need other records or the database (primaryKey, unique, foreignKey) are not checked.
 */
export declare function fieldRules(field: FieldLike, overrides?: Partial<ValidationMessages>): FieldRule[];
/** Checks of the value held by the Vuetify control of the field: it must be readable, then pass fieldRules(). */
export declare function inputRules(field: FieldLike, overrides?: Partial<ValidationMessages>): FieldRule[];
/**
 * Messages of the table-level check constraints the record violates. As in SQL, a check
 * involving an empty value passes; whether a value may be empty is up to the field.
 */
export declare function recordErrors(model: ModelLike, record: Record<string, unknown>, overrides?: Partial<ValidationMessages>): string[];
