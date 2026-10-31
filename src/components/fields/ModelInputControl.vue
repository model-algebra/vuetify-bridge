<script setup lang="ts">
// Any Vuetify input (VSlider, VRating, VSwitch…) bound to a field: label, hint, validation and conversion of values
import { useFieldInput } from '../../composables/useFieldInput'
import type { ComponentLike } from '../../schema'
import type { FieldControlProps } from './types'

const props = defineProps<FieldControlProps & {
    /** The Vuetify input, or the name of a globally registered one. */
    control: ComponentLike
}>()
const value = defineModel<unknown>()

const { input, label, hint, rules } = useFieldInput(() => props.field, value, () => props.messages)
</script>

<template>
    <component :is="control" v-model="input" :label="label" :hint="hint" :rules="rules" :readonly="readonly" />
</template>
