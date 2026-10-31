import { filterOptions, sortOptions, type FilterOption, type Op, type SortOption } from "model-algebra-common";
import { fieldLabel, humanize, type FieldLike, type ModelLike } from "./field";
import { isEmpty } from "./convert";

/*
 * Sorting and filtering of lists of records, as the model declares them (sortable and filterable fields, sortings and
 * filters of the model). Sort keys and filter names are those of sortOptions() and filterOptions() of
 * model-algebra-common, the names APIs use: sort=lastName.caseless,-age; age.gte=18; adults=true.
 */

/** A key of the sort order of a table: a sort key, ascending or descending. */
export interface SortItem {
    key: string;
    order: 'asc' | 'desc';
}

/** Functions and predicates of the application that sort and filter definitions name. */
export interface ListFunctions {
    /** function(value, row) of fields, function(row) of sort orders of the model. */
    functions?: Record<string, (...args: any[]) => unknown>;
    /** predicate(value, row[, argument]) of fields, predicate(row[, argument]) of filters of the model. */
    predicates?: Record<string, (...args: any[]) => boolean>;
}

type Row = Record<string, unknown>;

const OP_SYMBOLS: Record<Op, string> = { '=': '=', '!=': '≠', '<': '<', '<=': '≤', '>': '>', '>=': '≥' };

/** A name as words after a colon: "Last name: caseless". */
const words = (name: string) => {
    const text = humanize(name);
    return text.charAt(0).toLowerCase() + text.slice(1);
};

/** Whether the model says how its records can be sorted or filtered. */
export function hasListOptions(model: ModelLike): boolean {
    return model.fields.some(field => field.sortable !== undefined || field.filterable !== undefined)
        || model.sortings !== undefined || model.filters !== undefined;
}

export const listSortOptions = (model: ModelLike): SortOption[] => sortOptions(model);
export const listFilterOptions = (model: ModelLike): FilterOption[] => filterOptions(model);

function field(model: ModelLike, name: string): FieldLike {
    return model.fields.find(f => f.name === name)!;
}

/** Label of a sort key: "Last name", "Last name: caseless", "By name". */
export function sortLabel(model: ModelLike, option: SortOption): string {
    if (option.field === undefined) return humanize(option.key);
    const label = fieldLabel(field(model, option.field));
    return option.definitionName === '' ? label : `${label}: ${words(option.definitionName!)}`;
}

/** Label of a filter: "Age ≥", "Last name: prefix", "Email: is blank", "Ends at ≥ Starts at", "Adults". */
export function filterLabel(model: ModelLike, option: FilterOption): string {
    if (option.scope === 'model') return humanize(option.name);
    const label = fieldLabel(field(model, option.field!));
    const named = option.definitionName !== '' ? `${label}: ${words(option.definitionName)}` : label;
    if (option.predicate !== undefined) return option.definitionName !== '' ? named : `${label}: ${words(option.predicate)}`;
    const op = option.op === '=' && option.input === 'value' ? '' : ` ${OP_SYMBOLS[option.op!]}`;
    if (option.input === 'value') return `${named}${op}`;
    if (option.definitionName !== '') return named;
    const other = option.otherField !== undefined ? fieldLabel(field(model, option.otherField)) : String(option.value);
    return `${label}${op} ${other}`;
}

/** The field of the control in which the user gives the value of a filter: of the field's type, or of the argument's. */
export function filterField(model: ModelLike, option: FilterOption): FieldLike {
    const type = option.valueType === 'field' || option.valueType === undefined ? field(model, option.field!) : option.valueType;
    return {
        name: option.name,
        label: filterLabel(model, option),
        type: type.type,
        ...(type.parameters !== undefined ? { parameters: type.parameters } : {}),
    };
}

/** Whether the filter is on: a switch set to true, or a value given. */
export function isFilterOn(option: FilterOption, value: unknown): boolean {
    return option.input === 'switch' ? value === true : !isEmpty(value);
}

function call<T>(registry: Record<string, (...args: any[]) => T> | undefined, name: string, what: string, args: unknown[]): T {
    const fn = registry?.[name];
    if (fn === undefined) throw new Error(`No ${what} ${name}: give it to the table in ${what === 'function' ? 'functions' : 'predicates'}`);
    return fn(...args);
}

const comparable = (value: unknown) => value instanceof Date ? value.getTime() : value;

/** As in SQL, comparisons with a missing value are false. */
function compare(left: unknown, op: Op, right: unknown): boolean {
    if (left === null || left === undefined || right === null || right === undefined) return false;
    const a = comparable(left) as any;
    const b = comparable(right) as any;
    switch (op) {
        case '=': return a === b;
        case '!=': return a !== b;
        case '<': return a < b;
        case '<=': return a <= b;
        case '>': return a > b;
        case '>=': return a >= b;
    }
}

