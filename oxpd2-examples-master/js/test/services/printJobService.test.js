import { describe, expect, jest, test, fail } from '@jest/globals';
import printJobService from '../../src/services/printJobService.js';
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
    metadata.serviceGun = "com.hp.ext.service.printJob.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/printJob/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/printJob/v1/capabilities";
    links.push(link);
    link.rel = "printJobAgents";
    link.href = "/ext/printJob/v1/printJobAgents";
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
    let capabilities = new oxpd2.PrintJobService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/printJob/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/printJob/v1/capabilities";
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

function GetBasicPrintJobAgents() {
    let agents = new oxpd2.PrintJobService.PrintJobAgents();
    let agent = new oxpd2.PrintJobService.PrintJobAgent();
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

function GetBasicPrintJobAgent() {
    let agent = new oxpd2.PrintJobService.PrintJobAgent();
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

describe('printJobService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await printJobService.getCapabilities();
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
                await printJobService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return print job capabilities', async () => {
            // Test Setup
            let capabilites = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilites);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await printJobService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.PrintJobService.Capabilities);
        });
    });

    describe('enumeratePrintJobAgents', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock enumeratePrintJobAgents without bound device
            try {
                await printJobService.enumeratePrintJobAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumeratePrintJobAgents error', async () => {
            // Test Setup
            // Mock enumeratePrintJobAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await printJobService.enumeratePrintJobAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return print job agents', async () => {
            // Test Setup
            // Mock enumeratePrintJobAgents to throw error
            let printJobAgents = GetBasicPrintJobAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => printJobAgents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await printJobService.enumeratePrintJobAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.PrintJobService.PrintJobAgents);
        });
    });

    describe('getPrintJobAgent', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getPrintJobAgent without bound device
            try {
                await printJobService.getPrintJobAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getPrintJobAgent error', async () => {
            // Test Setup
            // Mock getPrintJobAgent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await printJobService.getPrintJobAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return print job agent', async () => {
            // Test Setup
            // Mock getPrintJobAgent to throw error
            let printJobAgent = GetBasicPrintJobAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => printJobAgent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await printJobService.getPrintJobAgent("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.PrintJobService.PrintJobAgent);
        });
    });
});
