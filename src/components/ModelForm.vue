<script setup lang="ts">
// Form editing a record of the model: a control per field, table-level checks, submit and cancel
import { computed, ref, useSlots, watch } from 'vue'
import { VBtn, VForm, VSpacer } from 'vuetify/components'
import ModelFields from './ModelFields.vue'
import { useModels } from '../composables/useModels'
import {
    emptyRecord, formOf,
    type FieldLike, type FormMode, type ModelLike, type ModelsOption, type ValidationMessages,
} from '../schema'

const props = withDefaults(defineProps<{
    model: ModelLike
    /** create hides generated fields and fills in defaults, edit fixes keys, view makes everything read-only. */
    mode?: FormMode
    /** Names of the fields to show, in this order; all fields of the model by default. */
    fields?: string[]
    exclude?: string[]
    messages?: Partial<ValidationMessages>
    /** Models referenced by OBJECT fields, edited with nested sub-forms; without them such fields are edited as JSON. */
    models?: ModelsOption
    /** Text of the Save button; from the form model, or Save, by default. */
    submitText?: string
    /** Text of the Cancel button; from the form model, or Cancel, by default. */
    cancelText?: string
    /** Don't show the Save and Cancel buttons; use the actions slot or the exposed validate() instead. */
    hideActions?: boolean
}>(), {
    mode: 'edit',
})

/** Props of the actions slot and of the actions component of the form model. */
interface ActionProps {
    /** Validates the record and emits submit when it passes. */
    submit: () => Promise<void>
    cancel: () => void
    validate: () => Promise<boolean>
    mode: FormMode
    record: Record<string, unknown>
    submitText: string
    cancelText: string
}

const record = defineModel<Record<string, unknown>>({ required: true })

const emit = defineEmits<{
    /** The record, nested records included, passed all checks of the models. */
    submit: [record: Record<string, unknown>]
    cancel: []
}>()

defineSlots<{
    /** A layout of your own instead of the grid: place fields with <ModelFormField name="…" />. */
    default?: (props: {
        fields: FieldLike[]
        record: Record<string, unknown>
        update: (name: string, value: unknown) => void
        mode: FormMode
    }) => any
    /** Replaces the control of one field, e.g. #field.title */
    [name: `field.${string}`]: (props: {
        field: FieldLike
        value: unknown
        update: (value: unknown) => void
        readonly: boolean
    }) => any
    /** Replaces the Save and Cancel buttons. */
    actions?: (props: ActionProps) => any
}>()

useModels(() => props.models)

const slots = useSlots()
const fieldSlots = computed(() => Object.keys(slots).filter(name => name.startsWith('field.')) as `field.${string}`[])

const formModel = computed(() => formOf(props.model))
const actionProps = computed<ActionProps>(() => ({
    submit, cancel, validate,
    mode: props.mode,
    record: record.value,
    submitText: props.submitText ?? formModel.value.submitText ?? 'Save',
    cancelText: props.cancelText ?? formModel.value.cancelText ?? 'Cancel',
}))

const form = ref<InstanceType<typeof VForm>>()

/** Validates every field, nested ones included, and the table-level checks; true when the record can be saved. */
async function validate(): Promise<boolean> {
    const result = await form.value?.validate()
    return result?.valid ?? false
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
        <ModelFields v-model="record" :model="model" :mode="mode" :fields="fields" :exclude="exclude" :messages="messages">
            <template v-if="slots.default" #default="layout">
                <slot v-bind="layout" />
            </template>
            <template v-for="name in fieldSlots" :key="name" #[name]="slotProps">
                <slot :name="name" v-bind="slotProps" />
            </template>
        </ModelFields>
        <slot v-if="mode !== 'view'" name="actions" v-bind="actionProps">
            <template v-if="!hideActions">
                <component :is="formModel.actions" v-if="formModel.actions !== undefined" v-bind="actionProps" />
                <div v-else class="d-flex ga-2">
                    <VSpacer />
                    <VBtn variant="text" @click="cancel">{{ actionProps.cancelText }}</VBtn>
                    <VBtn type="submit" color="primary">{{ actionProps.submitText }}</VBtn>
                </div>
            </template>
        </slot>
    </VForm>
</template>
