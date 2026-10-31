import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { personJson, personModels } from '../test/models'
import ModelForm from './ModelForm.vue'
import { ModelsKey } from '../composables/useModels'

const person = {
    name: 'Ann',
    home: { city: 'Kyiv', street: 'Main st. 1', zip: '01001' },
    work: null,
    contacts: [
        { id: 1, kind: 'EMAIL', value: 'ann@example.com', since: null, until: null },
        { id: 2, kind: 'PHONE', value: '+380000000', since: null, until: null },
    ],
    manager: null,
}

function renderPerson(props: Record<string, unknown> = {}, global: Record<string, unknown> = {}) {
    return render(ModelForm, {
        props: { model: personJson, models: personModels, modelValue: structuredClone(person), ...props },
        global,
    })
}

const lastRecord = (emitted: Record<string, unknown[][]>) => emitted['update:modelValue']?.slice(-1)[0]?.[0] as any

/** The card of a sub-form or of a list item, by its title. */
const section = (title: string) => screen.getByText(title, { selector: '.v-card-title' }).closest('.v-card') as HTMLElement

describe('ModelForm with OBJECT fields', () => {
    test('edits OBJECT fields as JSON when the referenced models are not given', () => {
        renderPerson({ models: undefined })
        expect(screen.getByLabelText('Home').tagName).toBe('TEXTAREA')
    })

    test('edits a nested record with a sub-form', async () => {
        const { emitted } = renderPerson()
        const home = within(section('Home'))
        expect(home.getByText('Where the person lives')).toBeInTheDocument()
        expect(home.getByLabelText('City')).toHaveValue('Kyiv')
        await fireEvent.update(home.getByLabelText('City'), 'Lviv')
        expect(lastRecord(emitted()).home).toEqual({ ...person.home, city: 'Lviv' })
        expect(lastRecord(emitted()).name).toBe('Ann')
    })

    test('an empty optional nested record can be added and removed', async () => {
        const { emitted } = renderPerson()
        const work = within(section('Work'))
        expect(work.queryByLabelText('City')).toBeNull()
        await fireEvent.click(work.getByRole('button', { name: 'Add' }))
        expect(lastRecord(emitted()).work).toEqual({ city: null, street: null, zip: null })
        expect(work.getByLabelText('City')).toBeInTheDocument()
        await fireEvent.click(work.getByRole('button', { name: 'Remove' }))
        expect(lastRecord(emitted()).work).toBeNull()
    })

    test('a required nested record cannot be removed and must be given', async () => {
        const { emitted } = renderPerson({ modelValue: { ...structuredClone(person), home: null } })
        expect(within(section('Home')).queryByRole('button', { name: 'Remove' })).toBeNull()
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        expect(await screen.findByText('Home is required')).toBeInTheDocument()
        expect(emitted().submit).toBeUndefined()
    })

    test('invalid nested fields stop the submit', async () => {
        const { emitted } = renderPerson()
        await fireEvent.update(within(section('Home')).getByLabelText('Zip'), '12')
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        expect(await screen.findByText('Zip must match ^\\d{5}$')).toBeInTheDocument()
        expect(emitted().submit).toBeUndefined()
    })

    test('submits the record with its nested records', async () => {
        const { emitted } = renderPerson()
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        await waitFor(() => expect(emitted().submit).toEqual([[person]]))
    })

    test('edits a list of nested records', async () => {
        const { emitted } = renderPerson()
        expect(within(section('Contact 1')).getByLabelText('Value')).toHaveValue('ann@example.com')

        await fireEvent.click(screen.getByRole('button', { name: 'Move Contact 1 down' }))
        expect(lastRecord(emitted()).contacts.map((c: any) => c.id)).toEqual([2, 1])
        expect(within(section('Contact 1')).getByLabelText('Value')).toHaveValue('+380000000')

        await fireEvent.click(screen.getByRole('button', { name: 'Remove Contact 1' }))
        expect(lastRecord(emitted()).contacts.map((c: any) => c.id)).toEqual([1])

        await fireEvent.click(screen.getByRole('button', { name: 'Add contact' }))
        expect(lastRecord(emitted()).contacts).toHaveLength(2)
        await fireEvent.update(within(section('Contact 2')).getByLabelText('Value'), 'new@example.com')
        expect(lastRecord(emitted()).contacts[1]).toMatchObject({ id: null, value: 'new@example.com' })
    })

    test('keys of existing nested records are fixed, new ones can be entered', async () => {
        renderPerson()
        expect(within(section('Contact 1')).getByLabelText('Id')).toHaveAttribute('readonly')
        await fireEvent.click(screen.getByRole('button', { name: 'Add contact' }))
        expect(within(section('Contact 3')).getByLabelText('Id')).not.toHaveAttribute('readonly')
    })

    test('table-level checks of nested records are shown and stop the submit', async () => {
        const contacts = [{ id: 1, kind: 'EMAIL', value: 'a@b.c', since: '2026-02-01', until: '2026-01-01' }]
        const { emitted } = renderPerson({ modelValue: { ...structuredClone(person), contacts } })
        expect(within(section('Contact 1')).getByText('Until must be at least Since')).toBeInTheDocument()
        await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument())
        expect(emitted().submit).toBeUndefined()
    })

    test('a model can reference itself; its sub-forms appear only when added', async () => {
        renderPerson()
        const manager = within(section('Manager'))
        await fireEvent.click(manager.getByRole('button', { name: 'Add' }))
        expect(manager.getAllByText('Home', { selector: '.v-card-title' })).toHaveLength(1)
        expect(screen.getAllByLabelText('Name')).toHaveLength(2)
    })

    test('in view mode nested records are read-only', () => {
        renderPerson({ mode: 'view' })
        expect(within(section('Home')).getByLabelText('City')).toHaveAttribute('readonly')
        expect(screen.queryByRole('button', { name: 'Add' })).toBeNull()
        expect(screen.queryByRole('button', { name: 'Add contact' })).toBeNull()
    })

    test('models can be provided for the whole app', () => {
        renderPerson({ models: undefined }, { provide: { [ModelsKey as symbol]: personModels } })
        expect(within(section('Home')).getByLabelText('City')).toHaveValue('Kyiv')
    })
})
