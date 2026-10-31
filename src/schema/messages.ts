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

const OPERATOR_WORDS: Record<Rule['op'], string> = {
    '=': 'equal to',
    '!=': 'different from',
    '<': 'less than',
    '<=': 'at most',
    '>': 'greater than',
    '>=': 'at least',
};

export const defaultMessages: ValidationMessages = {
    required: label => `${label} is required`,
    number: label => `${label} must be a number`,
    integer: label => `${label} must be a whole number`,
    min: (label, min) => `${label} must be at least ${min}`,
    max: (label, max) => `${label} must be at most ${max}`,
    decimals: (label, scale) => `${label} must have at most ${scale} decimal places`,
    maxLength: (label, length) => `${label} must be at most ${length} characters`,
    oneOf: (label, values) => `${label} must be one of ${values.join(', ')}`,
    pattern: (label, regex) => `${label} must match ${regex}`,
    uuid: label => `${label} must be a UUID`,
    duration: label => `${label} must be an ISO 8601 duration, e.g. P1DT2H`,
    date: label => `${label} must be a valid date`,
    json: label => `${label} must be valid JSON`,
    check: (label, op, other) => `${label} must be ${OPERATOR_WORDS[op]} ${other}`,
};

export function resolveMessages(overrides?: Partial<ValidationMessages>): ValidationMessages {
    return overrides === undefined ? defaultMessages : { ...defaultMessages, ...overrides };
}
