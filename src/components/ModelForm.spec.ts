import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'
import { eventJson, eventModel } from '../test/models'
import ModelForm from './ModelForm.vue'

const validEvent = { id: 7, title: 'Concert', code: null, seats: 100, status: 'DRAFT', startDate: '2026-11-01', endDate: '2026-11-02', created: null }

function renderForm(props: Record<string, unknown> = {}, slots: Record<string, any> = {}) {
    return render(ModelForm, { props: { model: eventModel, modelValue: { ...validEvent }, ...props }, slots })
}

const lastRecord = (emitted: Record<string, unknown[][]>) => emitted['update:modelValue']?.slice(-1)[0]?.[0] as Record<string, unknown>

describe('ModelForm', () => {
    test('shows a control per field with the record values', () => {
        renderForm()
        expect(screen.getByLabelText('Title')).toHaveValue('Concert')
        expect(screen.getByLabelText('Seats')).toHaveValue(100)
        expect(screen.getByLabelText('Start date')).toHaveValue('2026-11-01')
    })

    test('accepts the model in plain JSON form', () => {
        renderForm({ model: eventJson })
        expect(screen.getByLabelText('Title')).toHaveValue('Concert')
    })

    test('updates the record as the user edits', async () => {
        const { emitted } = renderForm()
        await fireEvent.update(screen.getByLabelText('Seats'), '120')
        expect(lastRecord(emitted())).toEqual({ ...validEvent, seats: 120 })
    })

    test('submits a valid record', async () => {
        const { emitted } = renderForm()
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        await waitFor(() => expect(emitted().submit).toEqual([[validEvent]]))
    })

    test('does not submit while a field is invalid', async () => {
        const { emitted } = renderForm({ modelValue: { ...validEvent, title: null } })
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        expect(await screen.findByText('Title is required')).toBeInTheDocument()
        expect(emitted().submit).toBeUndefined()
    })

    test('shows table-level check violations and does not submit', async () => {
        const { emitted } = renderForm({ modelValue: { ...validEvent, endDate: '2026-10-01' } })
        expect(screen.getByText('End date must be at least Start date')).toBeInTheDocument()
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        await waitFor(() => expect(screen.getByText('End date must be at least Start date')).toBeInTheDocument())
        expect(emitted().submit).toBeUndefined()
    })

    test('emits cancel', async () => {
        const { emitted } = renderForm({ cancelText: 'Back' })
        await fireEvent.click(screen.getByRole('button', { name: 'Back' }))
        expect(emitted().cancel).toHaveLength(1)
    })

    test('in create mode hides generated fields and fills in defaults', async () => {
        const { emitted } = renderForm({ mode: 'create', modelValue: {} })
        expect(screen.queryByLabelText('Id')).toBeNull()
        await waitFor(() => expect(lastRecord(emitted())).toMatchObject({ seats: 10, title: null }))
    })

    test('fills in defaults when switched to create mode', async () => {
        const { emitted, rerender } = renderForm({ mode: 'view', modelValue: { title: 'Draft' } })
        expect(emitted()['update:modelValue']).toBeUndefined()
        await rerender({ mode: 'create' })
        expect(lastRecord(emitted())).toMatchObject({ seats: 10, title: 'Draft' })
        expect(screen.queryByLabelText('Id')).toBeNull()
    })

    test('in edit mode keys are read-only', () => {
        renderForm()
        expect(screen.getByLabelText('Id')).toHaveAttribute('readonly')
        expect(screen.getByLabelText('Title')).not.toHaveAttribute('readonly')
    })

    test('in view mode everything is read-only and there are no buttons', () => {
        renderForm({ mode: 'view' })
        expect(screen.getByLabelText('Title')).toHaveAttribute('readonly')
        expect(screen.queryByRole('button', { name: 'Save' })).toBeNull()
    })

    test('shows chosen fields in the given order', () => {
        const { container } = renderForm({ fields: ['status', 'title'] })
        const labels = Array.from(container.querySelectorAll('.v-field-label:not(.v-field-label--floating)')).map(label => label.textContent)
        expect(labels).toEqual(['Status', 'Title'])
    })

    test('a field can be replaced with a slot', async () => {
        const { emitted } = renderForm({}, {
            'field.title': ({ value, update }: { value: unknown, update: (value: unknown) => void }) =>
                h('button', { onClick: () => update(`${value}!`) }, 'Shout'),
        })
        expect(screen.queryByLabelText('Title')).toBeNull()
        await fireEvent.click(screen.getByRole('button', { name: 'Shout' }))
        expect(lastRecord(emitted()).title).toBe('Concert!')
    })

    test('works with v-model in a parent', async () => {
        const Parent = defineComponent({
            setup() {
                const event = ref({ ...validEvent })
                return () => [
                    h(ModelForm, { model: eventModel, modelValue: event.value, 'onUpdate:modelValue': (value: any) => { event.value = value } }),
                    h('output', `${event.value.title} for ${event.value.seats}`),
                ]
            },
        })
        render(Parent)
        await fireEvent.update(screen.getByLabelText('Title'), 'Opera')
        await fireEvent.update(screen.getByLabelText('Seats'), '50')
        expect(screen.getByText('Opera for 50')).toBeInTheDocument()
    })
})
