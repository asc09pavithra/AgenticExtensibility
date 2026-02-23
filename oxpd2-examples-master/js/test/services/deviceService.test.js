import { describe, expect, jest, test, fail } from '@jest/globals';
import deviceService from '../../src/services/deviceService.js';
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
    metadata.serviceGun = "com.hp.ext.service.device.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/device/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/device/v1/capabilities";
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
    let capabilities = new oxpd2.DeviceService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/device/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/device/v1/capabilities";
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

function getBasicIdentity() {
    let identity = new oxpd2.DeviceService.Identity();
    identity.deviceUuid = new oxpd2.CommonTypes.Guid("E4B0B64D-055D-48E5-99A0-8E959800D766");
    identity.firmwareVersion = new oxpd2.DeviceService.FirmwareVersion("testVersion");
    identity.serialNumber = new oxpd2.DeviceService.SerialNumber("testSerialNumber");
    let makeAndModelInfo = new oxpd2.DeviceService.MakeAndModelInfo();
    makeAndModelInfo.base = new oxpd2.DeviceService.ModelName("TestPrinter");
    makeAndModelInfo.family = new oxpd2.DeviceService.ModelName("TestFamily");
    makeAndModelInfo.model = new oxpd2.DeviceService.ModelName("TestModel");
    identity.makeAndModelInfo = makeAndModelInfo;

    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return identity.toJSON();
        }
    });
    return response;
}

function getBasicStatus() {
    let status = new oxpd2.DeviceService.Status();
    status.status = oxpd2.DeviceService.DeviceStatusCategory.dsInitializing;

    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return status.toJSON();
        }
    });
    return response;
}

function getBasicEmail() {
    let email = new oxpd2.DeviceService.Email();
    email.isOnline = true;

    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return email.toJSON();
        }
    });
    return response;
}

function getBasicScanner() {
    let scanner = new oxpd2.DeviceService.Scanner();
    scanner.adfOutputBinIsFull = oxpd2.CommonTypes.BooleanOrUnknown.unknown;
    scanner.hasPaperInAdf = oxpd2.CommonTypes.BooleanOrUnknown.unknown;
    scanner.hasPaperOnFlatbed = oxpd2.CommonTypes.BooleanOrUnknown.unknown;
    scanner.isBusy = true;
    scanner.isOnline = true;

    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return scanner.toJSON();
        }
    });
    return response;
}

function getBasicTestDeploymentInformation() {
    let deploymentInformation = new oxpd2.DeviceService.DeploymentInformation();

    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return deploymentInformation.toJSON();
        }
    });
    return response;
}

describe('deviceService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await deviceService.getCapabilities();
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
                await deviceService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return device capabilities', async () => {
            // Test Setup
            let capabilites = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilites);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await deviceService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.DeviceService.Capabilities);
        });
    });

    describe('identity', () => {
        test('should throw error when identity no bound device', async () => {
            // Test Setup
            // Mock getIdentity without bound device
            try {
                await deviceService.getIdentity();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when identity error',async () => {
            // Test Setup
            // Mock getIdentity to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await deviceService.getIdentity();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return device identity', async () => {
            // Test Setup
            let identity = getBasicIdentity();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => identity);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await deviceService.getIdentity();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.DeviceService.Identity);
        });
    });

    describe('status', () => {
        test('should throw error when status no bound device', async () => {
            // Test Setup
            // Mock getStatus without bound device
            try {
                await deviceService.getStatus();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when status error',async () => {
            // Test Setup
            // Mock getStatus to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await deviceService.getStatus();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return device status', async () => {
            // Test Setup
            let status = getBasicStatus();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => status);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await deviceService.getStatus();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.DeviceService.Status);
        });
    });

    describe('email', () => {
        test('should throw error when email no bound device', async () => {
            // Test Setup
            // Mock getEmail without bound device
            try {
                await deviceService.getEmail();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when email error',async () => {
            // Test Setup
            // Mock getEmail to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await deviceService.getEmail();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return device email', async () => {
            // Test Setup
            let email = getBasicEmail();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => email);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await deviceService.getEmail();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.DeviceService.Email);
        });
    });

    describe('scanner', () => {
        test('should throw error when scanner no bound device', async () => {
            // Test Setup
            // Mock getScanner without bound device
            try {
                await deviceService.getScanner();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when scanner error',async () => {
            // Test Setup
            // Mock getScanner to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await deviceService.getScanner();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return device scanner', async () => {
            // Test Setup
            let scanner = getBasicScanner();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => scanner);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await deviceService.getScanner();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.DeviceService.Scanner);
        });
    });

    describe('deploymentInformation', () => {
        test('should throw error when deploymentInformation no bound device', async () => {
            // Test Setup
            // Mock getDeploymentInformation without bound device
            try {
                await deviceService.getDeploymentInformation();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when deploymentInformation error',async () => {
            // Test Setup
            // Mock getDeploymentInformation to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await deviceService.getDeploymentInformation();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return device deploymentInformation', async () => {
            // Test Setup
            let deploymentInformation = getBasicTestDeploymentInformation();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => deploymentInformation);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await deviceService.getDeploymentInformation();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.DeviceService.DeploymentInformation);
        });
    });
});
