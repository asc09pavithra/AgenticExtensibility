import { describe, expect, jest, test, fail } from '@jest/globals';
import securityService from '../../src/services/securityService.js';
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
    metadata.serviceGun = "com.hp.ext.service.security.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/security/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/security/v1/capabilities";
    links.push(link);
    link.rel = "securityAgents";
    link.href = "/ext/security/v1/securityAgents";
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
    let capabilities = new oxpd2.SecurityService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/security/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/security/v1/capabilities";
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

function GetBasicSecurityAgents() {
    let agents = new oxpd2.SecurityService.SecurityAgents();
    let agent = new oxpd2.SecurityService.SecurityAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("87794CC2-5414-480B-9F9F-744C428D84CE");
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

function GetBasicSecurityAgent() {
    let agent = new oxpd2.SecurityService.SecurityAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("A5933BAD-147D-4E35-848D-F956B911B506");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return agent.toJSON();
        }
    });
    return response;
}

function GetBasicResolvedExpression() {
    let resolvedExpression = new oxpd2.SecurityService.SecurityAgent_ResolveSecurityExpression ();
    resolvedExpression.result = "Resolved Expression";
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return resolvedExpression.toJSON();
        }
    });
    return response;
}

describe('securityService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await securityService.getCapabilities();
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
                await securityService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return security capabilities', async () => {
            // Test Setup
            let capabilites = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilites);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await securityService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SecurityService.Capabilities);
        });
    });

    describe('enumerateSecurityAgents', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock enumerateSecurityAgents without bound device
            try {
                await securityService.enumerateSecurityAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateSecurityAgents error', async () => {
            // Test Setup
            // Mock enumerateSecurityAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await securityService.enumerateSecurityAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return security agents', async () => {
            // Test Setup
            // Mock enumerateSecurityAgents to throw error
            let securityAgents = GetBasicSecurityAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => securityAgents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await securityService.enumerateSecurityAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SecurityService.SecurityAgents);
        });
    });

    describe('getSecurityAgent', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getSecurityAgent without bound device
            try {
                await securityService.getSecurityAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getSecurityAgent error', async () => {
            // Test Setup
            // Mock getSecurityAgent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await securityService.getSecurityAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return security agent', async () => {
            // Test Setup
            // Mock getSecurityAgent to throw error
            let securityAgent = GetBasicSecurityAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => securityAgent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await securityService.getSecurityAgent("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SecurityService.SecurityAgent);
        });
    });

    describe('resolveSecurityExpression', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock resolveSecurityExpression without bound device
            try {
                await securityService.resolveSecurityExpression();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when resolveSecurityExpression error', async () => {
            // Test Setup
            // Mock resolveSecurityExpression to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await securityService.resolveSecurityExpression();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return resolved expression', async () => {
            // Test Setup
            // Mock resolveSecurityExpression to throw error
            let resolveSecurityExpressionRequest = new oxpd2.SecurityService.ResolveSecurityExpressionRequest();
            let resolvedExpression = GetBasicResolvedExpression();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => resolvedExpression);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await securityService.resolveSecurityExpression("FEB1FFB9-B032-4241-91B2-E15E2D171354", resolveSecurityExpressionRequest);

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SecurityService.SecurityAgent_ResolveSecurityExpression);
        });
    });
});
