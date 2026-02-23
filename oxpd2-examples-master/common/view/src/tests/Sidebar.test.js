// Sidebar Tests
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Sidebar from '../App'

describe('Sidebar', () => {

    const originalWarn = console.warn.bind(console.warn)
    const originalError = console.error.bind(console.error)
    beforeAll(() => {
        // Ignoring this specific console warning
        console.warn = (msg) =>
            !msg.toString().includes('use a basename on a page whose URL path does not begin with the basename') && originalWarn(msg)
        // Ignoring this specific console error
        console.error = (msg) =>
            !msg.toString().includes('The prop `to` is marked as required in `Link`, but its value is `undefined`.')
    })
    afterAll(() => {
        console.warn = originalWarn
        console.error = originalError
    })

    test('Sidebar Introduction Click', async () => {
        // render sidebar and click introduction button
        const user = userEvent.setup();
        const { getByTestId } = render(<Sidebar />);
        await user.click(screen.getByText('Introduction'))
        const { getByText } = within(getByTestId('sidebar-list'))
        expect(getByText('Introduction')).toBeInTheDocument()

        const expectedIntroduction = 'Introduction to the OXPd2 Examples'
        const expectedIntroductionDesc = 'A wonderful introduction to the OXPd2 examples follows. Details about how to navigate and use the app are provided as well.'
        expect(screen.getByText(expectedIntroduction)).toBeInTheDocument();
        expect(screen.getByText(expectedIntroductionDesc)).toBeInTheDocument();
    });

    test('Sidebar Device Management Click', async () => {
        // render sidebar and click the device management button
        const user = userEvent.setup();
        const { getByTestId } = render(<Sidebar />)
        await user.click(screen.getByTestId('device-button'))
        // get the text within the sidebar list
        const { getByText } = within(getByTestId('sidebar-list'))
        expect(getByText('Device Management')).toBeInTheDocument()
    });

});
