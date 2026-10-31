import type { FilterOption, SortOption } from 'model-algebra-common';
import { type ModelLike, type SortItem } from '../schema';
type __VLS_Props = {
    model: ModelLike;
    filterOptions: FilterOption[];
    /** Sort orders to choose from, besides sorting by columns. */
    sortOptions: SortOption[];
};
type __VLS_ModelProps = {
    'filters': Record<string, unknown>;
    'sort': SortItem[];
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare const __VLS_export: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:filters": (value: Record<string, unknown>) => any;
    "update:sort": (value: SortItem[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:filters"?: ((value: Record<string, unknown>) => any) | undefined;
    "onUpdate:sort"?: ((value: SortItem[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
