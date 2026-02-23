import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Header from '../App'
import Footer from '../App'
import DeviceStatus from '../App'
import App from '../App'
import Sidebar from '../App'
import { DeviceContext } from '../common/DeviceContext'
import * as service from '../services/DeviceManagementService'

describe('App', () => {

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

    test('Examples App Title', () => {
        const { getByTestId } = render(<Header />);
        const { getByText } = within(getByTestId('app-header'));
        const expectedTitle = 'OXPd2 Examples'
        expect(getByText(expectedTitle)).toBeInTheDocument();
    });

    test('Examples App Copyright', () => {
        const { getByTestId } = render(<Footer />);
        const { getByText } = within(getByTestId('app-footer'));
        const expectedString = 'Copyright © HP Inc. ' + new Date().getFullYear()
        expect(getByText(expectedString)).toBeInTheDocument();
    });

    test('Status Avatars', () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound', adminAccessTokenStatus: 'Granted' } }
        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <DeviceStatus />
            </DeviceContext.Provider>
        )
        const deviceStatusAvatar = getByTestId('device-status-avatar')
        expect(deviceStatusAvatar).toBeInTheDocument()
        expect(deviceStatusAvatar).toHaveStyle('backgroundColor: green[500]')

        const tokenStatusAvatar = getByTestId('token-status-avatar')
        expect(tokenStatusAvatar).toBeInTheDocument()
        expect(tokenStatusAvatar).toHaveStyle('backgroundColor: green[500]')
    });

    test('App List', async () => {
        const user = userEvent.setup();

        const deviceContext = {
            currentDevice: {
                networkAddress: 'http://localhost:5000',
                bindStatus: 'bound',
                adminAccessTokenStatus: 'Granted'
            }
        }

        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <Sidebar />
            </DeviceContext.Provider>
        )

        const sidebar = getByTestId('sidebar-list')
        expect(sidebar).toBeInTheDocument()
        await user.click(sidebar)

        const home = getByTestId('home-button')
        expect(home).toBeInTheDocument()
        await user.click(home)

        const deviceManagement = getByTestId('device-management-button')
        expect(deviceManagement).toBeInTheDocument()
        await user.click(deviceManagement)

        const solution = getByTestId('solution-button')
        expect(solution).toBeInTheDocument()
        await user.click(solution)

        const application = getByTestId('application-button')
        expect(application).toBeInTheDocument()
        await user.click(application)

        const jobStatistics = getByTestId('job-statistics-button')
        expect(jobStatistics).toBeInTheDocument()
        await user.click(jobStatistics)

        const print = getByTestId('print-button')
        expect(print).toBeInTheDocument()
        await user.click(print)

        const device = getByTestId('device-button')
        expect(device).toBeInTheDocument()
        await user.click(device)
    });

});
