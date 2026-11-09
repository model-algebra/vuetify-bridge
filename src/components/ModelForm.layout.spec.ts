import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { defineComponent, h, type PropType } from 'vue'
import { VCheckbox, VSlider } from 'vuetify/components'
import { eventJson, eventModel } from '../test/models'
import { union } from 'model-algebra-typescript'
import { FormComponentsKey, formField, formOf, formOptions, type FieldControlProps, type FieldFormOptions, type FieldLike, type FormRowProps, type ModelFormOptions } from '..'
import ModelForm from './ModelForm.vue'
import ModelFormField from './ModelFormField'

const validEvent = { id: 7, title: 'Concert', code: null, seats: 100, status: 'DRAFT', startDate: '2026-11-01', endDate: '2026-11-02', created: null }

/** A form model: a model with only form options, by field, and of the model. */
const formModel = (fields: Record<string, FieldFormOptions>, form?: ModelFormOptions) => ({
    metadata: { name: 'Event' },
    fields: Object.entries(fields).map(([name, options]) => ({ name, form: options })),
    ...(form !== undefined ? { form } : {}),
})

function renderForm(form: ReturnType<typeof formModel>, props: Record<string, unknown> = {}, slots: Record<string, any> = {}, global: Record<string, any> = {}) {
    return render(ModelForm, { props: { model: union(eventModel, form), modelValue: { ...validEvent }, ...props }, slots, global })
}

const lastRecord = (emitted: Record<string, unknown[][]>) => emitted['update:modelValue']?.slice(-1)[0]?.[0] as Record<string, unknown>
const labels = () => Array.from(document.querySelectorAll('label.v-label:not(.v-field-label--floating)')).map(l => l.textContent?.trim())

/** Props of the actions component of the form model. */
interface ActionProps {
    submit: () => Promise<void>
    cancel: () => void
    validate: () => Promise<boolean>
    mode: string
    record: Record<string, unknown>
    submitText: string
    cancelText: string
}

describe('form models', () => {
    test('are united with the model, which stays as it is', () => {
        const combined = union(eventModel, formModel({ title: { label: 'Name', hint: 'Shown everywhere', cols: 12 } }, { order: ['title'] }))
        const title = combined.fields.find(f => f.name === 'title')!
        expect(formOptions(title)).toEqual({ label: 'Name', hint: 'Shown everywhere', cols: 12 })
        expect(formField(title)).toMatchObject({ label: 'Name', description: 'Shown everywhere', type: 'STRING' })
        expect(formOf(combined)).toEqual({ order: ['title'] })
        expect(formOptions(eventModel.fields.find(f => f.name === 'title')!)).toEqual({})
        expect(formOf(eventModel)).toEqual({})
    })

    test('work on the model in plain JSON form too', () => {
        const combined = union(eventJson, formModel({ seats: { hidden: true } }))
        expect(formOptions(combined.fields.find((f: any) => f.name === 'seats')!)).toEqual({ hidden: true })
    })
})

