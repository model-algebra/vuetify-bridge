import { render } from '@testing-library/vue'
import VxButton from './VxButton.vue'

describe('VxButton', () => {
    const global = {
        stubs: {
            VProgressCircular: true
        }
    };

    test('renders slot content', () => {
        const { getByText } = render(VxButton, {
            slots: {
                default: 'Click me'
            }
        })

        getByText('Click me')
    })

    test('shows loading text when loading', () => {
        const { getByText, queryByText } = render(VxButton, {
            props: {
                loading: true,
                loadingText: 'Loading...'
            },
            slots: {
                default: 'Submit'
            },
            global
        })

        getByText('Loading...')
        expect(queryByText('Submit')).toBeNull()
    })

    test('button is disabled when loading', () => {
        const { container } = render(VxButton, {
            props: {
                loading: true
            },
            global
        })

        const button = container.querySelector('button')
        expect(button).toBeDisabled()
    })
})
