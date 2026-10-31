<script setup lang="ts">
// Sub-form editing the record an OBJECT field holds; an empty optional field can be filled in and cleared again
import { computed, ref } from 'vue'
import { VBtn, VCard, VCardItem, VCardSubtitle, VCardText, VCardTitle, VInput } from 'vuetify/components'
import ModelFields from '../ModelFields.vue'
import { emptyRecord, fieldLabel, fieldRules, isRequired, type FormMode } from '../../schema'
import type { ObjectControlProps } from './types'

const props = defineProps<ObjectControlProps>()
const value = defineModel<Record<string, unknown> | null>()

const label = computed(() => fieldLabel(props.field))
const required = computed(() => isRequired(props.field))
const rules = computed(() => fieldRules(props.field, props.messages))

// A record added here is new, so it is edited like one in a create form
const added = ref(false)
const nestedMode = computed<FormMode>(() => props.readonly ? 'view' : added.value ? 'create' : props.mode ?? 'edit')

function add() {
    added.value = true
    value.value = emptyRecord(props.model)
}

function clear() {
    added.value = false
    value.value = null
}
</script>

<template>
    <VInput :model-value="value" :rules="rules" class="model-object-field">
        <VCard variant="outlined" class="w-100">
            <VCardItem>
                <VCardTitle class="text-body-1">{{ label }}</VCardTitle>
                <VCardSubtitle v-if="field.description">{{ field.description }}</VCardSubtitle>
                <template #append>
                    <VBtn
                        v-if="value == null && !readonly"
                        variant="tonal"
                        size="small"
                        prepend-icon="$plus"
                        @click="add"
                    >Add</VBtn>
                    <VBtn
                        v-else-if="value != null && !readonly && !required"
                        variant="text"
                        size="small"
                        prepend-icon="$delete"
                        @click="clear"
                    >Remove</VBtn>
                </template>
            </VCardItem>
            <VCardText v-if="value != null">
                <ModelFields v-model="value" :model="model" :mode="nestedMode" :messages="messages" />
            </VCardText>
        </VCard>
    </VInput>
</template>