function keeps(option: FilterOption, row: Row, value: unknown, fns: ListFunctions): boolean {
    const argument = option.input === 'value' ? [value] : [];
    if (option.predicate !== undefined) {
        const args = option.scope === 'field' ? [row[option.field!], row, ...argument] : [row, ...argument];
        return call(fns.predicates, option.predicate, 'predicate', args) === true;
    }
    const own = row[option.field!];
    const subject = option.function !== undefined ? call(fns.functions, option.function, 'function', [own, row]) : own;
    const other = option.input === 'value' ? value : option.otherField !== undefined ? row[option.otherField] : option.value;
    return compare(subject, option.op!, other);
}

/** The rows the filters that are on keep. */
export function filterRows<T extends Row>(model: ModelLike, rows: T[], filters: Record<string, unknown>, fns: ListFunctions = {}): T[] {
    const on = listFilterOptions(model).filter(option => isFilterOn(option, filters[option.name]));
    return on.length === 0 ? rows : rows.filter(row => on.every(option => keeps(option, row, filters[option.name], fns)));
}

/**
 * Ordering of two sort values in the direction (1 ascending, -1 descending). Missing values go last unless nulls says
 * first, in either direction.
 */
function compareValues(a: unknown, b: unknown, direction: number, nulls: 'first' | 'last' = 'last'): number {
    const aMissing = a === null || a === undefined;
    const bMissing = b === null || b === undefined;
    if (aMissing || bMissing) return aMissing === bMissing ? 0 : (aMissing === (nulls === 'first') ? -1 : 1);
    const x = comparable(a) as any;
    const y = comparable(b) as any;
    const order = typeof x === 'string' && typeof y === 'string' ? x.localeCompare(y) : x < y ? -1 : x > y ? 1 : 0;
    return order * direction;
}

/** The option of a sort key: by its key, or by the name of the field whose column was sorted. */
export function sortOptionOf(model: ModelLike, key: string): SortOption | undefined {
    const options = listSortOptions(model);
    return options.find(option => option.key === key) ?? options.find(option => option.field === key);
}

/** The rows in the sort order. */
export function sortRows<T extends Row>(model: ModelLike, rows: T[], sort: SortItem[], fns: ListFunctions = {}): T[] {
    const comparators = sort.map(item => {
        const option = sortOptionOf(model, item.key);
        if (option === undefined) throw new Error(`Model ${model.metadata.name} can't be sorted by ${item.key}`);
        const sign = item.order === 'desc' ? -1 : 1;
        if (option.sortKeys !== undefined) {
            const keys = option.sortKeys.map(key => ({
                value: (row: Row) => key.field === undefined
                    ? call(fns.functions, key.function!, 'function', [row])
                    : key.function !== undefined ? call(fns.functions, key.function, 'function', [row[key.field], row]) : row[key.field],
                sign: key.direction === 'desc' ? -1 : 1,
                nulls: key.nulls,
            }));
            return (a: Row, b: Row) => {
                for (const key of keys) {
                    const result = compareValues(key.value(a), key.value(b), key.sign * sign, key.nulls);
                    if (result !== 0) return result;
                }
                return 0;
            };
        }
        const { field: name, definition } = option;
        const value = (row: Row) => definition!.function !== undefined
            ? call(fns.functions, definition!.function, 'function', [row[name!], row])
            : row[name!];
        return (a: Row, b: Row) => compareValues(value(a), value(b), sign, definition!.nulls);
    });
    if (comparators.length === 0) return rows;
    return [...rows].sort((a, b) => {
        for (const comparator of comparators) {
            const result = comparator(a, b);
            if (result !== 0) return result;
        }
        return 0;
    });
}

/** Sort keys of an API: the key, - first for descending order; a sorted column stands for the first key of its field. */
export function sortParameter(model: ModelLike, sort: SortItem[]): string[] {
    return sort.map(item => {
        const option = sortOptionOf(model, item.key);
        if (option === undefined) throw new Error(`Model ${model.metadata.name} can't be sorted by ${item.key}`);
        return item.order === 'desc' ? `-${option.key}` : option.key;
    });
}

/**
 * Query parameters of a list request: limit and offset of the page, sort, and the filters that are on, as
 * openapi-bridge-typescript describes them.
 */
export function listQuery(
    model: ModelLike,
    state: { sort: SortItem[], filters: Record<string, unknown>, page: number, itemsPerPage: number },
): Record<string, unknown> {
    const query: Record<string, unknown> = {};
    if (state.itemsPerPage > 0) {
        query.limit = state.itemsPerPage;
        query.offset = (state.page - 1) * state.itemsPerPage;
    }
    const sort = sortParameter(model, state.sort);
    if (sort.length > 0) query.sort = sort.join(',');
    for (const option of listFilterOptions(model))
        if (isFilterOn(option, state.filters[option.name])) query[option.name] = state.filters[option.name];
    return query;
}
