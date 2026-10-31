import {
    filterField, filterLabel, filterRows, hasListOptions, isFilterOn, listFilterOptions, listQuery, listSortOptions,
    sortLabel, sortParameter, sortRows,
} from "./list";
import type { ModelLike } from "./field";

const person: ModelLike = {
    metadata: { name: 'Person' },
    fields: [
        { name: 'lastName', type: 'STRING', parameters: { length: 50 }, sortable: { plain: {}, caseless: { function: 'lower' } },
          filterable: { equals: { op: '=' }, prefix: { predicate: 'startsWith', argument: true } } },
        { name: 'age', type: 'INT16', sortable: { direction: 'desc', nulls: 'first' }, filterable: { ops: ['>=', '<='] } },
        { name: 'status', type: 'ENUM', parameters: { values: ['ACTIVE', 'BLOCKED'] }, filterable: { active: { op: '=', value: 'ACTIVE' } } },
        { name: 'email', type: 'TEXT', filterable: { predicate: 'isBlank' } },
        { name: 'endsAt', type: 'DATE', filterable: { op: '>=', otherField: 'startsAt' } },
        { name: 'startsAt', type: 'DATE' },
    ],
    sortings: { byAgeName: [{ field: 'age' }, { field: 'lastName', direction: 'desc' }], score: [{ function: 'scoreOf' }] },
    filters: { adults: { field: 'age', op: '>=', value: 18 }, verified: { predicate: 'isVerified' }, older: { predicate: 'olderThan', argument: { type: 'INT32' } } },
};

const rows = [
    { lastName: 'smith', age: 30, status: 'ACTIVE', email: '', endsAt: '2026-01-02', startsAt: '2026-01-01', verified: true },
    { lastName: 'Adams', age: 12, status: 'BLOCKED', email: 'a@b.c', endsAt: '2026-01-01', startsAt: '2026-01-05', verified: false },
    { lastName: 'Brown', age: null, status: 'ACTIVE', email: 'x@y.z', endsAt: null, startsAt: '2026-01-01', verified: true },
    { lastName: 'adams', age: 45, status: 'ACTIVE', email: '', endsAt: '2026-02-01', startsAt: '2026-01-01', verified: false },
];

const fns = {
    functions: { lower: (v: unknown) => String(v).toLowerCase(), scoreOf: (row: any) => row.age ?? 0 },
    predicates: {
        startsWith: (v: unknown, _row: unknown, arg: unknown) => String(v).startsWith(String(arg)),
        isBlank: (v: unknown) => v === '' || v == null,
        isVerified: (row: any) => row.verified,
        olderThan: (row: any, years: number) => row.age > years,
    },
};

const names = (list: any[]) => list.map(r => r.lastName);

describe('labels', () => {
    it('of sort keys', () => {
        expect(listSortOptions(person).map(o => sortLabel(person, o))).toEqual(['Last name: plain', 'Last name: caseless', 'Age', 'By age name', 'Score']);
    });

    it('of filters', () => {
        expect(listFilterOptions(person).map(o => filterLabel(person, o))).toEqual([
            'Last name: equals', 'Last name: prefix', 'Age ≥', 'Age ≤', 'Status: active', 'Email: is blank', 'Ends at ≥ Starts at',
            'Adults', 'Verified', 'Older',
        ]);
    });

    it('come from the label of the field when it has one', () => {
        const model: ModelLike = { metadata: { name: 'A' }, fields: [{ name: 'a', type: 'INT32', label: 'Amount', sortable: true, filterable: { op: '<' } }] };
        expect(sortLabel(model, listSortOptions(model)[0])).toBe('Amount');
        expect(filterLabel(model, listFilterOptions(model)[0])).toBe('Amount <');
    });
});

describe('filter fields', () => {
    it('have the type of the field or of the argument', () => {
        const options = Object.fromEntries(listFilterOptions(person).map(o => [o.name, o]));
        expect(filterField(person, options['age.gte'])).toEqual({ name: 'age.gte', label: 'Age ≥', type: 'INT16' });
        expect(filterField(person, options['lastName.prefix'])).toEqual({ name: 'lastName.prefix', label: 'Last name: prefix', type: 'STRING', parameters: { length: 50 } });
        expect(filterField(person, options.older)).toEqual({ name: 'older', label: 'Older', type: 'INT32' });
    });

    it('are on when switched on or given a value', () => {
        const [equals] = listFilterOptions(person);
        const active = listFilterOptions(person).find(o => o.name === 'status.active')!;
        expect([isFilterOn(equals, ''), isFilterOn(equals, null), isFilterOn(equals, 'x'), isFilterOn(equals, 0)]).toEqual([false, false, true, true]);
        expect([isFilterOn(active, true), isFilterOn(active, false), isFilterOn(active, undefined)]).toEqual([true, false, false]);
    });
});

