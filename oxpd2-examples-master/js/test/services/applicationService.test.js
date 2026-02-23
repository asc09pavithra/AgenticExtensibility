import { describe, expect, jest, test, fail } from '@jest/globals';
import applicationService from '../../src/services/applicationService.js';
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
    metadata.serviceGun = "com.hp.ext.service.application.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/application/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/application/v1/capabilities";
    links.push(link);
    link.rel = "applicationAccessPoints";
    link.href = "/ext/application/v1/applicationAccessPoints";
    links.push(link);
    link.rel = "applicationAgents";
    link.href = "/ext/application/v1/applicationAgents";
    links.push(link);
    link.rel = "i18nAssets";
    link.href = "/ext/application/v1/i18nAssets";
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
    let capabilities = new oxpd2.ApplicationService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/application/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/application/v1/capabilities";
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

function GetBasicApplicationAccessPoints() {
    let accessPoints = new oxpd2.ApplicationService.ApplicationAccessPoints();
    let accessPoint = new oxpd2.ApplicationService.ApplicationAccessPoint();
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

function GetBasicApplicationAccessPoint() {
    let accessPoint = new oxpd2.ApplicationService.ApplicationAccessPoint();
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

function GetBasicApplicationAgents() {
    let agents = new oxpd2.ApplicationService.ApplicationAgents();
    let agent = new oxpd2.ApplicationService.ApplicationAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("4D73CBDA-B338-4F7D-B56E-778A705131E8");
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

function GetBasicApplicationAgent() {
    let agent = new oxpd2.ApplicationService.ApplicationAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("4D73CBDA-B338-4F7D-B56E-778A705131E8");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return agent.toJSON();
        }
    });
    return response;
}

function GetBasicRuntimeChrome() {
    let runtimeChrome = new oxpd2.ApplicationService.RuntimeChrome();
    let applicationRuntimeChrome = new oxpd2.ApplicationTypes.ApplicationRuntimeChrome();
    let webApplicationRuntimeChrome = new oxpd2.ApplicationTypes.WebApplicationRuntimeChrome();
    webApplicationRuntimeChrome.headerTitle = "myHeaderTitle";
    applicationRuntimeChrome.webApplicationRuntimeChrome = webApplicationRuntimeChrome;
    runtimeChrome.applicationChrome = applicationRuntimeChrome;
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return runtimeChrome.toJSON();
        }
    });
    return response;
}

function GetBasicI18nAssets() {
    let assets = new oxpd2.ApplicationService.I18nAssets();
    let asset = new oxpd2.ApplicationService.I18nAsset();
    asset.assetId = new oxpd2.AgentTypes.AssetId("1CD917DE-01E8-4BB1-B3D1-1628EF24692F");
    assets.members = [asset];
    assets.memberIds = [asset.assetId];
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return assets.toJSON();
        }
    });
    return response;
}

function GetBasicI18nAsset() {
    let asset = new oxpd2.ApplicationService.I18nAsset();
    asset.assetId = new oxpd2.AgentTypes.AssetId("1CD917DE-01E8-4BB1-B3D1-1628EF24692F");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return asset.toJSON();
        }
    });
    return response;
}

function GetBasicMessageCenterAgents() {
    let agents = new oxpd2.ApplicationService.MessageCenterAgents();
    let agent = new oxpd2.ApplicationService.MessageCenterAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("90A78479-A1FE-4681-8C10-7280C614CBF7");
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

function GetBasicMessageCenterAgent() {
    let agent = new oxpd2.ApplicationService.MessageCenterAgent();
    agent.agentId = new oxpd2.AgentTypes.AgentId("90A78479-A1FE-4681-8C10-7280C614CBF7");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return agent.toJSON();
        }
    });
    return response;
}

function GetBasicMessages() {
    let messages = new oxpd2.ApplicationService.Messages();
    let message = new oxpd2.ApplicationService.Message();
    message.messageId = new oxpd2.CommonTypes.Guid("D3B01D1B-7BB5-43AC-A99B-3B1EC61A80CF");
    messages.members = [message];
    messages.memberIds = [message.messageId];
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return messages.toJSON();
        }
    });
    return response;
}

function GetBasicMessage() {
    let message = new oxpd2.ApplicationService.Message();
    message.messageId = new oxpd2.CommonTypes.Guid("0BC2E0AA-E7D9-4439-AF29-B7E6F070E044");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return message.toJSON();
        }
    });
    return response;
}

function GetBasicOperationMeta() {
    let opMeta = new oxpd2.BaseTypes.OperationMeta();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return opMeta.toJSON();
        }
    });
    return response;
}

