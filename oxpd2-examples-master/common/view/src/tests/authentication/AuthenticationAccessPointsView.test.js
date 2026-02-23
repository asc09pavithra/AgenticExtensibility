import { fireEvent, render, waitFor, screen, within, getByTestId, findByTestId, getByLabelText } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Sidebar from '../../App'
import Capabilities from '../../common/Capabilities';
import { AuthenticationAccessPointsTabContent } from '../../views/authentication/AuthenticationAccessPoints';
import AuthenticationAgentsTabs from '../../views/authentication/AuthenticationServiceView'
import { DeviceContext } from '../../common/DeviceContext'

import authenticationAccessPoints from '../../../mock-api/authentication/authenticationAccessPoints/GET.json';
import authenticationAccessPoint from '../../../mock-api/authentication/authenticationAccessPoints/13b56347-9f94-403f-8d60-552f75ee3d99/GET.json'

describe('AuthenticationAccessPoints View', () => {
    const originalWarn = console.warn.bind(console.warn)
    const originalError = console.error.bind(console.error)
    const service = require('../../services/AuthenticationService')
    jest.mock('../../services/AuthenticationService', () => ({ enumerateAuthenticationAccessPoints: jest.fn(), getAuthenticationAccessPoint: jest.fn() }))


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

    test('Authentication AccessPoints Buttons', async () => {

        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', currentAccessToken: "token" } }
        console.log = jest.fn();
        service.enumerateAuthenticationAccessPoints.mockReturnValue(authenticationAccessPoints)

        const user = userEvent.setup();

        const { getByLabelText, getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <AuthenticationAccessPointsTabContent service={service} />
            </DeviceContext.Provider>
        )

        console.error(authenticationAccessPoints)

        const loadRefresh = getByTestId('authentication-access-points-load-refresh')
        expect(loadRefresh).toBeInTheDocument()
        await waitFor(() => expect(loadRefresh).toBeEnabled())
        await user.click(loadRefresh)

        const apiResponse = getByTestId('authentication-access-points-api-response')
        expect(apiResponse).toBeInTheDocument()
        fireEvent.click(apiResponse)
    });

    test('Authentication AccessPoint', async () => {

        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', currentAccessToken: "token" } }
        console.log = jest.fn();
        service.enumerateAuthenticationAccessPoints.mockReturnValue(authenticationAccessPoints)
        service.getAuthenticationAccessPoint.mockReturnValue(authenticationAccessPoint)

        const user = userEvent.setup();

        const { getByText, getByDisplayValue, getAllByDisplayValue } = render(
            <DeviceContext.Provider value={deviceContext}>
                <AuthenticationAccessPointsTabContent service={service} />
            </DeviceContext.Provider>
        )
        await waitFor(() => expect(getByText(/Electric/)).toBeInTheDocument())

        const tc = getByText(/Electric/)
    });
});

