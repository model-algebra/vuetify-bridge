<script setup lang="ts">
// Single-line input for text, numbers, dates and times, using the native input type of each
import { computed } from 'vue'
import { VTextField } from 'vuetify/components'
import { useFieldInput } from '../../composables/useFieldInput'
import type { FieldControlProps } from './types'

const props = defineProps<FieldControlProps>()
const value = defineModel<unknown>()

const { input, kind, label, hint, rules } = useFieldInput(() => props.field, value, () => props.messages)

const INPUT_TYPES: Record<string, string> = {
    integer: 'number',
    number: 'number',
    date: 'date',
    time: 'time',
    datetime: 'datetime-local',
}

const inputType = computed(() => INPUT_TYPES[kind.value] ?? 'text')

const step = computed(() => {
    switch (kind.value) {
        case 'integer': return 1
        case 'number': {
            const scale = props.field.type === 'DECIMAL' ? props.field.parameters?.scale : undefined
            return typeof scale === 'number' ? 10 ** -scale : 'any'
        }
        case 'time':
        case 'datetime': return 1
        default: return undefined
    }
})

const maxLength = computed(() =>
    props.field.type === 'STRING' && typeof props.field.parameters?.length === 'number'
        ? props.field.parameters.length
        : undefined)
</script>

<template>
    <VTextField
        v-model="input"
        :type="inputType"
        :step="step"
        :counter="maxLength"
        :label="label"
        :hint="hint"
        :rules="rules"
        :readonly="readonly"
    />
</template>
