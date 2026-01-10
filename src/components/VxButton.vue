<template>
  <v-btn
    :color="color"
    :disabled="disabled || loading"
    :loading="loading"
    v-bind="$attrs"
  >
    <template v-if="loading && loadingText">
      {{ loadingText }}
    </template>

    <slot v-else />
  </v-btn>
</template>

<script setup lang="ts">
import { VBtn } from 'vuetify/components'
import { computed } from 'vue'

interface Props {
  color?: string
  loading?: boolean
  disabled?: boolean
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  loading: false,
  disabled: false
})

const loading = computed(() => props.loading)
</script>
