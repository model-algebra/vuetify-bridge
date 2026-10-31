import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { defineComponent, h } from 'vue'
import { VCheckbox, VSlider } from 'vuetify/components'
import { eventJson, eventModel } from '../test/models'
import { formOptions, withForm, type FieldControlProps, type ModelLike, type FormModel, type FormRowProps } from '..'
import ModelForm from './ModelForm.vue'
import ModelFormField from './ModelFormField'

const validEvent = { id: 7, title: 'Concert', code: null, seats: 100, status: 'DRAFT', startDate: '2026-11-01', endDate: '2026-11-02', created: null }

function renderForm(form: FormModel, props: Record<string, unknown> = {}, slots: Record<string, any> = {}, global: Record<string, any> = {}) {
    return render(ModelForm, { props: { model: withForm(eventModel, form), modelValue: { ...validEvent }, ...props }, slots, global })
}

const lastRecord = (emitted: Record<string, unknown[][]>) => emitted['update:modelValue']?.slice(-1)[0]?.[0] as Record<string, unknown>
const labels = () => Array.from(document.querySelectorAll('label.v-label:not(.v-field-label--floating)')).map(l => l.textContent?.trim())

describe('withForm', () => {
    test('combines the model with form options without changing the model', () => {
        const combined = withForm(eventModel, { fields: { title: { label: 'Name', hint: 'Shown everywhere', cols: 12 } }, order: ['title'] })
        const title = combined.fields.find(f => f.name === 'title')!
        expect(title).toMatchObject({ label: 'Name', description: 'Shown everywhere', form: { cols: 12 } })
        expect(title).toBeInstanceOf(eventModel.fields[0].constructor)
        expect(combined).toBeInstanceOf(eventModel.constructor)
        expect(combined.form?.order).toEqual(['title'])
        expect((eventModel.fields.find(f => f.name === 'title') as any).label).toBeUndefined()
        expect((eventModel as any).form).toBeUndefined()
    })

    test('works on the model in plain JSON form', () => {
        expect(formOptions(withForm(eventJson as ModelLike, { fields: { seats: { hidden: true } } }).fields.find(f => f.name === 'seats')!)).toEqual({ hidden: true })
    })

    test('rejects fields the model does not have', () => {
        expect(() => withForm(eventModel, { fields: { tilte: {} }, order: ['title', 'place'] }))
            .toThrow('The form of model Event names unknown fields: tilte, place')
    })
})

