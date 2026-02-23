import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Capabilities from '../../common/Capabilities';
import { DeviceContext } from '../../common/DeviceContext';

jest.mock('../../services/AuthenticationService', () => {
    return function MockAuthenticationService() {
        return {
            getCapabilities: jest.fn().mockResolvedValue({ 
                initialized: true,
                apiVersion: '1.0',
                description: 'Authentication Service',
                implVersion: '1.0.0'
            }),
            enumerateAuthenticationAgents: jest.fn().mockResolvedValue([]),
            enumerateAuthenticationAccessPoints: jest.fn().mockResolvedValue([])
        };
    };
});

import AuthenticationService from '../../services/AuthenticationService';

afterEach(() => {
    cleanup();
});

describe('Authentication Service View', () => {
    const mockDeviceContext = {
        currentDevice: {
            networkAddress: "http://localhost:5000",
            bindStatus: "bound",
        },
    };

    test('Authentication Capabilities component renders', () => {
        const mockCapabilities = {
            initialized: true,
            apiVersion: '1.0',
            description: 'Authentication Service',
            implVersion: '1.0.0'
        };

        const authService = new AuthenticationService();

        render(
            <DeviceContext.Provider value={mockDeviceContext}>
                <Capabilities
                    service={authService}
                    currentCapabilities={mockCapabilities}
                    setCapabilities={jest.fn()}
                    postAlert={jest.fn()}
                    initialLoad={false}
                    setInitialLoad={jest.fn()}
                />
            </DeviceContext.Provider>
        );

        // Verify capabilities content is rendered
        expect(screen.getByText('Capabilities')).toBeInTheDocument();
    });

    test('Authentication Capabilities shows load/refresh button', () => {
        const mockCapabilities = {
            initialized: true,
            apiVersion: '1.0'
        };

        const authService = new AuthenticationService();

        render(
            <DeviceContext.Provider value={mockDeviceContext}>
                <Capabilities
                    service={authService}
                    currentCapabilities={mockCapabilities}
                    setCapabilities={jest.fn()}
                    postAlert={jest.fn()}
                    initialLoad={false}
                    setInitialLoad={jest.fn()}
                />
            </DeviceContext.Provider>
        );

        // Verify load/refresh button is present
        const loadButton = screen.getByTestId('load-refresh-capabilities');
        expect(loadButton).toBeInTheDocument();
        expect(loadButton).toHaveTextContent('Load/Refresh');
    });

    test('Authentication Capabilities displays capability data', () => {
        const mockCapabilities = {
            initialized: true,
            apiVersion: '1.0',
            description: 'Authentication Service',
            implVersion: '1.0.0',
            serviceUrl: 'http://localhost:5000/authentication'
        };

        const authService = new AuthenticationService();

        render(
            <DeviceContext.Provider value={mockDeviceContext}>
                <Capabilities
                    service={authService}
                    currentCapabilities={mockCapabilities}
                    setCapabilities={jest.fn()}
                    postAlert={jest.fn()}
                    initialLoad={false}
                    setInitialLoad={jest.fn()}
                />
            </DeviceContext.Provider>
        );

        // Verify the capabilities component renders with data
        expect(screen.getByText('Capabilities')).toBeInTheDocument();
        
        // Verify API response button is present
        const apiButton = screen.getByTestId('get-api-response');
        expect(apiButton).toBeInTheDocument();
        expect(apiButton).toHaveTextContent('Show API Response');
    });

    test('Authentication Service mock works correctly', () => {
        // Test that our service mock is functioning
        const service = new AuthenticationService();
        
        expect(service.getCapabilities).toBeDefined();
        expect(typeof service.getCapabilities).toBe('function');
    });
});

