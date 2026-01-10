<script lang="ts">
// Component creates v-data-table component using model data
import { defineComponent, PropType } from 'vue'
import { VDataTable } from 'vuetify/components'
import { Model } from '../types/model'
export default defineComponent({
	name: 'ModelTable',
	components: {
		VDataTable
	},
	props: {
		models: {
			type: Array as PropType<Model[]>,
			required: true
		}
	},
	setup(props) {
		const headers = [
			{ text: 'ID', value: 'id' },
			{ text: 'Name', value: 'name' },
			{ text: 'Created At', value: 'createdAt' }
		]

		return {
			headers
		}
	}
})
</script>
<template>
	<v-data-table :headers="headers" :items="models" class="elevation-1">
		<template #item.createdAt="{ item }">
			{{ new Date(item.createdAt).toLocaleDateString() }}
		</template>
	</v-data-table>
</template>
