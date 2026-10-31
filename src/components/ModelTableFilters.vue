<script setup lang="ts">
// Controls for the filters of a model's records, and a choice of the sort orders that are not columns of the table
import { computed } from 'vue'
import type { FilterOption, SortOption } from 'model-algebra-common'
import { VBtn, VCheckbox, VSelect } from 'vuetify/components'
import ModelField from './fields/ModelField.vue'
import { filterField, filterLabel, isFilterOn, sortLabel, type ModelLike, type SortItem } from '../schema'

const props = defineProps<{
    model: ModelLike
    filterOptions: FilterOption[]
    /** Sort orders to choose from, besides sorting by columns. */
    sortOptions: SortOption[]
}>()

const filters = defineModel<Record<string, unknown>>('filters', { required: true })
const sort = defineModel<SortItem[]>('sort', { required: true })

const valueOptions = computed(() => props.filterOptions.filter(option => option.input === 'value'))
const switchOptions = computed(() => props.filterOptions.filter(option => option.input === 'switch'))
const anyOn = computed(() => props.filterOptions.some(option => isFilterOn(option, filters.value[option.name])))

function set(name: string, value: unknown) {
    const next = { ...filters.value }
    if (value === undefined || value === null || value === '' || value === false) delete next[name]
    else next[name] = value
    filters.value = next
}

// The chosen sort order, if the table is sorted by one of these
const chosen = computed(() => props.sortOptions.find(option => option.key === sort.value[0]?.key))
const sortItems = computed(() => props.sortOptions.map(option => ({ title: sortLabel(props.model, option), value: option.key })))

function choose(key: string | null) {
    const option = props.sortOptions.find(o => o.key === key)
    sort.value = option !== undefined ? [{ key: option.key, order: option.directions[0] }] : []
}

function reverse() {
    const [first, ...rest] = sort.value
    sort.value = [{ key: first.key, order: first.order === 'asc' ? 'desc' : 'asc' }, ...rest]
}
</script>

<template>
    <div class="model-table-filters d-flex flex-wrap align-center ga-3">
        <ModelField
            v-for="option in valueOptions"
            :key="option.name"
            :field="filterField(model, option)"
            :model-value="filters[option.name] ?? null"
            class="model-table-filter"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            @update:model-value="set(option.name, $event)"
        />
        <VCheckbox
            v-for="option in switchOptions"
            :key="option.name"
            :label="filterLabel(model, option)"
            :model-value="filters[option.name] === true"
            class="flex-grow-0"
            density="compact"
            hide-details
            @update:model-value="set(option.name, $event === true)"
        />
        <div v-if="sortOptions.length > 0" class="d-flex align-center">
            <VSelect
                :model-value="chosen?.key ?? null"
                :items="sortItems"
                label="Sort by"
                class="model-table-filter"
                density="compact"
                variant="outlined"
                hide-details
                clearable
                @update:model-value="choose"
            />
            <VBtn
                v-if="chosen !== undefined && chosen.directions.length > 1"
                :icon="sort[0].order === 'asc' ? '$sortAsc' : '$sortDesc'"
                :aria-label="sort[0].order === 'asc' ? 'Ascending' : 'Descending'"
                variant="text"
                size="small"
                @click="reverse"
            />
        </div>
        <VBtn v-if="anyOn" variant="text" size="small" @click="filters = {}">Clear filters</VBtn>
    </div>
</template>

<style scoped>
.model-table-filter {
    flex: 0 1 220px;
    min-width: 160px;
}
</style>
