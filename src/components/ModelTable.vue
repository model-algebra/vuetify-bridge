<script setup lang="ts">
// Data table of records of the model: a column per field with values formatted by field type, sorted and filtered
// as the model declares
import { computed, useSlots, watch } from 'vue'
import { VDataTable, VDataTableServer } from 'vuetify/components'
import ModelTableFilters from './ModelTableFilters.vue'
import {
    fieldKind, fieldLabel, filterRows, formatValue, hasListOptions, listFilterOptions, listQuery, listSortOptions,
    primaryKeyField, selectFields, sortOptionOf, sortRows, type ListFunctions, type ModelLike, type SortItem,
} from '../schema'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
    model: ModelLike
    items: Record<string, unknown>[]
    /** Names of the fields to show as columns, in this order; all fields of the model by default. */
    fields?: string[]
    exclude?: string[]
    /** Field identifying a row; the primary key of the model by default. */
    itemKey?: string
    /** Locale for numbers and dates; the browser locale by default. */
    locale?: string
    /** Total number of records when paging, sorting and filtering are done by the server; switches to VDataTableServer. */
    itemsLength?: number
    /** Functions sort and filter definitions name: function(value, row) of fields, function(row) of sort orders. */
    functions?: ListFunctions['functions']
    /** Predicates filter definitions name: predicate(value, row[, argument]) of fields, predicate(row[, argument]). */
    predicates?: ListFunctions['predicates']
    /** Show controls for filters and sort orders above the table, when the model has any (default: true). */
    filterBar?: boolean
}>(), {
    filterBar: true,
})

/** Values of the filters that are on, by filter name, e.g. { 'age.gte': 18, adults: true }. */
const filters = defineModel<Record<string, unknown>>('filters', { default: () => ({}) })
/** Sort order: sort keys of the model, or names of the fields whose columns are sorted. */
const sort = defineModel<SortItem[]>('sort', { default: () => [] })
const page = defineModel<number>('page', { default: 1 })
const itemsPerPage = defineModel<number>('itemsPerPage', { default: 10 })

const emit = defineEmits<{
    /** With items-length, whenever the page, sort order or filters change: the query parameters of the API request. */
    'update:query': [query: Record<string, unknown>]
}>()

const slots = useSlots()

const NUMERIC_KINDS = new Set(['integer', 'number'])
const UNSORTABLE_KINDS = new Set(['json', 'object', 'objectList', 'tags', 'multiEnum', 'unsupported'])

const columns = computed(() => selectFields(props.model, props.fields, props.exclude))

// Models that declare sorting or filtering are sorted and filtered as declared; others as before, by Vuetify
const queryMode = computed(() => hasListOptions(props.model))
const serverMode = computed(() => props.itemsLength !== undefined)
const sortOptions = computed(() => queryMode.value ? listSortOptions(props.model) : [])
const filterOptions = computed(() => queryMode.value ? listFilterOptions(props.model) : [])
const sortableFields = computed(() => new Set(sortOptions.value.map(option => option.field).filter(Boolean)))
const columnNames = computed(() => new Set(columns.value.map(field => field.name)))

/** Sort orders a column can't give: of the model, named definitions after a field's first, fields without columns. */
const extraSortOptions = computed(() => sortOptions.value.filter((option, i) =>
    option.field === undefined || !columnNames.value.has(option.field)
    || sortOptions.value.findIndex(o => o.field === option.field) !== i))

const headers = computed(() => columns.value.map(field => {
    const kind = fieldKind(field)
    return {
        title: fieldLabel(field),
        key: field.name,
        align: NUMERIC_KINDS.has(kind) ? 'end' as const : 'start' as const,
        sortable: queryMode.value ? sortableFields.value.has(field.name) : !UNSORTABLE_KINDS.has(kind),
    }
}))

/** The table's sort order, in directions the sort keys allow. */
const sortBy = computed({
    get: () => sort.value,
    set: (items: SortItem[]) => {
        sort.value = items.map(item => {
            const directions = sortOptionOf(props.model, item.key)?.directions ?? ['asc', 'desc']
            return directions.includes(item.order) ? item : { key: item.key, order: directions[0] }
        })
    },
})

const functions = computed<ListFunctions>(() => ({ functions: props.functions, predicates: props.predicates }))
const filtered = computed(() => filterRows(props.model, props.items, filters.value, functions.value))
const sorted = computed(() => sortRows(props.model, filtered.value, sort.value, functions.value))
const pageItems = computed(() => itemsPerPage.value <= 0
    ? sorted.value
    : sorted.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value))

const shownItems = computed(() => !queryMode.value || serverMode.value ? props.items : pageItems.value)
const shownLength = computed(() => queryMode.value && !serverMode.value ? filtered.value.length : props.itemsLength)

// Other filters give other pages
watch(filters, () => { page.value = 1 }, { deep: true })

watch([queryMode, serverMode, sort, filters, page, itemsPerPage], () => {
    if (queryMode.value && serverMode.value)
        emit('update:query', listQuery(props.model, { sort: sort.value, filters: filters.value, page: page.value, itemsPerPage: itemsPerPage.value }))
}, { immediate: true, deep: true })

const itemValue = computed(() => props.itemKey ?? primaryKeyField(props.model) ?? 'id')

// Slots of the data table that are not cells of model fields are passed on as they are
const cellSlots = computed(() => new Set(columns.value.map(field => `item.${field.name}`)))
const otherSlots = computed(() => Object.keys(slots).filter(name => !cellSlots.value.has(name)))
</script>

<template>
    <div class="model-table">
        <ModelTableFilters
            v-if="queryMode && filterBar && (filterOptions.length > 0 || extraSortOptions.length > 0)"
            v-model:filters="filters"
            v-model:sort="sort"
            :model="model"
            :filter-options="filterOptions"
            :sort-options="extraSortOptions"
            class="mb-2"
        />
        <component
            :is="queryMode || itemsLength !== undefined ? VDataTableServer : VDataTable"
            v-bind="$attrs"
            v-model:page="page"
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="shownItems"
            :item-value="itemValue"
            :items-length="shownLength"
            v-on="queryMode ? { 'update:sortBy': (items: SortItem[]) => { sortBy = items } } : {}"
            :sort-by="queryMode ? sortBy : undefined"
        >
            <template v-for="field in columns" :key="field.name" #[`item.${field.name}`]="cell">
                <slot :name="`item.${field.name}`" v-bind="cell" :field="field" :formatted="formatValue(field, cell.value, locale)">
                    {{ formatValue(field, cell.value, locale) }}
                </slot>
            </template>
            <template v-for="name in otherSlots" :key="name" #[name]="slotProps">
                <slot :name="name" v-bind="slotProps ?? {}" />
            </template>
        </component>
    </div>
</template>
