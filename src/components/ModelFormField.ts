// One field of the enclosing form, as its form options say: for custom layouts in the default slot of ModelForm
import { computed, defineComponent, h, type Component, type PropType } from 'vue'
import ModelField from './fields/ModelField.vue'
import ModelInputControl from './fields/ModelInputControl.vue'
import { useFormComponents } from '../composables/useFormComponents'
import { useFormFields } from '../composables/useFormFields'
import { formField, formOptions, isEditable, isVisible, type FieldLike } from '../schema'

/** Whether the component declares the prop. */
function declares(component: Component | string, prop: string): boolean {
    if (typeof component === 'string') return false
    const props = (component as { props?: unknown }).props
    return Array.isArray(props) ? props.includes(prop) : typeof props === 'object' && props !== null && prop in props
}

export default defineComponent({
    name: 'ModelFormField',
    inheritAttrs: false,
    props: {
        /** Name of the field. */
        name: { type: String, required: true },
        /** The field itself, instead of looking it up by name. */
        field: { type: Object as PropType<FieldLike>, default: undefined },
    },
    setup(props, { attrs }) {
        const form = useFormFields()
        const resolve = useFormComponents()

        const field = computed(() => {
            if (props.field !== undefined) return props.field
            const model = form.model()
            const found = model.fields.find(f => f.name === props.name)
            if (found === undefined) throw new Error(`Model ${model.metadata.name} has no field ${props.name}`)
            return found
        })

        return () => {
            const options = formOptions(field.value)
            // With the label and hint of the form options
            const current = formField(field.value)
            const mode = form.mode()
            if (options.hidden === true || !isVisible(current, mode)) return null

            const value = form.record.value[current.name]
            const update = (next: unknown) => form.update(current.name, next)
            const readonly = !isEditable(current, mode)
            const messages = form.messages()
            const slot = form.slots[`field.${current.name}`]

            const control = () => {
                if (slot !== undefined) return slot({ field: current, value, update, readonly })
                const bound = { ...options.props, ...attrs, modelValue: value, 'onUpdate:modelValue': update, field: current, readonly, messages }
                if (options.control === undefined) return h(ModelField, { ...bound, mode })
                const component = resolve(options.control)
                // Controls of fields take the field; any other component is bound as a Vuetify input
                if (!declares(component, 'field')) return h(ModelInputControl, { ...bound, control: component })
                return h(component as Component, declares(component, 'mode') ? { ...bound, mode } : bound)
            }

            if (options.row === undefined) return control()
            return h(resolve(options.row) as Component,
                { field: current, value, update, readonly, mode, record: form.record.value },
                { default: control })
        }
    },
})