describe('ModelForm with a form model', () => {
    test('shows the fields in its order, with its labels, without hidden ones', () => {
        renderForm({ order: ['seats', 'title', 'code'], fields: { code: { hidden: true }, title: { label: 'Name' } } })
        expect(labels()).toEqual(['Seats', 'Name'])
    })

    test('the fields prop still chooses the fields', () => {
        renderForm({ order: ['seats', 'title'] }, { fields: ['title'] })
        expect(labels()).toEqual(['Title'])
    })

    test('gives the control attributes', () => {
        renderForm({ order: ['seats'], fields: { seats: { props: { suffix: 'seats', variant: 'outlined' } } } })
        expect(screen.getByText('seats')).toHaveClass('v-text-field__suffix__text')
        expect(document.querySelector('.v-field--variant-outlined')).not.toBeNull()
    })

    test('sets the width of fields on the grid', () => {
        renderForm({ order: ['title', 'seats'], fields: { title: { cols: 4 } } })
        const cols = Array.from(document.querySelectorAll('.v-col-12')).map(col => Array.from(col.classList).find(c => c.startsWith('v-col-md-')))
        expect(cols).toEqual(['v-col-md-4', 'v-col-md-6'])
    })

    test('binds any Vuetify input as the control, with label, rules and conversion', async () => {
        const { emitted } = renderForm({ order: ['seats'], fields: { seats: { control: VSlider, props: { min: 1, max: 500, step: 1 } } } })
        const slider = screen.getByRole('slider')
        expect(slider).toHaveAttribute('aria-valuenow', '100')
        expect(screen.getByText('Seats')).toBeInTheDocument()
        await fireEvent.keyDown(slider, { key: 'ArrowRight' })
        expect(lastRecord(emitted())).toMatchObject({ seats: 101 })
    })

    test('resolves controls named by globally registered components', () => {
        renderForm({ order: ['status'], fields: { status: { control: 'MyCheckbox', props: { trueValue: 'PUBLISHED', falseValue: 'DRAFT' } } } },
            {}, {}, { components: { MyCheckbox: VCheckbox } })
        expect(screen.getByLabelText('Status')).not.toBeChecked()
    })

    test('gives controls of fields the props of field controls', async () => {
        const Upper = defineComponent({
            props: { field: { type: Object, required: true }, modelValue: null, readonly: Boolean, messages: Object },
            emits: ['update:modelValue'],
            setup: (props: FieldControlProps & { modelValue: unknown }, { emit }) => () =>
                h('button', { type: 'button', onClick: () => emit('update:modelValue', String(props.modelValue).toUpperCase()) },
                    `${props.field.name}: ${props.modelValue}`),
        })
        const { emitted } = renderForm({ order: ['title'], fields: { title: { control: Upper } } })
        await fireEvent.click(screen.getByText('title: Concert'))
        expect(lastRecord(emitted())).toMatchObject({ title: 'CONCERT' })
    })

    test('replaces the place of a field with a row that gets the control', () => {
        const Row = defineComponent({
            props: ['field', 'value', 'update', 'readonly', 'mode', 'record'],
            setup: (props: FormRowProps, { slots }) => () =>
                h('section', { 'data-testid': 'row' }, [h('h3', `${props.field.name} of ${props.record.title} in ${props.mode}`), slots.default?.()]),
        })
        renderForm({ order: ['seats'], fields: { seats: { row: Row } } }, { mode: 'view' })
        expect(screen.getByRole('heading')).toHaveTextContent('seats of Concert in view')
        expect(screen.getByLabelText('Seats')).toHaveAttribute('readonly')
    })

    test('takes button texts and an action bar from the form model', async () => {
        const Actions = defineComponent({
            props: ['submit', 'cancel', 'validate', 'mode', 'record', 'submitText', 'cancelText'],
            setup: (props: any) => () => h('button', { type: 'button', onClick: props.submit }, `${props.submitText} ${props.record.title}`),
        })
        renderForm({ submitText: 'Publish', cancelText: 'Discard' })
        expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
        document.body.innerHTML = ''
        const { emitted } = renderForm({ submitText: 'Publish', actions: Actions })
        await fireEvent.click(screen.getByRole('button', { name: 'Publish Concert' }))
        await waitFor(() => expect(emitted().submit).toEqual([[validEvent]]))
    })

    test('props override the texts of the form model', () => {
        renderForm({ submitText: 'Publish' }, { submitText: 'Send' })
        expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
    })
})

describe('ModelForm with a layout of its own', () => {
    const layout = () => h('div', [
        h('fieldset', { 'data-testid': 'main' }, [h(ModelFormField, { name: 'title' }), h(ModelFormField, { name: 'seats', suffix: 'seats' })]),
        h(ModelFormField, { name: 'startDate' }),
    ])

    test('places fields with ModelFormField, which keeps their form options', () => {
        render(ModelForm, { props: { model: withForm(eventModel, { fields: { title: { label: 'Name' } } }), modelValue: { ...validEvent } }, slots: { default: layout } })
        expect(labels()).toEqual(['Name', 'Seats', 'Start date'])
        expect(screen.getByText('seats')).toBeInTheDocument()
    })

    test('edits, validates and submits as the default layout does', async () => {
        const { emitted } = render(ModelForm, { props: { model: eventModel, modelValue: { ...validEvent, title: null } }, slots: { default: layout } })
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        expect(await screen.findByText('Title is required')).toBeInTheDocument()
        await fireEvent.update(screen.getByLabelText('Title'), 'Ball')
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        await waitFor(() => expect(emitted().submit).toEqual([[{ ...validEvent, title: 'Ball' }]]))
    })

    test('still checks the record as a whole', async () => {
        render(ModelForm, { props: { model: eventModel, modelValue: { ...validEvent, endDate: '2026-10-01' } }, slots: { default: layout } })
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        await waitFor(() => expect(screen.getByText('End date must be at least Start date')).toBeInTheDocument())
    })

    test('the slot gets the fields to show and the record', () => {
        render(ModelForm, {
            props: { model: eventModel, modelValue: { ...validEvent }, mode: 'create' },
            slots: { default: ({ fields, record, mode }: any) => h('p', `${mode}: ${fields.map((f: any) => f.name).join(',')} ${record.title}`) },
        })
        expect(screen.getByText(/^create: title,code,seats/)).toHaveTextContent('Concert')
    })

    test('ModelFormField needs an enclosing form', () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {})
        expect(() => render(ModelFormField, { props: { name: 'title' } })).toThrow('ModelFormField must be inside a ModelForm or ModelFields')
    })
})