describe('filterRows', () => {
    it.each([
        ['nothing', {}, ['smith', 'Adams', 'Brown', 'adams']],
        ['a value', { 'lastName.equals': 'Brown' }, ['Brown']],
        ['a predicate with an argument', { 'lastName.prefix': 'a' }, ['adams']],
        ['operators', { 'age.gte': 12, 'age.lte': 30 }, ['smith', 'Adams']],
        ['a fixed value', { 'status.active': true }, ['smith', 'Brown', 'adams']],
        ['a switch that is off', { 'status.active': false }, ['smith', 'Adams', 'Brown', 'adams']],
        ['a predicate', { email: true }, ['smith', 'adams']],
        ['another field', { endsAt: true }, ['smith', 'adams']],
        ['a rule of the model', { adults: true }, ['smith', 'adams']],
        ['a predicate of the model', { verified: true }, ['smith', 'Brown']],
        ['a predicate of the model with an argument', { older: 40 }, ['adams']],
        ['several', { 'status.active': true, adults: true, verified: true }, ['smith']],
    ])('by %s', (_, filters, expected) => {
        expect(names(filterRows(person, rows, filters, fns))).toEqual(expected);
    });

    it('needs the functions and predicates the definitions name', () => {
        expect(() => filterRows(person, rows, { email: true })).toThrow('No predicate isBlank: give it to the table in predicates');
    });
});

describe('sortRows', () => {
    it.each([
        ['a field, sorted column', [{ key: 'lastName', order: 'asc' }], ['adams', 'Adams', 'Brown', 'smith']],
        ['a function', [{ key: 'lastName.caseless', order: 'desc' }], ['smith', 'Brown', 'Adams', 'adams']],
        ['missing values first', [{ key: 'age', order: 'desc' }], ['Brown', 'adams', 'smith', 'Adams']],
        ['a sort order of the model', [{ key: 'byAgeName', order: 'asc' }], ['Adams', 'smith', 'adams', 'Brown']],
        ['a sort order of the model, reversed: missing values stay last', [{ key: 'byAgeName', order: 'desc' }], ['adams', 'smith', 'Adams', 'Brown']],
        ['a function of the row', [{ key: 'score', order: 'asc' }], ['Brown', 'Adams', 'smith', 'adams']],
    ] as const)('by %s', (_, sort, expected) => {
        expect(names(sortRows(person, rows, [...sort], fns))).toEqual(expected);
    });

    it('rejects keys the model does not sort by', () => {
        expect(() => sortRows(person, rows, [{ key: 'status', order: 'asc' }])).toThrow("Model Person can't be sorted by status");
    });
});

describe('query parameters', () => {
    it('name the sort keys and the filters that are on as APIs do', () => {
        expect(sortParameter(person, [{ key: 'lastName', order: 'asc' }, { key: 'age', order: 'desc' }])).toEqual(['lastName.plain', '-age']);
        expect(listQuery(person, {
            sort: [{ key: 'lastName.caseless', order: 'desc' }, { key: 'byAgeName', order: 'asc' }],
            filters: { 'age.gte': 18, 'status.active': true, email: false, 'lastName.equals': '' },
            page: 3, itemsPerPage: 10,
        })).toEqual({ limit: 10, offset: 20, sort: '-lastName.caseless,byAgeName', 'age.gte': 18, 'status.active': true });
        expect(listQuery(person, { sort: [], filters: {}, page: 1, itemsPerPage: -1 })).toEqual({});
    });

    it('reject keys the model does not sort by', () => {
        expect(() => sortParameter(person, [{ key: 'email', order: 'asc' }])).toThrow("Model Person can't be sorted by email");
    });
});

describe('hasListOptions', () => {
    it('tells whether the model declares sorting or filtering', () => {
        expect(hasListOptions(person)).toBe(true);
        expect(hasListOptions({ metadata: { name: 'A' }, fields: [{ name: 'a', type: 'TEXT' }] })).toBe(false);
        expect(hasListOptions({ metadata: { name: 'A' }, fields: [], filters: {} })).toBe(true);
    });
});
