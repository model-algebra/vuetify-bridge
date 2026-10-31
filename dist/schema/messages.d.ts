import type { Rule } from "model-algebra-common";
/** Validation messages; each gets the label of the field being checked. Pass a Partial to override some of them. */
export interface ValidationMessages {
    required(label: string): string;
    number(label: string): string;
    integer(label: string): string;
    min(label: string, min: number): string;
    max(label: string, max: number): string;
    decimals(label: string, scale: number): string;
    maxLength(label: string, length: number): string;
    oneOf(label: string, values: readonly unknown[]): string;
    pattern(label: string, regex: string): string;
    uuid(label: string): string;
    duration(label: string): string;
    date(label: string): string;
    json(label: string): string;
    /** A table-level check rule; `other` is the label of the other field or the literal value. */
    check(label: string, op: Rule['op'], other: string): string;
}
export declare const defaultMessages: ValidationMessages;
export declare function resolveMessages(overrides?: Partial<ValidationMessages>): ValidationMessages;
