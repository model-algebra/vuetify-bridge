<script setup lang="ts">
// Multi-line input for TEXT fields, and for JSON values until nested forms are implemented
import { VTextarea } from 'vuetify/components'
import { useFieldInput } from '../../composables/useFieldInput'
import type { FieldControlProps } from './types'

const props = defineProps<FieldControlProps>()
const value = defineModel<unknown>()

const { input, kind, label, hint, rules } = useFieldInput(() => props.field, value, () => props.messages)
</script>

<template>
    <VTextarea
        v-model="input"
        :class="{ 'model-json-field': kind !== 'longText' }"
        :label="label"
        :hint="hint"
        :rules="rules"
        :readonly="readonly"
        auto-grow
        rows="3"
    />
</template>

<style scoped>
.model-json-field :deep(textarea) {
    font-family: monospace;
}
</style>
