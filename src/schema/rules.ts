import type { Rule } from "model-algebra-common";
import {
    INTEGER_RANGES, enumValues, fieldConstraints, fieldKind, fieldLabel, isRequired,
    type FieldLike, type ModelLike,
} from "./field";
import { fromInput, isEmpty } from "./convert";
import { resolveMessages, type ValidationMessages } from "./messages";

/** A check of one value: true when it passes, otherwise the message to show. */
export type FieldRule = (value: unknown) => true | string;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DURATION = /^-?P(?!$)(\d+(\.\d+)?Y)?(\d+(\.\d+)?M)?(\d+(\.\d+)?W)?(\d+(\.\d+)?D)?(T(?=\d)(\d+(\.\d+)?H)?(\d+(\.\d+)?M)?(\d+(\.\d+)?S)?)?$/;

function decimalPlaces(value: number): number {
    const [mantissa, exponent] = String(value).split('e');
    const fraction = mantissa.split('.')[1]?.length ?? 0;
    return Math.max(0, fraction - Number(exponent ?? 0));
}

const isValidDate = (value: unknown) =>
    value instanceof Date ? !Number.isNaN(value.getTime()) : !Number.isNaN(new Date(String(value)).getTime());

/**
 * Checks of a record value of the field, from its type, parameters and constraints.
 * Constraints that need other records or the database (primaryKey, unique, foreignKey) are not checked.
 */
export function fieldRules(field: FieldLike, overrides?: Partial<ValidationMessages>): FieldRule[] {
    const messages = resolveMessages(overrides);
    const label = fieldLabel(field);
    const kind = fieldKind(field);
    const constraints = fieldConstraints(field);
    const params = field.parameters ?? {};
    const checks: FieldRule[] = [];
    const check = (passes: (value: any) => boolean, message: string) =>
        checks.push(value => passes(value) || message);

    if (kind === 'integer' || kind === 'number')
        check(value => typeof value === 'number' && Number.isFinite(value), messages.number(label));
    if (kind === 'integer') {
        check(value => Number.isInteger(value), messages.integer(label));
        const range = INTEGER_RANGES.get(field.type);
        if (range !== undefined) {
            check(value => value >= range[0], messages.min(label, range[0]));
            check(value => value <= range[1], messages.max(label, range[1]));
        }
    }
    if (field.type === 'DECIMAL' && typeof params.scale === 'number')
        check(value => decimalPlaces(value) <= params.scale, messages.decimals(label, params.scale));
    if (typeof constraints.min === 'number')
        check(value => value >= constraints.min, messages.min(label, constraints.min));
    if (typeof constraints.max === 'number')
        check(value => value <= constraints.max, messages.max(label, constraints.max));

    if (field.type === 'STRING' && typeof params.length === 'number')
        check(value => String(value).length <= params.length, messages.maxLength(label, params.length));
    if (field.type === 'UUID')
        check(value => UUID.test(String(value)), messages.uuid(label));
    if (field.type === 'DURATION')
        check(value => DURATION.test(String(value)), messages.duration(label));
    if (typeof constraints.regex === 'string' && field.type !== 'ARRAY') {
        const regex = new RegExp(constraints.regex);
        check(value => regex.test(String(value)), messages.pattern(label, constraints.regex));
    }

    const allowed = enumValues(field);
    if (allowed !== undefined)
        check(
            value => Array.isArray(value) ? value.every(item => allowed.includes(item)) : allowed.includes(value),
            messages.oneOf(label, allowed),
        );

    if (kind === 'date' || kind === 'datetime')
        check(isValidDate, messages.date(label));

    const required = isRequired(field);
    return [value => {
        if (isEmpty(value)) return required ? messages.required(label) : true;
        for (const rule of checks) {
            const result = rule(value);
            if (result !== true) return result;
        }
        return true;
    }];
}

/** Checks of the value held by the Vuetify control of the field: it must be readable, then pass fieldRules(). */
export function inputRules(field: FieldLike, overrides?: Partial<ValidationMessages>): FieldRule[] {
    const messages = resolveMessages(overrides);
    const label = fieldLabel(field);
    const rules = fieldRules(field, overrides);
    return [input => {
        const parsed = fromInput(field, input);
        if (!parsed.ok) return messages[parsed.error](label);
        for (const rule of rules) {
            const result = rule(parsed.value);
            if (result !== true) return result;
        }
        return true;
    }];
}

const comparable = (value: unknown) => value instanceof Date ? value.getTime() : value;

function compare(op: Rule['op'], left: any, right: any): boolean {
    switch (op) {
        case '=': return left === right;
        case '!=': return left !== right;
        case '<': return left < right;
        case '<=': return left <= right;
        case '>': return left > right;
        case '>=': return left >= right;
    }
}

/**
 * Messages of the table-level check constraints the record violates. As in SQL, a check
 * involving an empty value passes; whether a value may be empty is up to the field.
 */
export function recordErrors(
    model: ModelLike,
    record: Record<string, unknown>,
    overrides?: Partial<ValidationMessages>,
): string[] {
    const messages = resolveMessages(overrides);
    const fields = new Map(model.fields.map(field => [field.name, field]));
    const labelOf = (name: string) => {
        const field = fields.get(name);
        return field !== undefined ? fieldLabel(field) : name;
    };
    const errors: string[] = [];
    for (const constraint of model.constraints ?? []) {
        if (constraint.type !== 'check' || constraint.rule === undefined) continue;
        const rule = constraint.rule;
        const left = record[rule.field];
        const right = rule.otherField !== undefined ? record[rule.otherField] : rule.value;
        if (isEmpty(left) || isEmpty(right)) continue;
        if (!compare(rule.op, comparable(left), comparable(right))) {
            const other = rule.otherField !== undefined ? labelOf(rule.otherField) : String(rule.value);
            errors.push(messages.check(labelOf(rule.field), rule.op, other));
        }
    }
    return errors;
}
