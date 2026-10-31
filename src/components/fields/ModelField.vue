<script setup lang="ts">
// Control for a model field, chosen by the kind of the field
import { computed, type Component } from 'vue'
import { VTextField } from 'vuetify/components'
import { fieldKind, fieldLabel, formatValue, type FieldKind } from '../../schema'
import ModelBooleanField from './ModelBooleanField.vue'
import ModelSelectField from './ModelSelectField.vue'
import ModelTextField from './ModelTextField.vue'
import ModelTextareaField from './ModelTextareaField.vue'
import type { FieldControlProps } from './types'

const props = defineProps<FieldControlProps>()
const value = defineModel<unknown>()

const CONTROLS: Record<Exclude<FieldKind, 'unsupported'>, Component> = {
    integer: ModelTextField,
    number: ModelTextField,
    text: ModelTextField,
    date: ModelTextField,
    time: ModelTextField,
    datetime: ModelTextField,
    longText: ModelTextareaField,
    json: ModelTextareaField,
    boolean: ModelBooleanField,
    enum: ModelSelectField,
    multiEnum: ModelSelectField,
    tags: ModelSelectField,
}

const kind = computed(() => fieldKind(props.field))
</script>

<template>
    <VTextField
        v-if="kind === 'unsupported'"
        :model-value="formatValue(field, value)"
        :label="fieldLabel(field)"
        :hint="field.description"
        readonly
    />
    <component
        :is="CONTROLS[kind]"
        v-else
        v-model="value"
        :field="field"
        :readonly="readonly"
        :messages="messages"
    />
</template>
