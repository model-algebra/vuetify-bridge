<script setup lang="ts">
// Controls of the fields of a record and its table-level checks, without a VForm: the body of ModelForm and of sub-forms.
// Every control, the checks included, registers with the enclosing VForm, so validating the form validates nested records too.
import { computed } from 'vue'
import { VAlert, VCol, VInput, VRow } from 'vuetify/components'
import ModelField from './fields/ModelField.vue'
import {
    fieldKind, isEditable, isVisible, recordErrors, selectFields,
    type FieldLike, type FormMode, type ModelLike, type ModelsOption, type ValidationMessages,
} from '../schema'

const props = withDefaults(defineProps<{
    model: ModelLike
    mode?: FormMode
    /** Names of the fields to show, in this order; all fields of the model by default. */
    fields?: string[]
    exclude?: string[]
    messages?: Partial<ValidationMessages>
    /** Models referenced by OBJECT fields; inherited from the enclosing form when not given. */
    models?: ModelsOption
}>(), {
    mode: 'edit',
})

const record = defineModel<Record<string, unknown>>({ required: true })

defineSlots<{
    /** Replaces the control of one field, e.g. #field.title */
    [name: `field.${string}`]: (props: {
        field: FieldLike
        value: unknown
        update: (value: unknown) => void
        readonly: boolean
    }) => any
}>()

const shownFields = computed(() =>
    selectFields(props.model, props.fields, props.exclude).filter(field => isVisible(field, props.mode)))

const errors = computed(() => recordErrors(props.model, record.value, props.messages))
const checkRules = [() => errors.value.length === 0 || errors.value[0]]

// Short values share a row on wider screens, text and structured values take the whole row
const WIDE_KINDS = new Set(['longText', 'json', 'tags', 'multiEnum', 'object', 'objectList'])
const columns = (field: FieldLike) => WIDE_KINDS.has(fieldKind(field)) ? 12 : 6

function update(name: string, value: unknown) {
    record.value = { ...record.value, [name]: value }
}
</script>

<template>
    <VRow>
        <VCol v-for="field in shownFields" :key="field.name" cols="12" :md="columns(field)">
            <slot
                :name="`field.${field.name}`"
                :field="field"
                :value="record[field.name]"
                :update="(value: unknown) => update(field.name, value)"
                :readonly="!isEditable(field, mode)"
            >
                <ModelField
                    :model-value="record[field.name]"
                    :field="field"
                    :readonly="!isEditable(field, mode)"
                    :mode="mode"
                    :messages="messages"
                    :models="models"
                    @update:model-value="update(field.name, $event)"
                />
            </slot>
        </VCol>
    </VRow>
    <VAlert v-for="error in errors" :key="error" type="error" variant="tonal" density="compact" class="mb-2">
        {{ error }}
    </VAlert>
    <!-- Not shown: makes the table-level checks part of the validation of the form -->
    <VInput :model-value="record" :rules="checkRules" class="d-none" hide-details />
</template>
