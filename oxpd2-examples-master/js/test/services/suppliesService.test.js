import { describe, expect, jest, test, fail } from '@jest/globals';
import suppliesService from '../../src/services/suppliesService.js';
import { BoundDevice } from '../../src/models/boundDevice.js';
import deviceManagementService from '../../src/services/deviceManagementService.js';
import errors from '../../src/services/errors.js';
import oxpd2 from 'oxpd2';

global.fetch = jest.fn();

function GetBasicServicesDiscovery() {
    let servicesDiscovery = new oxpd2.CommonTypes.ServicesDiscovery();
    servicesDiscovery.version = "1.0.0";

    let services = [];
    let metadata = new oxpd2.CommonTypes.ServiceMetadata();
    metadata.version = "1.0.0";
    metadata.serviceGun = "com.hp.ext.service.supplies.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/supplies/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/supplies/v1/capabilities";
    links.push(link);
    link.rel = "suppliesAgents";
    link.href = "/ext/supplies/v1/suppliesAgents";
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
    let capabilities = new oxpd2.SuppliesService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/supplies/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/supplies/v1/capabilities";
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

function GetBasicSuppliesAgents() {
    let agents = new oxpd2.SuppliesService.SuppliesAgents();
    let agent = new oxpd2.SuppliesService.SuppliesAgent();
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

function GetBasicSuppliesAgent() {
    let agent = new oxpd2.SuppliesService.SuppliesAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("4EE565FB-E5E9-4D16-B167-8FB9D576DC1B");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return agent.toJSON();
        }
    });
    return response;
}

function GetBasicSuppliesConfiguration() {
    let suppliesConfiguration = new oxpd2.SuppliesService.SuppliesConfiguration();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return suppliesConfiguration.toJSON();
        }
    });
    return response;
}

function GetBasicSuppliesInfo() {
    let suppliesInfo = new oxpd2.SuppliesService.SuppliesInfo();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return suppliesInfo.toJSON();
        }
    });
    return response;
}

function GetBasicSuppliesUsage() {
    let suppliesUsage = new oxpd2.SuppliesService.SuppliesUsage();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return suppliesUsage.toJSON();
        }
    });
    return response;
}

describe('suppliesService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await suppliesService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when capabilities error',async () => {
            // Test Setup
            // Mock getCapabilities to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await suppliesService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return supplies capabilities', async () => {
            // Test Setup
            let capabilites = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilites);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await suppliesService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SuppliesService.Capabilities);
        });
    });

    describe('enumerateSuppliesAgents', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock enumerateSuppliesAgents without bound device
            try {
                await suppliesService.enumerateSuppliesAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateSuppliesAgents error', async () => {
            // Test Setup
            // Mock enumerateSuppliesAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await suppliesService.enumerateSuppliesAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return supplies agents', async () => {
            // Test Setup
            // Mock enumerateSuppliesAgents to throw error
            let suppliesAgents = GetBasicSuppliesAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => suppliesAgents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await suppliesService.enumerateSuppliesAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SuppliesService.SuppliesAgents);
        });
    });

    describe('getSuppliesAgent', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getSuppliesAgent without bound device
            try {
                await suppliesService.getSuppliesAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getSuppliesAgent error', async () => {
            // Test Setup
            // Mock getSuppliesAgent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await suppliesService.getSuppliesAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return supplies agent', async () => {
            // Test Setup
            // Mock getSuppliesAgent to throw error
            let suppliesAgent = GetBasicSuppliesAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => suppliesAgent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await suppliesService.getSuppliesAgent("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SuppliesService.SuppliesAgent);
        });
    });

    describe('getSuppliesConfiguration', () => {
        test('should throw error when getSuppliesConfiguration no bound device', async () => {
            // Test Setup
            // Mock getSuppliesConfiguration without bound device
            try {
                await suppliesService.getSuppliesConfiguration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getSuppliesConfiguration error', async () => {
            // Test Setup
            // Mock getSuppliesConfiguration to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await suppliesService.getSuppliesConfiguration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return supplies configuration', async () => {
            // Test Setup
            // Mock getSuppliesConfiguration to throw error
            let suppliesConfiguration = GetBasicSuppliesConfiguration();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => suppliesConfiguration);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await suppliesService.getSuppliesConfiguration("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SuppliesService.SuppliesConfiguration);
        });
    });

    describe('getSuppliesInfo', () => {
        test('should throw error when getSuppliesInfo no bound device', async () => {
            // Test Setup
            // Mock getSuppliesInfo without bound device
            try {
                await suppliesService.getSuppliesInfo();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getSuppliesInfo error', async () => {
            // Test Setup
            // Mock getSuppliesInfo to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await suppliesService.getSuppliesInfo();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return supplies info', async () => {
            // Test Setup
            // Mock getSuppliesInfo to throw error
            let suppliesInfo = GetBasicSuppliesInfo();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => suppliesInfo);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await suppliesService.getSuppliesInfo("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SuppliesService.SuppliesInfo);
        });
    });

    describe('getSuppliesUsage', () => {
        test('should throw error when getSuppliesUsage no bound device', async () => {
            // Test Setup
            // Mock getSuppliesUsage without bound device
            try {
                await suppliesService.getSuppliesUsage();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getSuppliesUsage error', async () => {
            // Test Setup
            // Mock getSuppliesUsage to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await suppliesService.getSuppliesUsage();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return supplies usage', async () => {
            // Test Setup
            // Mock getSuppliesUsage to throw error
            let suppliesUsage = GetBasicSuppliesUsage();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => suppliesUsage);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await suppliesService.getSuppliesUsage("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SuppliesService.SuppliesUsage);
        });
    });
});
