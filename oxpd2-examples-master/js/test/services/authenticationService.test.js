import { describe, expect, jest, test, fail } from '@jest/globals';
import authenticationService from '../../src/services/authenticationService.js';
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
    metadata.serviceGun = "com.hp.ext.service.authentication.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/authentication/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/authentication/v1/capabilities";
    links.push(link);
    link.rel = "authenticationAccessPoints";
    link.href = "/ext/authentication/v1/authenticationAccessPoints";
    links.push(link);
    link.rel = "authenticationAgents";
    link.href = "/ext/authentication/v1/authenticationAgents";
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
    let capabilities = new oxpd2.AuthenticationService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/authentication/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/authentication/v1/capabilities";
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

function GetBasicAuthenticationAccessPoints() {
    let accessPoints = new oxpd2.AuthenticationService.AuthenticationAccessPoints();
    let accessPoint = new oxpd2.AuthenticationService.AuthenticationAccessPoint();
    accessPoint.accessPointId = new oxpd2.CommonTypes.Guid("1C92487E-4614-48F1-A6DB-18E2BA8D646F");
    accessPoints.members = [accessPoint];
    accessPoints.memberIds = [accessPoint.accessPointId];
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return accessPoints.toJSON();
        }
    });
    return response;
}

function GetBasicAuthenticationAccessPoint() {
    let accessPoint = new oxpd2.AuthenticationService.AuthenticationAccessPoint();
    accessPoint.accessPointId = new oxpd2.CommonTypes.Guid("1C92487E-4614-48F1-A6DB-18E2BA8D646F");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return accessPoint.toJSON();
        }
    });
    return response;
}

function GetBasicAuthenticationAgents() {
    let agents = new oxpd2.AuthenticationService.AuthenticationAgents();
    let agent = new oxpd2.AuthenticationService.AuthenticationAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("B965505A-BC69-4D33-9F94-AECF82AA1172");
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

function GetBasicAuthenticationAgent() {
    let agent = new oxpd2.AuthenticationService.AuthenticationAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("B965505A-BC69-4D33-9F94-AECF82AA1172");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return agent.toJSON();
        }
    });
    return response;
}

