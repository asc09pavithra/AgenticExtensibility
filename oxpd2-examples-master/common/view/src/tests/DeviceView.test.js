import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import DeviceTabs from '../views/device/DeviceView'
import { DeviceContext } from '../common/DeviceContext'

jest.mock('../services/DeviceService', () => {
    return function MockDeviceService() {
        return {
            getCapabilities: jest.fn().mockResolvedValue({ capabilities: [] }),
            getIdentity: jest.fn().mockResolvedValue({ identity: {} }),
            getStatus: jest.fn().mockResolvedValue({ status: {} }),
            getInformation: jest.fn().mockResolvedValue({ information: {} })
        };
    };
});

describe('Device Service View', () => {

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

    test('Device Service Component Imports Successfully', async () => {
        const DeviceView = require('../views/device/DeviceView').default;
        expect(DeviceView).toBeDefined();
    })

    test('Device Service View Renders', async () => {
        const deviceContext = { 
            currentDevice: { 
                networkAddress: 'http://localhost:5000', 
                bindStatus: 'bound' 
            } 
        };
        
        const { getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <DeviceTabs />
            </DeviceContext.Provider>
        )

        // Wait a bit for async rendering
        await new Promise(resolve => setTimeout(resolve, 100));

        await waitFor(() => {
            expect(getByText('Device Service')).toBeInTheDocument()
            expect(getByText('Example interaction with the OXPd2 Device Service')).toBeInTheDocument()
        }, { timeout: 1000 })
    })

    test('Device Service Tabs Render Correctly', async () => {
        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
        };

        const { getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <DeviceTabs />
            </DeviceContext.Provider>
        );

        await new Promise(resolve => setTimeout(resolve, 100));

        await waitFor(() => {
            expect(getByText('Capabilities')).toBeInTheDocument()
            expect(getByText('Identity')).toBeInTheDocument()
            expect(getByText('Status')).toBeInTheDocument()
        }, { timeout: 1000 })
    })
});
