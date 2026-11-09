import { fireEvent, render, screen, within } from '@testing-library/vue'
import type { ModelLike } from '../schema'
import ModelTable from './ModelTable.vue'

const person: ModelLike = {
    metadata: { name: 'Person' },
    fields: [
        { name: 'id', type: 'INT32', primaryKey: true } as any,
        { name: 'lastName', type: 'STRING', parameters: { length: 50 }, sortable: { plain: {}, caseless: { function: 'lower' } },
          filterable: { prefix: { predicate: 'startsWith', argument: true } } },
        { name: 'age', type: 'INT16', sortable: true, filterable: { ops: ['>='] } },
        { name: 'email', type: 'TEXT' },
    ],
    sortings: { byAge: [{ field: 'age', direction: 'desc' }] },
    filters: { adults: { field: 'age', op: '>=', value: 18 } },
}

const people = [
    { id: 1, lastName: 'smith', age: 30, email: 's@x' },
    { id: 2, lastName: 'Adams', age: 12, email: 'a@x' },
    { id: 3, lastName: 'Brown', age: 45, email: 'b@x' },
    { id: 4, lastName: 'adler', age: 20, email: 'd@x' },
]

const functions = { lower: (v: unknown) => String(v).toLowerCase() }
const predicates = { startsWith: (v: unknown, _row: unknown, arg: unknown) => String(v).toLowerCase().startsWith(String(arg).toLowerCase()) }

/** A person whose name has an unnamed sort definition and a named one, and a code that sorts one way only. */
const namedPerson: ModelLike = {
    metadata: { name: 'NamedPerson' },
    fields: [
        { name: 'id', type: 'INT32', primaryKey: true } as any,
        { name: 'name', type: 'STRING', sortable: { caseless: { function: 'lower' }, '': {} } },
        { name: 'code', type: 'STRING', sortable: { direction: 'asc' } },
    ],
}

const namedPeople = [
    { id: 1, name: 'Adams', code: 'b' },
    { id: 2, name: 'adams', code: 'a' },
]

function renderTable(props: Record<string, unknown> = {}) {
    return render(ModelTable, { props: { model: person, items: people, locale: 'en-US', functions, predicates, ...props } })
}

function renderNamedTable(props: Record<string, unknown> = {}) {
    return render(ModelTable, { props: { model: namedPerson, items: namedPeople, locale: 'en-US', functions, ...props } })
}

const rows = () => screen.getAllByRole('row').slice(1)
const names = () => rows().map(row => within(row).getAllByRole('cell')[1].textContent?.trim())

