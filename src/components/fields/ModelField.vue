<script setup lang="ts">
// Control for a model field, chosen by the kind of the field
import { computed, type Component } from 'vue'
import { VTextField } from 'vuetify/components'
import { useModels } from '../../composables/useModels'
import {
    fieldKind, fieldLabel, formatValue, referencedModel,
    type FieldKind, type FormMode, type ModelsOption,
} from '../../schema'
import ModelBooleanField from './ModelBooleanField.vue'
import ModelObjectField from './ModelObjectField.vue'
import ModelObjectListField from './ModelObjectListField.vue'
import ModelSelectField from './ModelSelectField.vue'
import ModelTextField from './ModelTextField.vue'
import ModelTextareaField from './ModelTextareaField.vue'
import type { FieldControlProps } from './types'

const props = defineProps<FieldControlProps & {
    /** Mode of the enclosing form, passed on to sub-forms of OBJECT fields. */
    mode?: FormMode
    /** Models referenced by OBJECT fields; inherited from the enclosing form when not given. */
    models?: ModelsOption
}>()
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
    object: ModelObjectField,
    objectList: ModelObjectListField,
}

const resolve = useModels(() => props.models)

const kind = computed(() => fieldKind(props.field))

// OBJECT fields get sub-forms when the referenced model is known, and are edited as JSON otherwise
const referenced = computed(() => {
    const name = referencedModel(props.field)
    return name !== undefined ? resolve.value(name) : undefined
})
const control = computed(() => {
    if (kind.value === 'unsupported') return undefined
    if ((kind.value === 'object' || kind.value === 'objectList') && referenced.value === undefined)
        return ModelTextareaField
    return CONTROLS[kind.value]
})
</script>

<template>
    <VTextField
        v-if="control === undefined"
        :model-value="formatValue(field, value)"
        :label="fieldLabel(field)"
        :hint="field.description"
        readonly
    />
    <component
        :is="control"
        v-else-if="referenced !== undefined"
        v-model="value"
        :field="field"
        :model="referenced"
        :mode="mode"
        :readonly="readonly"
        :messages="messages"
    />
    <component
        :is="control"
        v-else
        v-model="value"
        :field="field"
        :readonly="readonly"
        :messages="messages"
    />
</template>
