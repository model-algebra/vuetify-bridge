import { fireEvent, render, screen } from '@testing-library/vue'
import { allTypesJson, eventModel, field } from '../../test/models'
import ModelField from './ModelField.vue'
import type { FieldLike } from '../../schema'

function renderField(f: FieldLike, modelValue: unknown = null, props: Record<string, unknown> = {}) {
    return render(ModelField, { props: { field: f, modelValue, ...props } })
}

const lastValue = (emitted: Record<string, unknown[][]>) => emitted['update:modelValue']?.slice(-1)[0]?.[0]

describe('ModelField', () => {
    test('shows the label and the description as hint', async () => {
        renderField(field(eventModel, 'title'))
        expect(screen.getByLabelText('Title')).toBeInTheDocument()
        await fireEvent.focus(screen.getByLabelText('Title'))
        expect(await screen.findByText('Shown in the calendar')).toBeInTheDocument()
    })

    test('emits numbers for numeric fields', async () => {
        const { emitted } = renderField(field(eventModel, 'seats'))
        const input = screen.getByLabelText('Seats')
        expect(input).toHaveAttribute('type', 'number')
        await fireEvent.update(input, '42')
        expect(lastValue(emitted())).toBe(42)
        await fireEvent.update(input, '')
        expect(lastValue(emitted())).toBeNull()
    })

    test('shows constraint violations', async () => {
        renderField(field(eventModel, 'seats'))
        await fireEvent.update(screen.getByLabelText('Seats'), '0')
        expect(await screen.findByText('Seats must be at least 1')).toBeInTheDocument()
    })

    test('uses overridden messages', async () => {
        renderField(field(eventModel, 'code'), null, { messages: { pattern: (label: string) => `${label}: three capitals` } })
        await fireEvent.update(screen.getByLabelText('Code'), 'ab')
        expect(await screen.findByText('Code: three capitals')).toBeInTheDocument()
    })

    test('shows the value given by the parent and follows its changes', async () => {
        const { rerender } = renderField(field(eventModel, 'title'), 'Concert')
        expect(screen.getByLabelText('Title')).toHaveValue('Concert')
        await rerender({ modelValue: 'Party' })
        expect(screen.getByLabelText('Title')).toHaveValue('Party')
    })

    test('uses native date inputs', async () => {
        const { emitted } = renderField(field(eventModel, 'startDate'), '2026-10-31')
        const input = screen.getByLabelText('Start date')
        expect(input).toHaveAttribute('type', 'date')
        expect(input).toHaveValue('2026-10-31')
        await fireEvent.update(input, '2026-11-01')
        expect(lastValue(emitted())).toBe('2026-11-01')
    })

    test('limits the length of STRING fields with a counter', () => {
        renderField(field(eventModel, 'title'), 'abc')
        expect(screen.getByText('3 / 20')).toBeInTheDocument()
    })

    test('edits booleans with a checkbox', async () => {
        const { emitted } = renderField(field(allTypesJson, 'booleanField'), false)
        await fireEvent.click(screen.getByLabelText('Boolean field'))
        expect(lastValue(emitted())).toBe(true)
    })

    test('edits JSON as text and keeps the last valid value while the text is invalid', async () => {
        const { emitted } = renderField(field(allTypesJson, 'jsonField'), { a: 1 })
        const input = screen.getByLabelText('Json field')
        expect(input.tagName).toBe('TEXTAREA')
        await fireEvent.update(input, '{"a": 2}')
        expect(lastValue(emitted())).toEqual({ a: 2 })
        await fireEvent.update(input, '{"a": ')
        expect(await screen.findByText('Json field must be valid JSON')).toBeInTheDocument()
        expect(lastValue(emitted())).toEqual({ a: 2 })
    })

    test('chooses enum values from a select', async () => {
        const { emitted } = renderField(field(eventModel, 'status'))
        await fireEvent.mouseDown(screen.getByLabelText('Status'))
        await fireEvent.click(await screen.findByText('PUBLISHED'))
        expect(lastValue(emitted())).toBe('PUBLISHED')
    })

    test('shows unsupported types read-only', () => {
        renderField(field(allTypesJson, 'bytesField'), new Uint8Array(4))
        const input = screen.getByLabelText('Bytes field')
        expect(input).toHaveValue('4 bytes')
        expect(input).toHaveAttribute('readonly')
    })

    test('can be read-only', () => {
        renderField(field(eventModel, 'title'), 'Concert', { readonly: true })
        expect(screen.getByLabelText('Title')).toHaveAttribute('readonly')
    })

    test('passes other attributes to the Vuetify component', () => {
        renderField(field(eventModel, 'title'), null, { placeholder: 'Name it' })
        expect(screen.getByLabelText('Title')).toHaveAttribute('placeholder', 'Name it')
    })
})
