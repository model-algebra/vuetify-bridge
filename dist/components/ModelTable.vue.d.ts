import { type ListFunctions, type ModelLike, type SortItem } from '../schema';
type __VLS_Props = {
    model: ModelLike;
    items: Record<string, unknown>[];
    /** Names of the fields to show as columns, in this order; all fields of the model by default. */
    fields?: string[];
    exclude?: string[];
    /** Field identifying a row; the primary key of the model by default. */
    itemKey?: string;
    /** Locale for numbers and dates; the browser locale by default. */
    locale?: string;
    /** Total number of records when paging, sorting and filtering are done by the server; switches to VDataTableServer. */
    itemsLength?: number;
    /** Functions sort and filter definitions name: function(value, row) of fields, function(row) of sort orders. */
    functions?: ListFunctions['functions'];
    /** Predicates filter definitions name: predicate(value, row[, argument]) of fields, predicate(row[, argument]). */
    predicates?: ListFunctions['predicates'];
    /** Show controls for filters and sort orders above the table, when the model has any (default: true). */
    filterBar?: boolean;
};
type __VLS_ModelProps = {
    /** Values of the filters that are on, by filter name, e.g. { 'age.gte': 18, adults: true }. */
    'filters'?: Record<string, unknown>;
    /** Sort order: sort keys of the model, or names of the fields whose columns are sorted. */
    'sort'?: SortItem[];
    'page'?: number;
    'itemsPerPage'?: number;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare var __VLS_14: `item.${string}`, __VLS_15: {
    field: import("../schema").FieldLike;
    formatted: string;
    index: number;
    item: Record<string, unknown>;
    internalItem: import("vuetify/lib/components/VDataTable/types.mjs").DataTableItem<Record<string, unknown>>;
    isExpanded: ReturnType<typeof import("vuetify/lib/components/VDataTable/composables/expand.mjs").provideExpanded>["isExpanded"];
    toggleExpand: ReturnType<typeof import("vuetify/lib/components/VDataTable/composables/expand.mjs").provideExpanded>["toggleExpand"];
    isSelected: ReturnType<typeof import("vuetify/lib/components/VDataTable/composables/select.mjs").provideSelection>["isSelected"];
    toggleSelect: ReturnType<typeof import("vuetify/lib/components/VDataTable/composables/select.mjs").provideSelection>["toggleSelect"];
    value: any;
    column: import("vuetify/lib/components/VDataTable/types.mjs").InternalDataTableHeader;
}, __VLS_19: string, __VLS_20: any;
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_14>]?: (props: typeof __VLS_15) => any;
} & {
    [K in NonNullable<typeof __VLS_19>]?: (props: typeof __VLS_20) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:filters": (value: Record<string, unknown>) => any;
    "update:sort": (value: SortItem[]) => any;
    "update:query": (query: Record<string, unknown>) => any;
    "update:page": (value: number) => any;
    "update:itemsPerPage": (value: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:filters"?: ((value: Record<string, unknown>) => any) | undefined;
    "onUpdate:sort"?: ((value: SortItem[]) => any) | undefined;
    "onUpdate:query"?: ((query: Record<string, unknown>) => any) | undefined;
    "onUpdate:page"?: ((value: number) => any) | undefined;
    "onUpdate:itemsPerPage"?: ((value: number) => any) | undefined;
}>, {
    filterBar: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
