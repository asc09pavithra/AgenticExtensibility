import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import PrintJobServiceView from '../views/printJob/PrintJobServiceView'
import { DeviceContext } from '../common/DeviceContext'

jest.mock('../services/PrintJobService', () => {
    return function MockPrintJobService() {
        return {
            getCapabilities: jest.fn().mockResolvedValue({ capabilities: [] }),
            enumeratePrintJobAgents: jest.fn().mockResolvedValue({ agents: [] }),
            getPrintJobAgent: jest.fn().mockResolvedValue({ agent: {} }),
            createPrintJob: jest.fn().mockResolvedValue({ job: {} }),
            getPrintJob: jest.fn().mockResolvedValue({ job: {} }),
            cancelPrintJob: jest.fn().mockResolvedValue({})
        };
    };
});

describe('Print Job Service View', () => {

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

    test('Print Job Service Component Imports Successfully', async () => {
        const PrintJobView = require('../views/printJob/PrintJobServiceView').default;
        expect(PrintJobView).toBeDefined();
    })

    test('Print Job Service View Renders', async () => {
        const deviceContext = { 
            currentDevice: { 
                networkAddress: 'http://localhost:5000', 
                bindStatus: 'bound' 
            } 
        };
        
        const { getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <PrintJobServiceView />
            </DeviceContext.Provider>
        )

        await new Promise(resolve => setTimeout(resolve, 100));

        await waitFor(() => {
            expect(getByText('Print Job Service')).toBeInTheDocument()
            expect(getByText('Example interaction with the OXPd2 Print Job Service')).toBeInTheDocument()
        }, { timeout: 1000 })
    })

    test('Print Job Service Tabs Render Correctly', async () => {
        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
        };

        const { getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <PrintJobServiceView />
            </DeviceContext.Provider>
        );

        await new Promise(resolve => setTimeout(resolve, 100));

        await waitFor(() => {
            expect(getByText('Capabilities')).toBeInTheDocument()
            expect(getByText('Print Job Agents')).toBeInTheDocument()
        }, { timeout: 1000 })
    })

});
