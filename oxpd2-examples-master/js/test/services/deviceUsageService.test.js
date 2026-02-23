import { describe, expect, jest, test, fail } from '@jest/globals';
import { BoundDevice } from '../../src/models/boundDevice.js';
import deviceManagementService from '../../src/services/deviceManagementService.js';
import deviceUsageService from '../../src/services/deviceUsageService.js';
import errors from '../../src/services/errors.js';
import oxpd2 from 'oxpd2';

global.fetch = jest.fn();

function GetBasicServicesDiscovery() {
    let links = [];
    let link = new oxpd2.BaseTypes.Link({
        href: "/ext/deviceUsage/v1/capabilities",
        rel: "capabilities"
    });
    links.push(link);
    let serviceMetadata = new oxpd2.CommonTypes.ServiceMetadata({
        version: "1.0.0",
        serviceGun: "com.hp.ext.service.deviceUsage.version.1",
        description: "Device Usage Service Client Tests Discovery Tree",
        links: links
    });
    let serviceMetadatas = [];
    serviceMetadatas.push(serviceMetadata);
    let servicesDiscovery = new oxpd2.CommonTypes.ServicesDiscovery({ version: "1.0", services: serviceMetadatas });
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
    let capabilities = new oxpd2.DeviceUsageService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/deviceUsage/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/deviceUsage/v1/capabilities";
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

function GetBasicDeviceUsageAgents() {
    let agents = new oxpd2.DeviceUsageService.DeviceUsageAgents();
    let agent = new oxpd2.DeviceUsageService.DeviceUsageAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("838F03E2-081A-4654-A599-A1CB22E2884D");
    agents.members = [agent];
    agents.memberIds = [agent.agentId];
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return agents.toJSON();
        }
    });
    return response;
}

function GetBasicDeviceUsageAgent() {
    let agent = new oxpd2.DeviceUsageService.DeviceUsageAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("838F03E2-081A-4654-A599-A1CB22E2884D");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return agent.toJSON();
        }
    });
    return response;
}

function GetBasicDeviceUsageAgentLifetimeCounters() {
    let lifetimeCounters = new oxpd2.DeviceUsageService.LifetimeCounters();
    lifetimeCounters.scanUsage = new oxpd2.DeviceUsageService.ScanUsage();
    lifetimeCounters.printUsage = new oxpd2.DeviceUsageService.PrintUsage();
    lifetimeCounters.jobUsage = new oxpd2.DeviceUsageService.JobUsage();
    lifetimeCounters.faxUsage = new oxpd2.DeviceUsageService.FaxUsage();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return lifetimeCounters.toJSON();
        }
    });
    return response;
}

describe('deviceUsageService', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await deviceUsageService.getCapabilities();
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
                await deviceUsageService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return device usage capabilities', async () => {
            // Test Setup
            let capabilities = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilities);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await deviceUsageService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.DeviceUsageService.Capabilities);
        });
    });

    describe('enumerateDeviceUsageAgents', () => {
        test('should throw error when enumerateDeviceUsageAgents no bound device', async () => {
            // Test Setup
            // Mock enumerateDeviceUsageAgents without bound device
            try {
                await deviceUsageService.enumerateDeviceUsageAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateDeviceUsageAgents error', async () => {
            // Test Setup
            // Mock enumerateDeviceUsageAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await deviceUsageService.enumerateDeviceUsageAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return device usage agents', async () => {
            // Test Setup
            let agents = GetBasicDeviceUsageAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => agents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await deviceUsageService.enumerateDeviceUsageAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.DeviceUsageService.DeviceUsageAgents);
        });
    });

    describe('getDeviceUsageAgent', () => {
        test('should throw error when getDeviceUsageAgent no bound device', async () => {
            // Test Setup
            // Mock getDeviceUsageAgent without bound device
            try {
                await deviceUsageService.getDeviceUsageAgent("838F03E2-081A-4654-A599-A1CB22E2884D");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getDeviceUsageAgent error', async () => {
            // Test Setup
            // Mock getDeviceUsageAgent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await deviceUsageService.getDeviceUsageAgent("838F03E2-081A-4654-A599-A1CB22E2884D");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return device usage agent', async () => {
            // Test Setup
            let agent = GetBasicDeviceUsageAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => agent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await deviceUsageService.getDeviceUsageAgent("838F03E2-081A-4654-A599-A1CB22E2884D");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.DeviceUsageService.DeviceUsageAgent);
        });
    });

    describe('getDeviceUsageAgentLifetimeCounters', () => {
        test('should throw error when getDeviceUsageAgentLifetimeCounters no bound device', async () => {
            // Test Setup
            // Mock getDeviceUsageAgentLifetimeCounters without bound device
            try {
                await deviceUsageService.getDeviceUsageAgentLifetimeCounters("838F03E2-081A-4654-A599-A1CB22E2884D");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getDeviceUsageAgentLifetimeCounters error', async () => {
            // Test Setup
            // Mock getDeviceUsageAgentLifetimeCounters to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await deviceUsageService.getDeviceUsageAgentLifetimeCounters("838F03E2-081A-4654-A599-A1CB22E2884D");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return device usage agent lifetime counters', async () => {
            // Test Setup
            let lifetimeCounters = GetBasicDeviceUsageAgentLifetimeCounters();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => lifetimeCounters);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await deviceUsageService.getDeviceUsageAgentLifetimeCounters("838F03E2-081A-4654-A599-A1CB22E2884D");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.DeviceUsageService.LifetimeCounters);
        });
    });
});
