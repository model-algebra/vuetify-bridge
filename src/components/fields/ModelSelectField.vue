<script setup lang="ts">
// Choice of enum values, several of them for arrays; free-form tags for arrays of strings
import { computed } from 'vue'
import { VCombobox, VSelect } from 'vuetify/components'
import { useFieldInput } from '../../composables/useFieldInput'
import { enumValues } from '../../schema'
import type { FieldControlProps } from './types'

const props = defineProps<FieldControlProps>()
const value = defineModel<unknown>()

const { input, kind, label, hint, required, rules } = useFieldInput(() => props.field, value, () => props.messages)

const items = computed(() => enumValues(props.field) ?? [])
</script>

<template>
    <VCombobox
        v-if="kind === 'tags'"
        v-model="input"
        :label="label"
        :hint="hint"
        :rules="rules"
        :readonly="readonly"
        multiple
        chips
        closable-chips
        hide-no-data
    />
    <VSelect
        v-else
        v-model="input"
        :items="items"
        :multiple="kind === 'multiEnum'"
        :chips="kind === 'multiEnum'"
        :clearable="!required && !readonly"
        :label="label"
        :hint="hint"
        :rules="rules"
        :readonly="readonly"
    />
</template>
