import { type FilterOption, type SortOption } from "model-algebra-common";
import { type FieldLike, type ModelLike } from "./field";
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
/** Whether the model says how its records can be sorted or filtered. */
export declare function hasListOptions(model: ModelLike): boolean;
export declare const listSortOptions: (model: ModelLike) => SortOption[];
export declare const listFilterOptions: (model: ModelLike) => FilterOption[];
/** Label of a sort key: "Last name", "Last name: caseless", "By name". */
export declare function sortLabel(model: ModelLike, option: SortOption): string;
/** Label of a filter: "Age ≥", "Last name: prefix", "Email: is blank", "Ends at ≥ Starts at", "Adults". */
export declare function filterLabel(model: ModelLike, option: FilterOption): string;
/** The field of the control in which the user gives the value of a filter: of the field's type, or of the argument's. */
export declare function filterField(model: ModelLike, option: FilterOption): FieldLike;
/** Whether the filter is on: a switch set to true, or a value given. */
export declare function isFilterOn(option: FilterOption, value: unknown): boolean;
/** The rows the filters that are on keep. */
export declare function filterRows<T extends Row>(model: ModelLike, rows: T[], filters: Record<string, unknown>, fns?: ListFunctions): T[];
/** The option of a sort key: by its key, or by the name of the field whose column was sorted. */
export declare function sortOptionOf(model: ModelLike, key: string): SortOption | undefined;
/** The rows in the sort order. */
export declare function sortRows<T extends Row>(model: ModelLike, rows: T[], sort: SortItem[], fns?: ListFunctions): T[];
/** Sort keys of an API: the key, - first for descending order; a sorted column stands for the first key of its field. */
export declare function sortParameter(model: ModelLike, sort: SortItem[]): string[];
/**
 * Query parameters of a list request: limit and offset of the page, sort, and the filters that are on, as
 * openapi-bridge-typescript describes them.
 */
export declare function listQuery(model: ModelLike, state: {
    sort: SortItem[];
    filters: Record<string, unknown>;
    page: number;
    itemsPerPage: number;
}): Record<string, unknown>;
export {};