describe('ModelTable of a model that declares sorting and filtering', () => {
    test('sorts only by columns of sortable fields', async () => {
        renderTable()
        const header = (title: string) => screen.getByRole('columnheader', { name: title })
        expect(header('Age')).toHaveClass('v-data-table__th--sortable')
        expect(header('Email')).not.toHaveClass('v-data-table__th--sortable')
        await fireEvent.click(within(header('Age')).getByText('Age'))
        expect(names()).toEqual(['Adams', 'adler', 'smith', 'Brown'])
    })

    test('sorts a column by the first definition of the field', async () => {
        const onSort = vi.fn()
        renderTable({ 'onUpdate:sort': onSort })
        await fireEvent.click(screen.getByText('Last name'))
        expect(names()).toEqual(['Adams', 'adler', 'Brown', 'smith'])
        expect(onSort).toHaveBeenLastCalledWith([{ key: 'lastName', order: 'asc' }])
    })

    test('sorts by sort orders of the model and other definitions of fields', () => {
        renderTable({ sort: [{ key: 'byAge', order: 'asc' }] })
        expect(names()).toEqual(['Brown', 'smith', 'adler', 'Adams'])
    })

    test('uses the functions the definitions name', () => {
        renderTable({ sort: [{ key: 'lastName.caseless', order: 'asc' }] })
        expect(names()).toEqual(['Adams', 'adler', 'Brown', 'smith'])
    })

    test('filters with values given in the filter bar', async () => {
        renderTable()
        await fireEvent.update(screen.getByLabelText('Age ≥'), '20')
        expect(names()).toEqual(['smith', 'Brown', 'adler'])
        await fireEvent.update(screen.getByLabelText('Last name: prefix'), 'ad')
        expect(names()).toEqual(['adler'])
    })

    test('filters with switches', async () => {
        const onFilters = vi.fn()
        renderTable({ 'onUpdate:filters': onFilters })
        await fireEvent.click(screen.getByLabelText('Adults'))
        expect(names()).toEqual(['smith', 'Brown', 'adler'])
        expect(onFilters).toHaveBeenLastCalledWith({ adults: true })
    })

    test('offers sort orders that are not columns', () => {
        renderTable()
        expect(screen.getByLabelText('Sort by')).toBeInTheDocument()
    })

    test('hides the filter bar when asked to', () => {
        renderTable({ filterBar: false })
        expect(screen.queryByLabelText('Adults')).not.toBeInTheDocument()
    })

    test('pages the filtered records', () => {
        renderTable({ itemsPerPage: 2, filters: { adults: true } })
        expect(names()).toEqual(['smith', 'Brown'])
        expect(screen.getByText(/of 3$/)).toBeInTheDocument()
    })

    test('with the number of records, leaves the work to the server and reports the query', async () => {
        const onQuery = vi.fn()
        renderTable({ itemsLength: 40, itemsPerPage: 2, 'onUpdate:query': onQuery })
        expect(names()).toEqual(['smith', 'Adams', 'Brown', 'adler'])
        expect(onQuery).toHaveBeenLastCalledWith({ limit: 2, offset: 0 })
        await fireEvent.click(screen.getByLabelText('Adults'))
        await fireEvent.click(screen.getByText('Last name'))
        expect(onQuery).toHaveBeenLastCalledWith({ limit: 2, offset: 0, sort: 'lastName.plain', adults: true })
    })
})

describe('ModelTable of a model with several sort definitions of a field', () => {
    test('sorts a column by the most relevant definition of its field', async () => {
        const onSort = vi.fn()
        renderNamedTable({ 'onUpdate:sort': onSort })
        await fireEvent.click(screen.getByText('Name'))
        expect(onSort).toHaveBeenLastCalledWith([{ key: 'name', order: 'asc' }])
        // The plain value, not the caseless one: 'adams' comes before 'Adams'
        expect(names()).toEqual(['adams', 'Adams'])
    })

    test('offers the other definitions of the field in the filter bar', async () => {
        renderNamedTable()
        await fireEvent.mouseDown(screen.getByLabelText('Sort by'))
        expect(screen.getByText('Name: caseless')).toBeInTheDocument()
    })

    test('changes the sort order when the column is clicked again', async () => {
        const onSort = vi.fn()
        renderNamedTable({ 'onUpdate:sort': onSort })
        await fireEvent.click(screen.getByText('Name'))
        expect(onSort).toHaveBeenLastCalledWith([{ key: 'name', order: 'asc' }])
        await fireEvent.click(screen.getByText('Name'))
        expect(onSort).toHaveBeenLastCalledWith([{ key: 'name', order: 'desc' }])
        expect(names()).toEqual(['Adams', 'adams'])
        await fireEvent.click(screen.getByText('Name'))
        expect(onSort).toHaveBeenLastCalledWith([])
    })

    test('a column that sorts one way only is unsorted by the next click', async () => {
        const onSort = vi.fn()
        renderNamedTable({ 'onUpdate:sort': onSort })
        await fireEvent.click(screen.getByText('Code'))
        expect(onSort).toHaveBeenLastCalledWith([{ key: 'code', order: 'asc' }])
        await fireEvent.click(screen.getByText('Code'))
        expect(onSort).toHaveBeenLastCalledWith([])
    })

    test('shows the column of a sort order as sorted', () => {
        renderNamedTable({ sort: [{ key: 'name.caseless', order: 'asc' }] })
        expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveClass('v-data-table__th--sorted')
    })
})
