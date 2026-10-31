import { allTypesJson, eventJson, eventModel, field } from "../test/models";
import { fieldRules, inputRules, recordErrors } from "./rules";
import type { FieldLike } from "./field";

const check = (f: FieldLike, value: unknown) => fieldRules(f).map(rule => rule(value)).find(result => result !== true) ?? true;
const event = (name: string) => field(eventModel, name);
const any = (name: string) => field(allTypesJson, name);

describe('fieldRules', () => {
    test('required fields reject empty values, optional ones accept them', () => {
        expect(check(event('title'), null)).toBe('Title is required');
        expect(check(event('title'), '')).toBe('Title is required');
        expect(check(event('endDate'), null)).toBe(true);
    });

    test('integer types check whole numbers and their range', () => {
        expect(check(any('int32Field'), 1.5)).toBe('Int32 field must be a whole number');
        expect(check(any('int32Field'), 2 ** 31)).toBe('Int32 field must be at most 2147483647');
        expect(check(any('int64Field'), 2 ** 40)).toBe(true);
    });

    test('min and max constraints', () => {
        expect(check(event('seats'), 0)).toBe('Seats must be at least 1');
        expect(check(event('seats'), 501)).toBe('Seats must be at most 500');
        expect(check(event('seats'), 20)).toBe(true);
    });

    test('decimal scale', () => {
        expect(check(any('decimalField'), 1.25)).toBe(true);
        expect(check(any('decimalField'), 1.255)).toBe('Decimal field must have at most 2 decimal places');
    });

    test('string length, regex, UUID and duration', () => {
        expect(check(event('title'), 'x'.repeat(21))).toBe('Title must be at most 20 characters');
        expect(check(event('code'), 'ab')).toBe('Code must match ^[A-Z]{3}$');
        expect(check(event('code'), 'ABC')).toBe(true);
        expect(check(any('uuidField'), 'nope')).toBe('Uuid field must be a UUID');
        expect(check(any('uuidField'), '123e4567-e89b-12d3-a456-426614174000')).toBe(true);
        expect(check(any('durationField'), 'P1DT2H')).toBe(true);
        expect(check(any('durationField'), 'P')).toBe('Duration field must be an ISO 8601 duration, e.g. P1DT2H');
    });

    test('enum values, also for every item of an array', () => {
        expect(check(event('status'), 'GONE')).toBe('Status must be one of DRAFT, PUBLISHED');
        expect(check(any('rolesField'), ['ADMIN', 'ROOT'])).toBe('Roles field must be one of ADMIN, USER');
        expect(check(any('rolesField'), ['ADMIN'])).toBe(true);
    });

    test('dates must be valid', () => {
        expect(check(event('startDate'), '2026-02-30x')).toBe('Start date must be a valid date');
        expect(check(event('startDate'), '2026-02-03')).toBe(true);
    });

    test('messages can be overridden', () => {
        const rules = fieldRules(event('title'), { required: label => `Fill in ${label}` });
        expect(rules[0](null)).toBe('Fill in Title');
    });
});

describe('inputRules', () => {
    test('check what the control holds', () => {
        const [seats] = inputRules(event('seats'));
        expect(seats('abc')).toBe('Seats must be a number');
        expect(seats('0')).toBe('Seats must be at least 1');
        expect(seats('')).toBe(true);
        const [json] = inputRules(any('jsonField'));
        expect(json('{')).toBe('Json field must be valid JSON');
    });
});

describe('recordErrors', () => {
    test('compare fields with other fields and with values', () => {
        expect(recordErrors(eventJson as any, { startDate: '2026-11-02', endDate: '2026-11-01', seats: 13 })).toEqual([
            'End date must be at least Start date',
            'Seats must be different from 13',
        ]);
        expect(recordErrors(eventModel, { startDate: '2026-11-01', endDate: '2026-11-01', seats: 12 })).toEqual([]);
    });

    test('pass when a value is empty', () => {
        expect(recordErrors(eventModel, { startDate: '2026-11-02', endDate: null })).toEqual([]);
    });
});
