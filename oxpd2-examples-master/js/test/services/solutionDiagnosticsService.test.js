import { describe, expect, jest, test, fail } from '@jest/globals';
import deviceManagementService from '../../src/services/deviceManagementService.js';
import { BoundDevice } from '../../src/models/boundDevice.js';
import solutionDiagnosticsService from '../../src/services/solutionDiagnosticsService.js';
import errors from '../../src/services/errors.js';
import oxpd2 from 'oxpd2';
global.fetch = jest.fn();

function GetBasicServicesDiscovery() {
    let servicesDiscovery = new oxpd2.CommonTypes.ServicesDiscovery();
    servicesDiscovery.version = "1.0.0";

    let services = [];
    let metadata = new oxpd2.CommonTypes.ServiceMetadata();
    metadata.version = "1.0.0";
    metadata.serviceGun = "com.hp.ext.service.solutionDiagnostics.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/solutionDiagnostics/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/solutionDiagnostics/v1/capabilities";
    links.push(link);
    link.rel = "olutionDiagnosticsAgents";
    link.href = "/ext/solutionDiagnostics/v1/solutionDiagnosticsAgents";
    links.push(link);
    metadata.links = links;
    services.push(metadata);
    servicesDiscovery.services = services;
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return servicesDiscovery.toJSON();
        }
    });
    return response;
}

function GetBasicCapabilities() {
    let capabilities = new oxpd2.SolutionDiagnostics.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/solutionDiagnostics/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/solutionDiagnostics/v1/capabilities";
    links.push(link);
    capabilities.links = links;
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return capabilities.toJSON();
        }
    });
    return response;
}

describe('Solution Diagnostics Service', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await solutionDiagnosticsService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when capabilities error', async () => {
            // Test Setup
            // Mock getCapabilities to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionDiagnosticsService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return application capabilities', async () => {
            // Test Setup
            let capabilities = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilities);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionDiagnosticsService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.Capabilities);
        });
    });

    describe('enumerateSolutionDiagnosticsAgents', () => {
        test('should throw error when no bound device', async () => {
            // Test Setup
            // Mock enumerateSolutionDiagnosticsAgents without bound device
            try {
                await solutionDiagnosticsService.enumerateSolutionDiagnosticsAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateSolutionDiagnosticsAgents error', async () => {
            // Test Setup
            // Mock enumerateSolutionDiagnosticsAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionDiagnosticsService.enumerateSolutionDiagnosticsAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return solution diagnostics agents', async () => {
            // Test Setup
            // Mock enumerateSolutionDiagnosticsAgents
            let solutionDiagnosticsAgents = new oxpd2.SolutionDiagnostics.SolutionDiagnosticsAgents();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return solutionDiagnosticsAgents.toJSON();
                }
            });
            
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionDiagnosticsService.enumerateSolutionDiagnosticsAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionDiagnostics.SolutionDiagnosticsAgents);
        });
    });

    describe('getSolutionDiagnosticsAgent', () => {
        test('should throw error when no bound device', async () => {
            // Test Setup
            // Mock getSolutionDiagnosticsAgent without bound device
            try {
                await solutionDiagnosticsService.getSolutionDiagnosticsAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getSolutionDiagnosticsAgent error', async () => {
            // Test Setup
            // Mock getSolutionDiagnosticsAgent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionDiagnosticsService.getSolutionDiagnosticsAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return solution diagnostics job agent', async () => {
            // Test Setup
            // Mock getSolutionDiagnosticsAgent
            let solutionDiagnosticsAgent = new oxpd2.SolutionDiagnostics.SolutionDiagnosticsAgent();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return solutionDiagnosticsAgent.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionDiagnosticsService.getSolutionDiagnosticsAgent("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionDiagnostics.SolutionDiagnosticsAgent);
        });
    });

    describe('getAgentLog', () => {
        test('should throw error when no bound device', async () => {
            // Test Setup
            // Mock getAgentLog without bound device
            try {
                await solutionDiagnosticsService.getAgentLog();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getAgentLog error', async () => {
            // Test Setup
            // Mock getAgentLog to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionDiagnosticsService.getAgentLog();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return solution diagnostics job agent', async () => {
            // Test Setup
            // Mock getAgentLog
            let buffer = Buffer.from("test");

            const response = Promise.resolve({
                ok: true,
                status: 200,
                arrayBuffer: () => {
                    return buffer;
                },
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionDiagnosticsService.getAgentLog("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionDiagnostics.SolutionDiagnosticsAgent);
        });
    });

});
