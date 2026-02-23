import { describe, expect, fail, jest, test } from '@jest/globals';

import { BoundDevice } from '../../src/models/boundDevice.js';
import deviceManagementService from '../../src/services/deviceManagementService.js';
import errors from '../../src/services/errors.js';
import oxpd2 from 'oxpd2';
import usbAccessoriesService from '../../src/services/usbAccessoriesService.js';

global.fetch = jest.fn();

function GetBasicServicesDiscovery() {
    let servicesDiscovery = new oxpd2.CommonTypes.ServicesDiscovery();
    servicesDiscovery.version = "1.0.0";

    let services = [];
    let metadata = new oxpd2.CommonTypes.ServiceMetadata();
    metadata.version = "1.0.0";
    metadata.serviceGun = "com.hp.ext.service.usbAccessories.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/usbAccessories/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/usbAccessories/v1/capabilities";
    links.push(link);
    link.rel = "usbAccessoriesAgents";
    link.href = "/ext/usbAccessories/v1/usbAccessoriesAgents";
    links.push(link);
    link.rel = "accessories";
    link.href = "/ext/usbAccessories/v1/accessories";
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
    let capabilities = new oxpd2.UsbAccessoriesService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/usbAccessories/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/usbAccessories/v1/capabilities";
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

function GetBasicUsbAgents() {
    let agents = new oxpd2.UsbAccessoriesService.UsbAccessoriesAgents();
    let agent = new oxpd2.UsbAccessoriesService.UsbAccessoriesAgent();
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

function GetBasicUsbAgent() {
    let agent = new oxpd2.UsbAccessoriesService.UsbAccessoriesAgent();
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

function GetBasicUsbAccessories() {
    let accessories = new oxpd2.UsbAccessoriesService.Accessories();
    let accessory = new oxpd2.UsbAccessoriesService.Accessory();
    accessory.accessoryID = new oxpd2.CommonTypes.Guid("517CE0DC-94A5-4D65-AF5B-0961E0E04538");
    accessories.members = [accessory];
    accessories.memberIds = [accessory.accessoryID];
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return accessories.toJSON();
        }
    });
    return response;
}

function GetBasicUsbAccessory() {
    let accessory = new oxpd2.UsbAccessoriesService.Accessory();
    accessory.accessoryID = new oxpd2.CommonTypes.Guid("517CE0DC-94A5-4D65-AF5B-0961E0E04538");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return accessory.toJSON();
        }
    });
    return response;
}

