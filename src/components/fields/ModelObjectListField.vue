<script setup lang="ts">
// List of sub-forms for an ARRAY of OBJECT: items can be added, removed and moved
import { computed, ref, watch } from 'vue'
import { VBtn, VCard, VCardItem, VCardSubtitle, VCardText, VCardTitle, VInput } from 'vuetify/components'
import ModelFields from '../ModelFields.vue'
import { emptyRecord, fieldLabel, fieldRules, type FormMode } from '../../schema'
import type { ObjectControlProps } from './types'

type Item = Record<string, unknown>

const props = defineProps<ObjectControlProps>()
const value = defineModel<Item[] | null>()

const items = computed(() => value.value ?? [])
const label = computed(() => fieldLabel(props.field))
const itemLabel = computed(() => fieldLabel({ name: props.model.metadata.name, type: 'OBJECT' }))
const rules = computed(() => fieldRules(props.field, props.messages))

// Stable keys keep each sub-form with its item when items move; items added here are new
let nextKey = 0
const keys = ref<number[]>([])
const addedKeys = ref(new Set<number>())
watch(() => items.value.length, length => {
    if (keys.value.length !== length) keys.value = Array.from({ length }, () => nextKey++)
}, { immediate: true })

const itemMode = (index: number): FormMode =>
    props.readonly ? 'view' : addedKeys.value.has(keys.value[index]) ? 'create' : props.mode ?? 'edit'

function update(index: number, item: Item) {
    value.value = items.value.map((current, i) => i === index ? item : current)
}

function add() {
    const key = nextKey++
    keys.value = [...keys.value, key]
    addedKeys.value = new Set(addedKeys.value).add(key)
    value.value = [...items.value, emptyRecord(props.model)]
}

function remove(index: number) {
    keys.value = keys.value.filter((_, i) => i !== index)
    value.value = items.value.filter((_, i) => i !== index)
}

function move(index: number, by: number) {
    const swap = <T,>(list: T[]) => {
        const copy = [...list];
        [copy[index], copy[index + by]] = [copy[index + by], copy[index]]
        return copy
    }
    keys.value = swap(keys.value)
    value.value = swap(items.value)
}
</script>

<template>
    <VInput :model-value="items" :rules="rules" class="model-object-list-field">
        <VCard variant="outlined" class="w-100">
            <VCardItem>
                <VCardTitle class="text-body-1">{{ label }}</VCardTitle>
                <VCardSubtitle v-if="field.description">{{ field.description }}</VCardSubtitle>
                <template #append>
                    <VBtn v-if="!readonly" variant="tonal" size="small" prepend-icon="$plus" @click="add">
                        Add {{ itemLabel.toLowerCase() }}
                    </VBtn>
                </template>
            </VCardItem>
            <VCardText>
                <p v-if="items.length === 0" class="text-medium-emphasis">No {{ itemLabel.toLowerCase() }} items.</p>
                <VCard
                    v-for="(item, index) in items"
                    :key="keys[index]"
                    variant="tonal"
                    class="mb-3"
                    :aria-label="`${itemLabel} ${index + 1}`"
                >
                    <VCardItem>
                        <VCardTitle class="text-body-2">{{ itemLabel }} {{ index + 1 }}</VCardTitle>
                        <template v-if="!readonly" #append>
                            <VBtn
                                icon="$expand"
                                variant="text"
                                size="small"
                                :disabled="index === items.length - 1"
                                :aria-label="`Move ${itemLabel} ${index + 1} down`"
                                @click="move(index, 1)"
                            />
                            <VBtn
                                icon="$collapse"
                                variant="text"
                                size="small"
                                :disabled="index === 0"
                                :aria-label="`Move ${itemLabel} ${index + 1} up`"
                                @click="move(index, -1)"
                            />
                            <VBtn
                                icon="$delete"
                                variant="text"
                                size="small"
                                :aria-label="`Remove ${itemLabel} ${index + 1}`"
                                @click="remove(index)"
                            />
                        </template>
                    </VCardItem>
                    <VCardText>
                        <ModelFields
                            :model-value="item"
                            :model="model"
                            :mode="itemMode(index)"
                            :messages="messages"
                            @update:model-value="update(index, $event)"
                        />
                    </VCardText>
                </VCard>
            </VCardText>
        </VCard>
    </VInput>
</template>
