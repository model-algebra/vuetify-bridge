<script setup lang="ts">
// Form editing a record of the model: a control per field, table-level checks, submit and cancel
import { computed, ref, useSlots, watch } from 'vue'
import { VBtn, VForm, VSpacer } from 'vuetify/components'
import ModelFields from './ModelFields.vue'
import { useModels } from '../composables/useModels'
import {
    emptyRecord,
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
    /** The record, nested records included, passed all checks of the models. */
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

useModels(() => props.models)

const slots = useSlots()
const fieldSlots = computed(() => Object.keys(slots).filter(name => name.startsWith('field.')) as `field.${string}`[])

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
            <template v-for="name in fieldSlots" :key="name" #[name]="slotProps">
                <slot :name="name" v-bind="slotProps" />
            </template>
        </ModelFields>
        <slot v-if="mode !== 'view'" name="actions" :submit="submit" :cancel="cancel">
            <div v-if="!hideActions" class="d-flex ga-2">
                <VSpacer />
                <VBtn variant="text" @click="cancel">{{ cancelText }}</VBtn>
                <VBtn type="submit" color="primary">{{ submitText }}</VBtn>
            </div>
        </slot>
    </VForm>
</template>