function GetBasicHomescreen() {
    let homescreen = new oxpd2.ApplicationService.Homescreen();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return homescreen.toJSON();
        }
    });
    return response;
}

describe('applicationService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await applicationService.getCapabilities();
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
                await applicationService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return application capabilities', async () => {
            // Test Setup
            let capabilites = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilites);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.Capabilities);
        });
    });

    describe('enumerateApplicationAccessPoints', () => {
        test('should throw error when enumerateApplicationAccessPoints no bound device', async () => {
            // Test Setup
            // Mock enumerateApplicationAccessPoints without bound device
            try {
                await applicationService.enumerateApplicationAccessPoints();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateApplicationAccessPoints error', async () => {
            // Test Setup
            // Mock enumerateApplicationAccessPoints to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.enumerateApplicationAccessPoints();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return application access points', async () => {
            // Test Setup
            let applicationAccessPoints = GetBasicApplicationAccessPoints();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => applicationAccessPoints);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.enumerateApplicationAccessPoints();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.ApplicationAccessPoints);
        });
    });

    describe('getApplicationAccessPoint', () => {
        test('should throw error when getApplicationAccessPoint no bound device', async () => {
            // Test Setup
            // Mock getApplicationAccessPoint without bound device
            try {
                await applicationService.getApplicationAccessPoint();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getApplicationAccessPoint error', async () => {
            // Test Setup
            // Mock getApplicationAccessPoint to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.getApplicationAccessPoint();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return application access point', async () => {
            // Test Setup
            let applicationAccessPoint = GetBasicApplicationAccessPoint();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => applicationAccessPoint);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getApplicationAccessPoint("B14F4FF1-06EB-4435-BD82-BDE94453500B");
            
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.ApplicationAccessPoint);
        });
    });

    describe('applicationAccessPointInitiateLaunch', () => {
        test('should throw error when applicationAccessPointInitiateLaunch without bound device', async () => {
            // Test Setup
            // Mock applicationAccessPointInitiateLaunch without bound device
            try {
                await applicationService.applicationAccessPointInitiateLaunch();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when applicationAccessPointInitiateLaunch error', async () => {
            // Test Setup
            // Mock applicationAccessPointInitiateLaunch to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.applicationAccessPointInitiateLaunch();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return applicationAccessPointInitiateLaunch', async () => {
            // Test Setup
            let applicationAccessPointInitiateLaunch = new oxpd2.ApplicationService.ApplicationAccessPoint_InitiateLaunch();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return applicationAccessPointInitiateLaunch.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.applicationAccessPointInitiateLaunch("B14F4FF1-06EB-4435-BD82-BDE94453500B");
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.ApplicationAccessPoint_InitiateLaunch);
        });
    });

    describe('enumerateApplicationAgents', () => {
        test('should throw error when enumerateApplicationAgents no bound device', async () => {
            // Test Setup
            // Mock enumerateApplicationAgents without bound device
            try {
                await applicationService.enumerateApplicationAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateApplicationAgents error', async () => {
            // Test Setup
            // Mock enumerateApplicationAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.enumerateApplicationAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return application agents', async () => {
            // Test Setup
            let applicationAgents = GetBasicApplicationAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => applicationAgents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.enumerateApplicationAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.ApplicationAgents);
        });
    });

    describe('getApplicationAgent', () => {
        test('should throw error when getApplicationAgent no bound device', async () => {
            // Test Setup
            // Mock getApplicationAgent without bound device
            try {
                await applicationService.getApplicationAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getApplicationAgent error', async () => {
            // Test Setup
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.getApplicationAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return application agent', async () => {
            // Test Setup
            let applicationAgent = GetBasicApplicationAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => applicationAgent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getApplicationAgent("7121D191-09F3-4CDF-AAE6-26E227A56EFC");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.ApplicationAgent);
        });
    });

    describe('refreshApplicationAgent', () => {
        test('should throw error when refreshApplicationAgent no bound device', async () => {
            // Test Setup
            // Mock refreshApplicationAgent without bound device
            try {
                await applicationService.refreshApplicationAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when refreshApplicationAgent error', async () => {
            // Test Setup
            // Mock refreshApplicationAgent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.refreshApplicationAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return application agent refresh', async () => {
            // Test Setup
            let agentRefresh = new oxpd2.ApplicationService.ApplicationAgent_Refresh();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => GetBasicApplicationAgents()).mockImplementationOnce(() => agentRefresh);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            let refreshRequest = new oxpd2.ApplicationService.RefreshRequest();
            var result = await applicationService.refreshApplicationAgent(refreshRequest, "test-id");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.ApplicationAgent_Refresh);
        });
    });

    describe('getApplicationRuntime', () => {
        test('should throw error when getApplicationRuntime no bound device', async () => {
            // Test Setup
            // Mock getApplicationRuntime without bound device
            try {
                await applicationService.getApplicationRuntime();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getApplicationRuntime error', async () => {
            // Test Setup
            // Mock getApplicationRuntime to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.getApplicationRuntime();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return applicationRuntime', async () => {
            // Test Setup
            let applicationRuntime = new oxpd2.ApplicationService.ApplicationRuntime();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return applicationRuntime.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getApplicationRuntime();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.ApplicationRuntime);
        });
    });

    describe('resetApplicationRuntime', () => {
        test('should throw error when resetApplicationRuntime no bound device', async () => {
            // Test Setup
            // Mock resetApplicationRuntime without bound device
            try {
                await applicationService.resetApplicationRuntime();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when resetApplicationRuntime error', async () => {
            // Test Setup
            // Mock resetApplicationRuntime to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.resetApplicationRuntime();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return applicationRuntimeReset', async () => {
            // Test Setup
            let applicationRuntimeReset = new oxpd2.ApplicationService.ApplicationRuntime_Reset();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return applicationRuntimeReset.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.resetApplicationRuntime();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.ApplicationRuntime_Reset);
        });
    });

    describe('getCurrentContext', () => {
        test('should throw error when getCurrentContext no bound device', async () => {
            // Test Setup
            // Mock getCurrentContext without bound device
            try {
                await applicationService.getCurrentContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getCurrentContext error', async () => {
            // Test Setup
            // Mock getCurrentContext to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.getCurrentContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return currentContext', async () => {
            // Test Setup
            let currentContext = new oxpd2.ApplicationService.CurrentContext();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return currentContext.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getCurrentContext();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.CurrentContext);
        });
    });

    describe('resetInactivityTimerCurrentContext', () => {
        test('should throw error when resetInactivityTimerCurrentContext no bound device', async () => {
            // Test Setup
            // Mock resetInactivityTimerCurrentContext without bound device
            try {
                await applicationService.resetInactivityTimerCurrentContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when resetInactivityTimerCurrentContext error', async () => {
            // Test Setup
            // Mock resetInactivityTimerCurrentContext to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.resetInactivityTimerCurrentContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return resetRequest', async () => {
            // Test Setup
            let resetRequest = new oxpd2.ApplicationService.CurrentContext_ResetInactivityTimer();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return resetRequest.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.resetInactivityTimerCurrentContext();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.CurrentContext_ResetInactivityTimer);
        });
    });

    describe('exitCurrentContext', () => {
        test('should throw error when exitCurrentContext no bound device', async () => {
            // Test Setup
            // Mock exitCurrentContext without bound device
            try {
                await applicationService.exitCurrentContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when exitCurrentContext error', async () => {
            // Test Setup
            // Mock exitCurrentContext to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.exitCurrentContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return exitRequest', async () => {
            // Test Setup
            let exitRequest = new oxpd2.ApplicationService.CurrentContext_Exit();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return exitRequest.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.exitCurrentContext();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.CurrentContext_Exit);
        });
    });

    describe('execCurrentContext', () => {
        test('should throw error when execCurrentContext no bound device', async () => {
            // Test Setup
            // Mock execCurrentContext without bound device
            try {
                await applicationService.execCurrentContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when execCurrentContext error', async () => {
            // Test Setup
            // Mock execCurrentContext to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.execCurrentContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return execRequest', async () => {
            // Test Setup
            let execResponse = new oxpd2.ApplicationService.CurrentContext_Exec();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return execResponse.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.execCurrentContext(new oxpd2.ApplicationService.ExecRequest(), new oxpd2.ApplicationService.StartIntent());
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.CurrentContext_Exec);
        });
    });

    describe('getStartIntent', () => {
        test('should throw error when getStartIntent no bound device', async () => {
            // Test Setup
            // Mock getStartIntent without bound device
            try {
                await applicationService.getStartIntent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getStartIntent error', async () => {
            // Test Setup
            // Mock getStartIntent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.getStartIntent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return startIntent', async () => {
            // Test Setup
            let startIntent = new oxpd2.ApplicationService.StartIntent();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return startIntent.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getStartIntent();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.StartIntent);
        });
    });

    describe('getRuntimeChrome', () => {
        test('should throw error when getRuntimeChrome no bound device', async () => {
            // Test Setup
            // Mock getRuntimeChrome without bound device
            try {
                await applicationService.getRuntimeChrome();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getRuntimeChrome error', async () => {
            // Test Setup
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.getRuntimeChrome();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return runtime chrome', async () => {
            // Test Setup
            let runtimeChrome = GetBasicRuntimeChrome();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => runtimeChrome);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getRuntimeChrome();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.RuntimeChrome);
        });
    });

    describe('modifyRuntimeChrome', () => {
        test('should throw error when modifyRuntimeChrome no bound device', async () => {
            // Test Setup
            // Mock modifyRuntimeChrome without bound device
            let runtimeChromeModify = new oxpd2.ApplicationService.RuntimeChrome_Modify();
            try {
                await applicationService.modifyRuntimeChrome(runtimeChromeModify);
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when modifyRuntimeChrome error', async () => {
            // Test Setup
            let runtimeChromeModify = new oxpd2.ApplicationService.RuntimeChrome_Modify();
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.modifyRuntimeChrome(runtimeChromeModify);
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return runtime chrome', async () => {
            // Test Setup
            let runtimeChrome = GetBasicRuntimeChrome();
            let servicesDiscovery = GetBasicServicesDiscovery();
            let runtimeChromeModify = new oxpd2.ApplicationService.RuntimeChrome_Modify();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => runtimeChrome);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.modifyRuntimeChrome(runtimeChromeModify);

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.RuntimeChrome);
        });
    });

    describe('replaceRuntimeChrome', () => {
        test('should throw error when replaceRuntimeChrome no bound device', async () => {
            // Test Setup
            // Mock replaceRuntimeChrome without bound device
            let runtimeChromeReplace = new oxpd2.ApplicationService.RuntimeChrome_Replace();
            try {
                await applicationService.replaceRuntimeChrome(runtimeChromeReplace);
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when replaceRuntimeChrome error', async () => {
            // Test Setup
            let runtimeChromeReplace = new oxpd2.ApplicationService.RuntimeChrome_Replace();
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.replaceRuntimeChrome(runtimeChromeReplace);
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return runtime chrome', async () => {
            // Test Setup
            let runtimeChrome = GetBasicRuntimeChrome();
            let servicesDiscovery = GetBasicServicesDiscovery();
            let runtimeChromeReplace = new oxpd2.ApplicationService.RuntimeChrome_Replace();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => runtimeChrome);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.replaceRuntimeChrome(runtimeChromeReplace);

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.RuntimeChrome);
        });
    });

    describe('enumerateI18nAssets', () => {
        test('should throw error when enumerateI18nAssets no bound device', async () => {
            // Test Setup
            // Mock enumerateI18nAssets without bound device
            try {
                await applicationService.enumerateI18nAssets();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateI18nAssets error', async () => {
            // Test Setup
            // Mock enumerateI18nAssets to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.enumerateI18nAssets();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return i18n assets', async () => {
            // Test Setup
            let i18nAssets = GetBasicI18nAssets();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => i18nAssets);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.enumerateI18nAssets();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.I18nAssets);
        });
    });

    describe('getI18nAsset', () => {
        test('should throw error when getI18nAsset no bound device', async () => {
            // Test Setup
            // Mock getI18nAsset without bound device
            try {
                await applicationService.getI18nAsset();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getI18nAsset error', async () => {
            // Test Setup
            // Mock getI18nAsset to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.getI18nAsset();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return i18n asset', async () => {
            // Test Setup
            let i18nAsset = GetBasicI18nAsset();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => i18nAsset);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getI18nAsset("E3F21FEC-88AE-46B6-8DA1-2C1D7137A05E");
            
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.I18nAsset);
        });
    });

    describe('enumerateMessageCenterAgents', () => {
        test('should throw error when enumerateMessageCenterAgents no bound device', async () => {
            // Test Setup
            // Mock enumerateMessageCenterAgents without bound device
            try {
                await applicationService.enumerateMessageCenterAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateMessageCenterAgents error', async () => {
            // Test Setup
            // Mock enumerateMessageCenterAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.enumerateMessageCenterAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return message center agents', async () => {
            // Test Setup
            let messageCenterAgents = GetBasicMessageCenterAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => messageCenterAgents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.enumerateMessageCenterAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.MessageCenterAgents);
        });
    });

    describe('getMessageCenterAgent', () => {
        test('should throw error when getMessageCenterAgent no bound device', async () => {
            // Test Setup
            // Mock getMessageCenterAgent without bound device
            try {
                await applicationService.getMessageCenterAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getMessageCenterAgent error', async () => {
            // Test Setup
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.getMessageCenterAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return message center agent', async () => {
            // Test Setup
            let messageCenterAgent = GetBasicMessageCenterAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => messageCenterAgent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getMessageCenterAgent("7121D191-09F3-4CDF-AAE6-26E227A56EFC");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.MessageCenterAgent);
        });
    });

    describe('enumerateMessages', () => {
        test('should throw error when enumerateMessages no bound device', async () => {
            // Test Setup
            // Mock enumerateMessages without bound device
            try {
                await applicationService.enumerateMessages("D95ADF86-89AF-4162-BA86-5135F3660177");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateMessages error', async () => {
            // Test Setup
            // Mock enumerateMessages to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.enumerateMessages("D95ADF86-89AF-4162-BA86-5135F3660177");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return messages', async () => {
            // Test Setup
            let messages = GetBasicMessages();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => messages);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.enumerateMessages("D95ADF86-89AF-4162-BA86-5135F3660177");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.Messages);
        });
    });

    describe('createMessage', () => {
        test('should throw error when createMessage no bound device', async () => {
            // Test Setup
            // Mock createMessage without bound device
            try {
                await applicationService.createMessage(new oxpd2.ApplicationService.Message_Create(), "D95ADF86-89AF-4162-BA86-5135F3660177");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when createMessage error', async () => {
            // Test Setup
            // Mock createMessage to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.createMessage(new oxpd2.ApplicationService.Message_Create(), "D95ADF86-89AF-4162-BA86-5135F3660177");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return message', async () => {
            // Test Setup
            let message = GetBasicMessage();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => message);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.createMessage(new oxpd2.ApplicationService.Message_Create(), "D95ADF86-89AF-4162-BA86-5135F3660177");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.Message);
        });
    });

    describe('getMessage', () => {
        test('should throw error when getMessage no bound device', async () => {
            // Test Setup
            // Mock getMessage without bound device
            try {
                await applicationService.getMessage("1F7DDAF4-7792-40FB-91D2-DB2072B89650", "601309CE-16D9-4B02-98C8-40BC081FC1D4");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getMessage error', async () => {
            // Test Setup
            // Mock getMessage to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.getMessage("1F7DDAF4-7792-40FB-91D2-DB2072B89650", "601309CE-16D9-4B02-98C8-40BC081FC1D4");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return message', async () => {
            // Test Setup
            let message = GetBasicMessage();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => message);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getMessage("1F7DDAF4-7792-40FB-91D2-DB2072B89650", "601309CE-16D9-4B02-98C8-40BC081FC1D4");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.Message);
        });
    });

    describe('deleteMessage', () => {
        test('should throw error when deleteMessage no bound device', async () => {
            // Test Setup
            // Mock deleteMessage without bound device
            try {
                await applicationService.deleteMessage("1F7DDAF4-7792-40FB-91D2-DB2072B89650", "601309CE-16D9-4B02-98C8-40BC081FC1D4");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when deleteMessage error', async () => {
            // Test Setup
            // Mock deleteMessage to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.deleteMessage("1F7DDAF4-7792-40FB-91D2-DB2072B89650", "601309CE-16D9-4B02-98C8-40BC081FC1D4");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return operation meta', async () => {
            // Test Setup
            let messages = GetBasicOperationMeta();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => messages);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.deleteMessage("1F7DDAF4-7792-40FB-91D2-DB2072B89650", "601309CE-16D9-4B02-98C8-40BC081FC1D4");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.BaseTypes.OperationMeta);
        });
    });

    describe('getHomescreen', () => {
        test('should throw error when getHomescreen no bound device', async () => {
            // Test Setup
            // Mock getHomescreen without bound device
            try {
                await applicationService.getHomescreen();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getHomescreen error', async () => {
            // Test Setup
            // Mock getHomescreen to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.getHomescreen();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return homescreen', async () => {
            // Test Setup
            let homescreen = GetBasicHomescreen();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => homescreen);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.getHomescreen();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.Homescreen);
        });
    });

    describe('modifyHomescreen', () => {
        test('should throw error when modifyHomescreen no bound device', async () => {
            // Test Setup
            // Mock modifyHomescreen without bound device
            let homescreenModify = new oxpd2.ApplicationService.Homescreen_Modify();
            try {
                await applicationService.modifyHomescreen(homescreenModify);
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when modifyHomescreen error', async () => {
            // Test Setup
            let homescreenModify = new oxpd2.ApplicationService.Homescreen_Modify();
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await applicationService.modifyHomescreen(homescreenModify);
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return homescreen', async () => {
            // Test Setup
            let homescreen = GetBasicHomescreen();
            let servicesDiscovery = GetBasicServicesDiscovery();
            let homescreenModify = new oxpd2.ApplicationService.Homescreen_Modify();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => homescreen);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await applicationService.modifyHomescreen(homescreenModify);

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.Homescreen);
        });
    });
});
