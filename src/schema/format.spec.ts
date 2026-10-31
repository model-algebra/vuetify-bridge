import { allTypesJson, field } from "../test/models";
import { formatValue } from "./format";

const f = (name: string) => field(allTypesJson, name);

describe('formatValue', () => {
    test('empty values are empty text', () => {
        expect(formatValue(f('int32Field'), null)).toBe('');
        expect(formatValue(f('stringField'), undefined)).toBe('');
    });

    test('numbers use the locale; decimals keep their scale', () => {
        expect(formatValue(f('int64Field'), 1234567, 'en-US')).toBe('1,234,567');
        expect(formatValue(f('decimalField'), 3.5, 'en-US')).toBe('3.50');
        expect(formatValue(f('float64Field'), 0.125, 'de-DE')).toBe('0,125');
    });

    test('dates use the locale; plain dates are not shifted by the time zone', () => {
        expect(formatValue(f('dateField'), '2026-10-31', 'en-US')).toBe('10/31/2026');
        expect(formatValue(f('datetimeField'), '2026-10-31T13:45:00', 'en-US')).toMatch(/^10\/31\/2026,\s1:45:00\sPM$/u);
        expect(formatValue(f('dateField'), 'not a date')).toBe('not a date');
    });

    test('booleans, arrays, JSON and bytes', () => {
        expect(formatValue(f('booleanField'), false)).toBe('No');
        expect(formatValue(f('tagsField'), ['a', 'b'])).toBe('a, b');
        expect(formatValue(f('jsonField'), { a: 1 })).toBe('{"a":1}');
        expect(formatValue(f('jsonField'), { text: 'x'.repeat(100) })).toHaveLength(60);
        expect(formatValue(f('bytesField'), new Uint8Array(3))).toBe('3 bytes');
    });
});
