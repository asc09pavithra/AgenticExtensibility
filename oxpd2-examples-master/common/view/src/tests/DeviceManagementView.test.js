import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from '../App'
import TargetDevice from '../views/deviceManagement/DeviceManagementView'
import DeviceServicesDiscovery from '../views/deviceManagement/DeviceManagementView'
import DeviceInformation from '../views/deviceManagement/DeviceManagementView'
import { DeviceContext } from '../common/DeviceContext'

describe('DeviceManagementView', () => {

    const originalWarn = console.warn.bind(console.warn)
    const originalError = console.error.bind(console.error)
    const service = require('../services/DeviceManagementService')
    jest.mock('../services/DeviceManagementService', () => ({ 
        passwordGrant: jest.fn(),
        bindDevice: jest.fn(),
        unbindDevice: jest.fn(),
        getCurrentDevice: jest.fn(),
        getDeviceServicesDiscovery: jest.fn(),
        getDeviceInfo: jest.fn(),
        getTokens: jest.fn()
    }))

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

    test('Device Management View', () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } };
        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <TargetDevice />
            </DeviceContext.Provider>
        );
        const { getByText } = within(getByTestId('device-view'));
        const expectedTitle = 'Device Management'
        const expectedDesc = 'Target and connect to an OXPd2 device so that it can be used with the examples.'
        expect(getByText(expectedTitle)).toBeInTheDocument()
        expect(getByText(expectedDesc)).toBeInTheDocument()
    });

    test('Device Information Card', () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } };
        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <TargetDevice />
            </DeviceContext.Provider>
        )
        // get the text within the device card
        const { getByText } = within(getByTestId('device-info-card'))
        expect(getByText('Device Information')).toBeInTheDocument()
    });

    test('Target Device Card', () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } };
        const { getByTestId, getByRole, getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <TargetDevice />
            </DeviceContext.Provider>
        )

        // get text within the target device card
        var { getByText: getCardText } = within(getByTestId('target-device-card'))
        expect(getCardText('Target Device')).toBeInTheDocument()

        // TODO - add more user behaviour
        // are buttons on screen?
        expect(getByRole("button", { name: 'Bind' })).toBeInTheDocument()
        expect(getByRole("button", { name: 'Unbind' })).toBeInTheDocument()
        expect(getByRole("button", { name: 'Get/Refresh Admin Token' })).toBeInTheDocument()
        expect(getByTestId('device-refresh')).toBeInTheDocument()

        // are the token chips on the screen
        expect(getByText('Invalid UI Context Token')).toBeInTheDocument()
        expect(getByText('Invalid Admin Token')).toBeInTheDocument()
        expect(getByText('Invalid Solution Token')).toBeInTheDocument()
        expect(getByText('Device Bound')).toBeInTheDocument()
    });

    test('Click Load/Refresh', () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000' } }
        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <TargetDevice />
            </DeviceContext.Provider>
        )

        var deviceRefreshButton = getByTestId('device-refresh')
        expect(deviceRefreshButton.closest('button')).toBeEnabled()
    });

    test('Click Bind/Unbind', () => {
        const deviceContext = { currentDevice: { networkAddress: '' } }
        const { getByLabelText, getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <TargetDevice />
            </DeviceContext.Provider>
        )
        
        const input = getByLabelText('Device Network Address')
        expect(input).toBeInTheDocument()

        var bindButton = getByTestId('bind')
        expect(bindButton.closest('button')).toBeInTheDocument()
        
        var unbindButton = getByTestId('unbind')
        expect(unbindButton.closest('button')).toBeInTheDocument()
    });

    test('Click Get/Refresh Admin Token', () => {
        const deviceContext = { currentDevice: { networkAddress: '123.456.789.123' } }
        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <TargetDevice />
            </DeviceContext.Provider>
        )
        const getTokenButton = getByTestId('admin-token')
        expect(getTokenButton).toBeInTheDocument()
    });

    test('Device Services Discovery', () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } }
        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <DeviceServicesDiscovery />
            </DeviceContext.Provider>
        )

        var deviceServicesButton = getByTestId('device-services')
        expect(deviceServicesButton.closest('button')).toBeEnabled()

        var copyServicesButton = getByTestId('copy-services')
        expect(copyServicesButton.closest('button')).toBeEnabled()
    });

    test('Device Information', () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } }
        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <DeviceInformation />
            </DeviceContext.Provider>
        )

        var deviceInformationButton = getByTestId('device-information')
        expect(deviceInformationButton.closest('button')).toBeEnabled()

        var copyDeviceInfoButton = getByTestId('copy-device-info')
        expect(copyDeviceInfoButton.closest('button')).toBeEnabled()
    });

    test('Click Get/Refresh Admin Token Alert', () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } }

        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <TargetDevice />
            </DeviceContext.Provider>
        )
        const getTokenButton = getByTestId('admin-token')
        expect(getTokenButton).toBeInTheDocument()
    });
});

