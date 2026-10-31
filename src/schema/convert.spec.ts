import { allTypesJson, field } from "../test/models";
import { fromInput, toInput } from "./convert";

const f = (name: string) => field(allTypesJson, name);

describe('toInput', () => {
    test('empty values become an empty input, or null and [] for selects', () => {
        expect(toInput(f('int32Field'), null)).toBe('');
        expect(toInput(f('stringField'), undefined)).toBe('');
        expect(toInput(f('enumField'), undefined)).toBeNull();
        expect(toInput(f('tagsField'), null)).toEqual([]);
    });

    test('numbers become text', () => {
        expect(toInput(f('decimalField'), 12.5)).toBe('12.5');
    });

    test('dates become values of native date and time inputs', () => {
        const date = new Date(2026, 9, 31, 13, 45, 7);
        expect(toInput(f('dateField'), '2026-10-31')).toBe('2026-10-31');
        expect(toInput(f('dateField'), date)).toBe('2026-10-31');
        expect(toInput(f('timeField'), date)).toBe('13:45:07');
        expect(toInput(f('datetimeField'), '2026-10-31 13:45:07.123')).toBe('2026-10-31T13:45:07');
        expect(toInput(f('timestampTzField'), date.toISOString())).toBe('2026-10-31T13:45:07');
    });

    test('JSON values become formatted text', () => {
        expect(toInput(f('jsonField'), { a: 1 })).toBe('{\n  "a": 1\n}');
    });
});

describe('fromInput', () => {
    test('empty input is null, empty multiple selection is []', () => {
        expect(fromInput(f('int32Field'), '')).toEqual({ ok: true, value: null });
        expect(fromInput(f('rolesField'), null)).toEqual({ ok: true, value: [] });
    });

    test('numbers are parsed', () => {
        expect(fromInput(f('float64Field'), ' 1.25 ')).toEqual({ ok: true, value: 1.25 });
        expect(fromInput(f('int32Field'), 'abc')).toEqual({ ok: false, error: 'number' });
    });

    test('TIMESTAMP_TZ becomes a UTC instant, other dates stay as entered', () => {
        const local = new Date(2026, 9, 31, 13, 45, 7);
        expect(fromInput(f('timestampTzField'), '2026-10-31T13:45:07')).toEqual({ ok: true, value: local.toISOString() });
        expect(fromInput(f('datetimeField'), '2026-10-31T13:45')).toEqual({ ok: true, value: '2026-10-31T13:45' });
        expect(fromInput(f('dateField'), '2026-10-31')).toEqual({ ok: true, value: '2026-10-31' });
    });

    test('JSON is parsed', () => {
        expect(fromInput(f('jsonField'), '{"a": [1]}')).toEqual({ ok: true, value: { a: [1] } });
        expect(fromInput(f('jsonField'), '{a}')).toEqual({ ok: false, error: 'json' });
    });

    test('round-trips through toInput', () => {
        for (const [name, value] of [['int64Field', 42], ['stringField', 'x'], ['booleanField', true], ['enumField', 'ACTIVE'], ['jsonField', [1, { b: null }]]] as const)
            expect(fromInput(f(name), toInput(f(name), value))).toEqual({ ok: true, value });
    });
});
