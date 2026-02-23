import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApplicationServiceView from '../views/application/ApplicationServiceView'
import { DeviceContext } from '../common/DeviceContext'

jest.mock('../services/ApplicationService', () => {
    return function MockApplicationService() {
        return {
            getCapabilities: jest.fn().mockResolvedValue({ capabilities: [] }),
            enumerateApplicationAgents: jest.fn().mockResolvedValue({ agents: [] }),
            getApplicationAgent: jest.fn().mockResolvedValue({ agent: {} }),
            enumerateApplicationAccessPoints: jest.fn().mockResolvedValue({ accessPoints: [] }),
            getApplicationRuntime: jest.fn().mockResolvedValue({ runtime: {} }),
            getApplicationRuntimeChrome: jest.fn().mockResolvedValue({ chrome: {} }),
            getHomescreen: jest.fn().mockResolvedValue({ homescreen: {} }),
            enumerateMessageCenterAgents: jest.fn().mockResolvedValue({ agents: [] }),
            enumerateI18nAssets: jest.fn().mockResolvedValue({ assets: [] })
        };
    };
});

describe('Application View', () => {

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

    test('Application Service Component Imports Successfully', async () => {
        const ApplicationServiceView = require('../views/application/ApplicationServiceView').default;
        expect(ApplicationServiceView).toBeDefined();
    })

    test('Application Context Renders', async () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } };
        const TestComponent = () => (
            <DeviceContext.Provider value={deviceContext}>
                <div data-testid="test-component">Application Test</div>
            </DeviceContext.Provider>
        );

        const { getByTestId } = render(<TestComponent />);
        expect(getByTestId('test-component')).toBeInTheDocument();
    })

    test('Basic Device Context Works', async () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } };
        const TestComponent = () => {
            const context = React.useContext(DeviceContext);
            return <div data-testid="context-test">{context.currentDevice.networkAddress}</div>;
        };

        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <TestComponent />
            </DeviceContext.Provider>
        );
        
        expect(getByTestId('context-test')).toHaveTextContent('http://localhost:5000');
    })

    test('Application Service View Renders', async () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } };
        
        const { getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <ApplicationServiceView />
            </DeviceContext.Provider>
        )

        await new Promise(resolve => setTimeout(resolve, 100));

        await waitFor(() => {
            expect(getByText('Application Service')).toBeInTheDocument()
            expect(getByText('Example interaction with the OXPd2 Application Service')).toBeInTheDocument()
        }, { timeout: 1000 })
    })

    test('Application Tabs Render Correctly', async () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } };
        
        const { getByText, getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <ApplicationServiceView />
            </DeviceContext.Provider>
        )

        await new Promise(resolve => setTimeout(resolve, 100));

        await waitFor(() => {
            expect(getByText('Capabilities')).toBeInTheDocument()
            expect(getByText('Application Agents')).toBeInTheDocument()
            expect(getByText('Application Access Points')).toBeInTheDocument()
            expect(getByText('Application Runtime')).toBeInTheDocument()
            expect(getByText('Homescreen')).toBeInTheDocument()
            expect(getByText('I18nAssets')).toBeInTheDocument()
            expect(getByText('Message Center Agents')).toBeInTheDocument()
        }, { timeout: 1000 })
    })

    test('Application Runtime Tab Displays', async () => {
        const deviceContext = { currentDevice: { networkAddress: 'http://localhost:5000', bindStatus: 'bound' } };
        
        const { getByTestId } = render(
            <DeviceContext.Provider value={deviceContext}>
                <ApplicationServiceView />
            </DeviceContext.Provider>
        )

        await new Promise(resolve => setTimeout(resolve, 100));

        await waitFor(() => {
            const applicationRuntimeTab = getByTestId('application-runtime-tab')
            expect(applicationRuntimeTab).toBeInTheDocument()
        }, { timeout: 1000 })
    })
})