describe('authenticationService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await authenticationService.getCapabilities();
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
                await authenticationService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return authentication capabilities', async () => {
            // Test Setup
            let capabilites = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilites);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await authenticationService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.AuthenticationService.Capabilities);
        });
    });

    describe('enumerateAuthenticationAccessPoints', () => {
        test('should throw error when enumerateAuthenticationAccessPoints no bound device', async () => {
            // Test Setup
            // Mock enumerateAuthenticationAccessPoints without bound device
            try {
                await authenticationService.enumerateAuthenticationAccessPoints();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateAuthenticationAccessPoints error', async () => {
            // Test Setup
            // Mock enumerateAuthenticationAccessPoints to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await authenticationService.enumerateAuthenticationAccessPoints();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return authentication agents', async () => {
            // Test Setup
            let authenticationAccessPoints = GetBasicAuthenticationAccessPoints();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => authenticationAccessPoints);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await authenticationService.enumerateAuthenticationAccessPoints();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.AuthenticationService.AuthenticationAccessPoints);
        });
    });

    describe('getAuthenticationAccessPoint', () => {
        test('should throw error when getAuthenticationAccessPoint no bound device', async () => {
            // Test Setup
            // Mock getAuthenticationAccessPoint without bound device
            try {
                await authenticationService.getAuthenticationAccessPoint();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getAuthenticationAccessPoint error', async () => {
            // Test Setup
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await authenticationService.getAuthenticationAccessPoint();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return authentication agent', async () => {
            // Test Setup
            let authenticationAccessPoint = GetBasicAuthenticationAccessPoint();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => authenticationAccessPoint);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await authenticationService.getAuthenticationAccessPoint("7121D191-09F3-4CDF-AAE6-26E227A56EFC");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.AuthenticationService.AuthenticationAccessPoint);
        });
    });
    
    describe('authenticationAccessPointInitiateLogin', () => {
        test('should throw error when authenticationAccessPointInitiateLogin no bound device', async () => {
            // Test Setup
            // Mock authenticationAccessPointInitiateLogin without bound device
            try {
                await authenticationService.authenticationAccessPointInitiateLogin();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when authenticationAccessPointInitiateLogin error', async () => {
            // Test Setup
            // Mock authenticationAccessPointInitiateLogin to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await authenticationService.authenticationAccessPointInitiateLogin();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return authentication access point initiate login', async () => {
            // Test Setup
            let accessPointLogin = new oxpd2.AuthenticationService.AuthenticationAccessPoint_InitiateLogin();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => GetBasicAuthenticationAgents()).mockImplementationOnce(() => accessPointLogin);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await authenticationService.authenticationAccessPointInitiateLogin("test-id");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.AuthenticationService.AuthenticationAccessPoint_InitiateLogin);
        });
    });

    describe('enumerateAuthenticationAgents', () => {
        test('should throw error when enumerateAuthenticationAgents no bound device', async () => {
            // Test Setup
            // Mock enumerateAuthenticationAgents without bound device
            try {
                await authenticationService.enumerateAuthenticationAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateAuthenticationAgents error', async () => {
            // Test Setup
            // Mock enumerateAuthenticationAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await authenticationService.enumerateAuthenticationAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return authentication agents', async () => {
            // Test Setup
            let authenticationAgents = GetBasicAuthenticationAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => authenticationAgents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await authenticationService.enumerateAuthenticationAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.AuthenticationService.AuthenticationAgents);
        });
    });

    describe('getAuthenticationAgent', () => {
        test('should throw error when getAuthenticationAgent no bound device', async () => {
            // Test Setup
            // Mock getAuthenticationAgent without bound device
            try {
                await authenticationService.getAuthenticationAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getAuthenticationAgent error', async () => {
            // Test Setup
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await authenticationService.getAuthenticationAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return authentication agent', async () => {
            // Test Setup
            let authenticationAgent = GetBasicAuthenticationAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => authenticationAgent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await authenticationService.getAuthenticationAgent("7121D191-09F3-4CDF-AAE6-26E227A56EFC");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.AuthenticationService.AuthenticationAgent);
        });
    });
    
    describe('authenticationAgentLogin', () => {
        test('should throw error when authenticationAgentLogin no bound device', async () => {
            // Test Setup
            // Mock authenticationAgentLogin without bound device
            try {
                await authenticationService.authenticationAgentLogin();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when authenticationAgentLogin error', async () => {
            // Test Setup
            // Mock authenticationAgentLogin to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await authenticationService.authenticationAgentLogin();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return authentication agent login', async () => {
            // Test Setup
            let agentLogin = new oxpd2.AuthenticationService.AuthenticationAgent_Login();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => GetBasicAuthenticationAgents()).mockImplementationOnce(() => agentLogin);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            let prePromptResult = new oxpd2.AuthenticationTypes.PrePromptResult();
            var result = await authenticationService.authenticationAgentLogin(prePromptResult, "test-id");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.AuthenticationService.AuthenticationAgent_Login);
        });
    });

    describe('sessionForceLogout', () => {
        test('should throw error when sessionForceLogout no bound device', async () => {
            // Test Setup
            // Mock sessionForceLogout without bound device
            try {
                await authenticationService.sessionForceLogout();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when sessionForceLogout error', async () => {
            // Test Setup
            // Mock sessionForceLogout to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await authenticationService.sessionForceLogout();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return session force logout', async () => {
            // Test Setup
            let sessionForceLogout = new oxpd2.AuthenticationService.Session_ForceLogout();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => GetBasicAuthenticationAgents()).mockImplementationOnce(() => sessionForceLogout);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await authenticationService.sessionForceLogout();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.AuthenticationService.Session_ForceLogout);
        });
    });
});