describe('ModelForm with a form model', () => {
    test('shows the fields in its order, with its labels, without hidden ones', () => {
        renderForm(formModel({ code: { hidden: true }, title: { label: 'Name' } }, { order: ['seats', 'title', 'code'] }))
        expect(labels()).toEqual(['Seats', 'Name'])
    })

    test('the fields prop still chooses the fields', () => {
        renderForm(formModel({}, { order: ['seats', 'title'] }), { fields: ['title'] })
        expect(labels()).toEqual(['Title'])
    })

    test('gives the control attributes', () => {
        renderForm(formModel({ seats: { props: { suffix: 'seats', variant: 'outlined' } } }, { order: ['seats'] }))
        expect(screen.getByText('seats')).toHaveClass('v-text-field__suffix__text')
        expect(document.querySelector('.v-field--variant-outlined')).not.toBeNull()
    })

    test('sets the width of fields on the grid', () => {
        renderForm(formModel({ title: { cols: 4 } }, { order: ['title', 'seats'] }))
        const cols = Array.from(document.querySelectorAll('.v-col-12')).map(col => Array.from(col.classList).find(c => c.startsWith('v-col-md-')))
        expect(cols).toEqual(['v-col-md-4', 'v-col-md-6'])
    })

    test('binds any Vuetify input as the control, with label, rules and conversion', async () => {
        const { emitted } = renderForm(formModel({ seats: { control: 'VSlider', props: { min: 1, max: 500, step: 1 } } }, { order: ['seats'] }),
            { components: { VSlider } })
        const slider = screen.getByRole('slider')
        expect(slider).toHaveAttribute('aria-valuenow', '100')
        expect(screen.getByText('Seats')).toBeInTheDocument()
        await fireEvent.keyDown(slider, { key: 'ArrowRight' })
        expect(lastRecord(emitted())).toMatchObject({ seats: 101 })
    })

    test('finds named components in the app and among globally registered ones', () => {
        const status = formModel({ status: { control: 'MyCheckbox', props: { trueValue: 'PUBLISHED', falseValue: 'DRAFT' } } }, { order: ['status'] })
        renderForm(status, {}, {}, { provide: { [FormComponentsKey as symbol]: { MyCheckbox: VCheckbox } } })
        expect(screen.getByLabelText('Status')).not.toBeChecked()
        document.body.innerHTML = ''
        renderForm(status, {}, {}, { components: { MyCheckbox: VCheckbox } })
        expect(screen.getByLabelText('Status')).not.toBeChecked()
    })

    test('components given to the form win over those of the app', () => {
        const Other = defineComponent({ props: { field: { type: Object as PropType<FieldLike>, required: true } }, setup: () => () => h('b', 'other') })
        renderForm(formModel({ title: { control: 'Title' } }, { order: ['title'] }), { components: { Title: Other } },
            {}, { provide: { [FormComponentsKey as symbol]: { Title: VCheckbox } } })
        expect(screen.getByText('other')).toBeInTheDocument()
    })

    test('gives controls of fields the props of field controls', async () => {
        const Upper = defineComponent({
            props: { field: { type: Object, required: true }, modelValue: null, readonly: Boolean, messages: Object },
            emits: ['update:modelValue'],
            setup: (props: FieldControlProps & { modelValue: unknown }, { emit }) => () =>
                h('button', { type: 'button', onClick: () => emit('update:modelValue', String(props.modelValue).toUpperCase()) },
                    `${props.field.name}: ${props.modelValue}`),
        })
        const { emitted } = renderForm(formModel({ title: { control: 'Upper' } }, { order: ['title'] }), { components: { Upper } })
        await fireEvent.click(screen.getByText('title: Concert'))
        expect(lastRecord(emitted())).toMatchObject({ title: 'CONCERT' })
    })

    test('replaces the place of a field with a row that gets the control', () => {
        const Row = defineComponent({
            props: {
                field: { type: Object as PropType<FieldLike>, required: true },
                value: { type: null },
                update: { type: Function as PropType<FormRowProps['update']>, required: true },
                readonly: { type: Boolean, required: true },
                mode: { type: String, required: true },
                record: { type: Object as PropType<FormRowProps['record']>, required: true },
            },
            setup: (props: FormRowProps, { slots }) => () =>
                h('section', { 'data-testid': 'row' }, [h('h3', `${props.field.name} of ${props.record.title} in ${props.mode}`), slots.default?.()]),
        })
        renderForm(formModel({ seats: { row: 'Row' } }, { order: ['seats'] }), { mode: 'view', components: { Row } })
        expect(screen.getByRole('heading')).toHaveTextContent('seats of Concert in view')
        expect(screen.getByLabelText('Seats')).toHaveAttribute('readonly')
    })

    test('takes button texts and an action bar from the form model', async () => {
        const Actions = defineComponent({
            props: {
                submit: { type: Function as PropType<ActionProps['submit']>, required: true },
                cancel: { type: Function as PropType<ActionProps['cancel']>, required: true },
                validate: { type: Function as PropType<ActionProps['validate']>, required: true },
                mode: { type: String, required: true },
                record: { type: Object as PropType<ActionProps['record']>, required: true },
                submitText: { type: String, required: true },
                cancelText: { type: String, required: true },
            },
            setup: (props: ActionProps) => () => h('button', { type: 'button', onClick: props.submit }, `${props.submitText} ${props.record.title}`),
        })
        renderForm(formModel({}, { submitText: 'Publish', cancelText: 'Discard' }))
        expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
        document.body.innerHTML = ''
        const { emitted } = renderForm(formModel({}, { submitText: 'Publish', actions: 'Actions' }), { components: { Actions } })
        await fireEvent.click(screen.getByRole('button', { name: 'Publish Concert' }))
        await waitFor(() => expect(emitted().submit).toEqual([[validEvent]]))
    })

    test('props override the texts of the form model', () => {
        renderForm(formModel({}, { submitText: 'Publish' }), { submitText: 'Send' })
        expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
    })
})

describe('ModelForm with a layout of its own', () => {
    const layout = () => h('div', [
        h('fieldset', { 'data-testid': 'main' }, [h(ModelFormField, { name: 'title' }), h(ModelFormField, { name: 'seats', suffix: 'seats' })]),
        h(ModelFormField, { name: 'startDate' }),
    ])

    test('places fields with ModelFormField, which keeps their form options', () => {
        render(ModelForm, { props: { model: union(eventModel, formModel({ title: { label: 'Name' } })), modelValue: { ...validEvent } }, slots: { default: layout } })
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
