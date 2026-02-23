import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import CopyTabs from '../views/copy/CopyView'
import { DeviceContext } from '../common/DeviceContext'

jest.mock('../services/CopyService', () => {
    return function MockCopyService() {
        return {
            getCapabilities: jest.fn().mockResolvedValue({ capabilities: [] }),
            getCopyDefaultOptions: jest.fn().mockResolvedValue({ options: [] }),
            getCopyProfile: jest.fn().mockResolvedValue({ profile: {} }),
            getCopyJob: jest.fn().mockResolvedValue({ job: {} })
        };
    };
});

describe('Copy Service View', () => {

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

    test('Copy Service Component Imports Successfully', async () => {
        const CopyView = require('../views/copy/CopyView').default;
        expect(CopyView).toBeDefined();
    })

    test('Copy Service View Renders', async () => {
        const deviceContext = { 
            currentDevice: { 
                networkAddress: 'http://localhost:5000', 
                bindStatus: 'bound' 
            } 
        };
        
        const { getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <CopyTabs />
            </DeviceContext.Provider>
        )

        await new Promise(resolve => setTimeout(resolve, 100));

        await waitFor(() => {
            expect(getByText('Copy Service')).toBeInTheDocument()
            expect(getByText('Example interaction with the OXPd2 Copy Service')).toBeInTheDocument()
        }, { timeout: 1000 })
    })

    test('Copy Service Tabs Render Correctly', async () => {
        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
        };

        const { getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <CopyTabs />
            </DeviceContext.Provider>
        );

        await new Promise(resolve => setTimeout(resolve, 100));

        await waitFor(() => {
            expect(getByText('Capabilities')).toBeInTheDocument()
            expect(getByText('Default Options')).toBeInTheDocument()
            expect(getByText('Profile')).toBeInTheDocument()
            expect(getByText('Copy Agents')).toBeInTheDocument()
            expect(getByText('Copy Agent Logs')).toBeInTheDocument()
        }, { timeout: 1000 })
    })
});
