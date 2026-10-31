<script setup lang="ts">
// Form editing a record of the model: a control per field, table-level checks, submit and cancel
import { computed, ref, watch } from 'vue'
import { VAlert, VBtn, VCol, VForm, VRow, VSpacer } from 'vuetify/components'
import ModelField from './fields/ModelField.vue'
import {
    emptyRecord, fieldKind, isEditable, isVisible, recordErrors, selectFields,
    type FieldLike, type FormMode, type ModelLike, type ValidationMessages,
} from '../schema'

const props = withDefaults(defineProps<{
    model: ModelLike
    /** create hides generated fields and fills in defaults, edit fixes keys, view makes everything read-only. */
    mode?: FormMode
    /** Names of the fields to show, in this order; all fields of the model by default. */
    fields?: string[]
    exclude?: string[]
    messages?: Partial<ValidationMessages>
    submitText?: string
    cancelText?: string
    /** Don't show the Save and Cancel buttons; use the actions slot or the exposed validate() instead. */
    hideActions?: boolean
}>(), {
    mode: 'edit',
    submitText: 'Save',
    cancelText: 'Cancel',
})

const record = defineModel<Record<string, unknown>>({ required: true })

const emit = defineEmits<{
    /** The record passed all checks of the model. */
    submit: [record: Record<string, unknown>]
    cancel: []
}>()

defineSlots<{
    /** Replaces the control of one field, e.g. #field.title */
    [name: `field.${string}`]: (props: {
        field: FieldLike
        value: unknown
        update: (value: unknown) => void
        readonly: boolean
    }) => any
    /** Replaces the Save and Cancel buttons. */
    actions?: (props: { submit: () => Promise<void>, cancel: () => void }) => any
}>()

const form = ref<InstanceType<typeof VForm>>()

const shownFields = computed(() =>
    selectFields(props.model, props.fields, props.exclude).filter(field => isVisible(field, props.mode)))

const errors = computed(() => recordErrors(props.model, record.value, props.messages))

// Short values share a row on wider screens, text and structured values take the whole row
const WIDE_KINDS = new Set(['longText', 'json', 'tags', 'multiEnum'])
const columns = (field: FieldLike) => WIDE_KINDS.has(fieldKind(field)) ? 12 : 6

function update(name: string, value: unknown) {
    record.value = { ...record.value, [name]: value }
}

/** Validates every field and the table-level checks; true when the record can be saved. */
async function validate(): Promise<boolean> {
    const result = await form.value?.validate()
    return (result?.valid ?? false) && errors.value.length === 0
}

async function submit() {
    if (await validate()) emit('submit', record.value)
}

function cancel() {
    emit('cancel')
}

// Also when the form switches to create mode, not only when it starts in it
watch(() => props.mode, mode => {
    if (mode === 'create') record.value = { ...emptyRecord(props.model), ...record.value }
}, { immediate: true })

defineExpose({
    validate,
    resetValidation: () => form.value?.resetValidation(),
})
</script>

<template>
    <VForm ref="form" @submit.prevent="submit">
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
                        :messages="messages"
                        @update:model-value="update(field.name, $event)"
                    />
                </slot>
            </VCol>
        </VRow>
        <VAlert v-for="error in errors" :key="error" type="error" variant="tonal" density="compact" class="mb-2">
            {{ error }}
        </VAlert>
        <slot v-if="mode !== 'view'" name="actions" :submit="submit" :cancel="cancel">
            <div v-if="!hideActions" class="d-flex ga-2">
                <VSpacer />
                <VBtn variant="text" @click="cancel">{{ cancelText }}</VBtn>
                <VBtn type="submit" color="primary">{{ submitText }}</VBtn>
            </div>
        </slot>
    </VForm>
</template>
