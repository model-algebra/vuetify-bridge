import { type ModelLike } from '../schema';
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
};
declare var __VLS_10: `item.${string}`, __VLS_11: {
    field: import("..").FieldLike;
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
}, __VLS_15: string, __VLS_16: any;
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_10>]?: (props: typeof __VLS_11) => any;
} & {
    [K in NonNullable<typeof __VLS_15>]?: (props: typeof __VLS_16) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
