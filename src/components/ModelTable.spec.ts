import { fireEvent, render, screen, within } from '@testing-library/vue'
import { h } from 'vue'
import { eventJson, eventModel } from '../test/models'
import ModelTable from './ModelTable.vue'

const events = [
    { id: 1, title: 'Concert', code: 'CON', seats: 1200, status: 'PUBLISHED', startDate: '2026-11-01', endDate: null, created: '2026-10-30T10:00:00Z' },
    { id: 2, title: 'Ball', code: 'BAL', seats: 80, status: 'DRAFT', startDate: '2026-12-31', endDate: '2027-01-01', created: null },
]

function renderTable(props: Record<string, unknown> = {}, slots: Record<string, any> = {}) {
    return render(ModelTable, { props: { model: eventModel, items: events, locale: 'en-US', ...props }, slots })
}

const columnTitles = () => screen.getAllByRole('columnheader').map(header => header.textContent?.trim())
const rows = () => screen.getAllByRole('row').slice(1)
const cells = (row: HTMLElement) => within(row).getAllByRole('cell').map(cell => cell.textContent?.trim())

describe('ModelTable', () => {
    test('has a column per field of the model', () => {
        renderTable()
        expect(columnTitles()).toEqual(['Id', 'Title', 'Code', 'Seats', 'Status', 'Start date', 'End date', 'Created'])
    })

    test('shows chosen fields in the given order', () => {
        renderTable({ fields: ['title', 'seats'] })
        expect(columnTitles()).toEqual(['Title', 'Seats'])
    })

    test('accepts the model in plain JSON form and excludes fields', () => {
        renderTable({ model: eventJson, exclude: ['id', 'created', 'code', 'status', 'endDate'] })
        expect(columnTitles()).toEqual(['Title', 'Seats', 'Start date'])
    })

    test('formats values by field type', () => {
        renderTable({ fields: ['title', 'seats', 'startDate', 'endDate'] })
        expect(cells(rows()[0])).toEqual(['Concert', '1,200', '11/1/2026', ''])
    })

    test('right-aligns numbers', () => {
        renderTable({ fields: ['title', 'seats'] })
        const [, seats] = within(rows()[0]).getAllByRole('cell')
        expect(seats).toHaveClass('v-data-table-column--align-end')
    })

    test('sorts by a column', async () => {
        renderTable({ fields: ['title', 'seats'] })
        await fireEvent.click(screen.getByText('Seats'))
        expect(rows().map(row => cells(row)[0])).toEqual(['Ball', 'Concert'])
    })

    test('a cell can be replaced with a slot that gets the field and the formatted value', () => {
        renderTable({ fields: ['title', 'seats'] }, {
            'item.seats': ({ formatted, item }: { formatted: string, item: any }) => h('b', `${formatted} seats for ${item.title}`),
        })
        expect(screen.getByText('1,200 seats for Concert')).toBeInTheDocument()
    })

    test('passes other slots to the data table', () => {
        renderTable({ items: [] }, { 'no-data': () => 'Nothing planned' })
        expect(screen.getByText('Nothing planned')).toBeInTheDocument()
    })

    test('reports row clicks with the record', async () => {
        const onClickRow = vi.fn()
        renderTable({ fields: ['title'], 'onClick:row': onClickRow })
        await fireEvent.click(screen.getByText('Ball'))
        expect(onClickRow).toHaveBeenCalledWith(expect.any(Event), expect.objectContaining({ item: events[1] }))
    })

    test('leaves paging to the server when the number of records is given', () => {
        renderTable({ itemsLength: 40, fields: ['title'] })
        expect(screen.getByText(/of 40$/)).toBeInTheDocument()
    })
})