describe('usbAccessoriesService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await usbAccessoriesService.getCapabilities();
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
                await usbAccessoriesService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return usb accessories capabilities', async () => {
            // Test Setup
            let capabilites = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilites);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.Capabilities);
        });
    });

    describe('enumerateAccessoriesAgents', () => {
        test('should throw error when accessories agents no bound device', async () => {
            // Test Setup
            // Mock enumerateAccessoriesAgents without bound device
            try {
                await usbAccessoriesService.enumerateAccessoriesAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateAccessoriesAgents error', async () => {
            // Test Setup
            // Mock enumerateAccessoriesAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.enumerateAccessoriesAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return accessories agents', async () => {
            // Test Setup
            // Mock enumerateAccessoriesAgents to throw error
            let accessoriesAgents = GetBasicUsbAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => accessoriesAgents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.enumerateAccessoriesAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.UsbAccessoriesAgents);
        });
    });

    describe('getAccessoriesAgent', () => {
        test('should throw error when accessories agent no bound device', async () => {
            // Test Setup
            // Mock getAccessoriesAgent without bound device
            try {
                await usbAccessoriesService.getAccessoriesAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getAccessoriesAgent error', async () => {
            // Test Setup
            // Mock getAccessoriesAgent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.getAccessoriesAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return acccessories agent', async () => {
            // Test Setup
            // Mock getAccessoriesAgent to throw error
            let accessoriesAgent = GetBasicUsbAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => accessoriesAgent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.getAccessoriesAgent("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.UsbAccessoriesAgent);
        });
    });

    describe('enumerateAccessories', () => {
        test('should throw error when accessories no bound device', async () => {
            // Test Setup
            // Mock enumerateAccessories without bound device
            try {
                await usbAccessoriesService.enumerateAccessories();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateAccessories error', async () => {
            // Test Setup
            // Mock enumerateAccessories to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.enumerateAccessories();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return accessories', async () => {
            // Test Setup
            // Mock enumerateAccessories to throw error
            let accessories = GetBasicUsbAccessories();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => accessories);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.enumerateAccessories();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.Accessories);
        });
    });

    describe('getAccessory', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getAccessory without bound device
            try {
                await usbAccessoriesService.getAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getAccessory error', async () => {
            // Test Setup
            // Mock getAccessory to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.getAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return acccessories agent', async () => {
            // Test Setup
            // Mock getAccessory to throw error
            let accessory = GetBasicUsbAccessory();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => accessory);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.getAccessory("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.Accessory);
        });
    });

    describe('getUsbAccessoryHid', () => {
        test('should throw error when getUsbAccessoryHid no bound device', async () => {
            // Test Setup
            // Mock getUsbAccessoryHid without bound device
            try {
                await usbAccessoriesService.getUsbAccessoryHid();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getUsbAccessoryHid error', async () => {
            // Test Setup
            // Mock getUsbAccessoryHid to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.getUsbAccessoryHid();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return hid', async () => {
            // Test Setup
            // Mock getUsbAccessoryHid
            let hid = new oxpd2.UsbAccessoriesService.Hid();
            let response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return hid.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.getUsbAccessoryHid();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.Hid);
        });
    });

    describe('openOwnedAccessoryHid', () => {
        test('should throw error when openOwnedAccessoryHid no bound device', async () => {
            // Test Setup
            // Mock openOwnedAccessoryHid without bound device
            try {
                await usbAccessoriesService.openOwnedAccessoryHid();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when openOwnedAccessoryHid error', async () => {
            // Test Setup
            // Mock openOwnedAccessoryHid to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.openOwnedAccessoryHid();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return hid_open', async () => {
            // Test Setup
            // Mock openOwnedAccessoryHid
            let hid_open = new oxpd2.UsbAccessoriesService.Hid_Open();
            let response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return hid_open.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.openOwnedAccessoryHid();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.Hid_Open);
        });
    });

    describe('openSharedAccessoryHid', () => {
        test('should throw error when openSharedAccessoryHid no bound device', async () => {
            // Test Setup
            // Mock openSharedAccessoryHid without bound device
            try {
                await usbAccessoriesService.openSharedAccessoryHid();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when openSharedAccessoryHid error', async () => {
            // Test Setup
            // Mock openSharedAccessoryHid to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.openSharedAccessoryHid();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return hid_open', async () => {
            // Test Setup
            // Mock openSharedAccessoryHid
            let hid_open = new oxpd2.UsbAccessoriesService.Hid_Open();
            let response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return hid_open.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.openSharedAccessoryHid();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.Hid_Open);
        });
    });

    describe('getOpenHIDAccessory', () => {
        test('should throw error when getOpenHIDAccessory no bound device', async () => {
            // Test Setup
            // Mock getOpenHIDAccessory without bound device
            try {
                await usbAccessoriesService.getOpenHIDAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getOpenHIDAccessory error', async () => {
            // Test Setup
            // Mock getOpenHIDAccessory to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.getOpenHIDAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return openHIDAccessory', async () => {
            // Test Setup
            // Mock getOpenHIDAccessory
            let openHIDAccessory = new oxpd2.UsbAccessoriesService.OpenHIDAccessory();
            let response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return openHIDAccessory.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.getOpenHIDAccessory();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.OpenHIDAccessory);
        });
    });

    describe('deleteOpenHIDAccessory', () => {
        test('should throw error when deleteOpenHIDAccessory no bound device', async () => {
            // Test Setup
            // Mock deleteOpenHIDAccessory without bound device
            try {
                await usbAccessoriesService.deleteOpenHIDAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when deleteOpenHIDAccessory error', async () => {
            // Test Setup
            // Mock deleteOpenHIDAccessory to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.deleteOpenHIDAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should succeed', async () => {
            // Test Setup
            // Mock deleteOpenHIDAccessory
            let deleteContent = new oxpd2.BaseTypes.DeleteContent();
            let response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return deleteContent.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            await usbAccessoriesService.deleteOpenHIDAccessory();
        });
    });

    describe('modifyOpenHIDAccessory', () => {
        test('should throw error when modifyOpenHIDAccessory no bound device', async () => {
            // Test Setup
            // Mock modifyOpenHIDAccessory without bound device
            try {
                await usbAccessoriesService.modifyOpenHIDAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when modifyOpenHIDAccessory error', async () => {
            // Test Setup
            // Mock modifyOpenHIDAccessory to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.modifyOpenHIDAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return openHIDAccessory', async () => {
            // Test Setup
            // Mock modifyOpenHIDAccessory
            let openHIDAccessory = new oxpd2.UsbAccessoriesService.OpenHIDAccessory();
            let response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return openHIDAccessory.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.modifyOpenHIDAccessory();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.OpenHIDAccessory);
        });
    });

    describe('readReportOpenHIDAccessory', () => {
        test('should throw error when readReportOpenHIDAccessory no bound device', async () => {
            // Test Setup
            // Mock readReportOpenHIDAccessory without bound device
            try {
                await usbAccessoriesService.readReportOpenHIDAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when readReportOpenHIDAccessory error', async () => {
            // Test Setup
            // Mock readReportOpenHIDAccessory to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.readReportOpenHIDAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return readReport', async () => {
            // Test Setup
            // Mock readReportOpenHIDAccessory
            let readReport = new oxpd2.UsbAccessoriesService.OpenHIDAccessory_ReadReport();
            let response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return readReport.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.readReportOpenHIDAccessory();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.OpenHIDAccessory_ReadReport);
        });
    });

    describe('writeReportOpenHIDAccessory', () => {
        test('should throw error when writeReportOpenHIDAccessory no bound device', async () => {
            // Test Setup
            // Mock writeReportOpenHIDAccessory without bound device
            try {
                await usbAccessoriesService.writeReportOpenHIDAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when writeReportOpenHIDAccessory error', async () => {
            // Test Setup
            // Mock writeReportOpenHIDAccessory to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await usbAccessoriesService.writeReportOpenHIDAccessory();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return writeReport', async () => {
            // Test Setup
            // Mock writeReportOpenHIDAccessory
            let writeReport = new oxpd2.UsbAccessoriesService.OpenHIDAccessory_WriteReport();
            let response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return writeReport.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await usbAccessoriesService.writeReportOpenHIDAccessory();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.UsbAccessoriesService.OpenHIDAccessory_WriteReport);
        });
    });
});
