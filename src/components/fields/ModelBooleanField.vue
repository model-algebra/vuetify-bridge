<script setup lang="ts">
import { VCheckbox } from 'vuetify/components'
import { useFieldInput } from '../../composables/useFieldInput'
import type { FieldControlProps } from './types'

const props = defineProps<FieldControlProps>()
const value = defineModel<unknown>()

const { input, label, hint, rules } = useFieldInput(() => props.field, value, () => props.messages)
</script>

<template>
    <VCheckbox
        v-model="input"
        :label="label"
        :hint="hint"
        :persistent-hint="hint !== undefined"
        :rules="rules"
        :readonly="readonly"
    />
</template>
