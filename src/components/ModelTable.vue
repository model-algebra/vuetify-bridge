<script setup lang="ts">
// Data table of records of the model: a column per field with values formatted by field type
import { computed, useSlots } from 'vue'
import { VDataTable, VDataTableServer } from 'vuetify/components'
import { fieldKind, fieldLabel, formatValue, primaryKeyField, selectFields, type ModelLike } from '../schema'

const props = defineProps<{
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
}>()

const slots = useSlots()

const NUMERIC_KINDS = new Set(['integer', 'number'])
const UNSORTABLE_KINDS = new Set(['json', 'object', 'objectList', 'tags', 'multiEnum', 'unsupported'])

const columns = computed(() => selectFields(props.model, props.fields, props.exclude))

const headers = computed(() => columns.value.map(field => {
    const kind = fieldKind(field)
    return {
        title: fieldLabel(field),
        key: field.name,
        align: NUMERIC_KINDS.has(kind) ? 'end' as const : 'start' as const,
        sortable: !UNSORTABLE_KINDS.has(kind),
    }
}))

const itemValue = computed(() => props.itemKey ?? primaryKeyField(props.model) ?? 'id')

// Slots of the data table that are not cells of model fields are passed on as they are
const cellSlots = computed(() => new Set(columns.value.map(field => `item.${field.name}`)))
const otherSlots = computed(() => Object.keys(slots).filter(name => !cellSlots.value.has(name)))
</script>

<template>
    <component
        :is="itemsLength === undefined ? VDataTable : VDataTableServer"
        :headers="headers"
        :items="items"
        :item-value="itemValue"
        :items-length="itemsLength"
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
</template>
