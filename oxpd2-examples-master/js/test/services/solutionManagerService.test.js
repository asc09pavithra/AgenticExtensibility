import { describe, expect, jest, test, fail } from '@jest/globals';
import deviceManagementService from '../../src/services/deviceManagementService.js';
import { BoundDevice } from '../../src/models/boundDevice.js';
import solutionManagerService from '../../src/services/solutionMangerService.js';
import errors from '../../src/services/errors.js';
import oxpd2 from 'oxpd2';
global.fetch = jest.fn();

function GetBasicServicesDiscovery() {
    let servicesDiscovery = new oxpd2.CommonTypes.ServicesDiscovery();
    servicesDiscovery.version = "1.0.0";

    let services = [];
    let metadata = new oxpd2.CommonTypes.ServiceMetadata();
    metadata.version = "1.0.0";
    metadata.serviceGun = "com.hp.ext.service.solutionManager.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/solutionManager/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/solutionManager/v1/capabilities";
    links.push(link);
    link.rel = "installer";
    link.href = "/ext/solutionManager/v1/installer";
    links.push(link);
    link.rel = "solutions";
    link.href = "/ext/solutionManager/v1/solutions";
    links.push(link);
    link.rel = "i18nAssets";
    link.href = "/ext/solutionManager/v1/i18nAssets";
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
    let capabilities = new oxpd2.SolutionManagerService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/solutionManager/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/solutionManager/v1/capabilities";
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

describe('Solution Manager Service', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await solutionManagerService.getCapabilities();
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
                await solutionManagerService.getCapabilities();
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
            var result = await solutionManagerService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ApplicationService.Capabilities);
        });
    });

    describe('getInstaller', () => {
        test('should throw error when getInstaller no bound device', async () => {
            // Test Setup
            // Mock getInstaller without bound device
            try {
                await solutionManagerService.getInstaller();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getInstaller error', async () => {
            // Test Setup
            // Mock getInstaller to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.getInstaller();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return installer', async () => {
            // Test Setup
            let installer = new oxpd2.SolutionManagerService.Installer();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return installer.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.getInstaller();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Installer);
        });
    });

    describe('installRemote', () => {
        test('should throw error when installRemote no bound device', async () => {
            // Test Setup
            // Mock installRemote without bound device
            try {
                await solutionManagerService.installRemote();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when installRemote error', async () => {
            // Test Setup
            // Mock installRemote to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.installRemote();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return installer', async () => {
            // Test Setup
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
            var result = await solutionManagerService.installRemote();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Installer_InstallRemote);
        });
    });

    describe('installSolution', () => {
        test('should throw error when installSolution no bound device', async () => {
            // Test Setup
            // Mock installSolution without bound device
            try {
                await solutionManagerService.installSolution();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when installSolution error', async () => {
            // Test Setup
            // Mock installSolution to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.installSolution();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return installer', async () => {
            // Test Setup
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
            var result = await solutionManagerService.installSolution();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Installer_InstallSolution);
        });
    });

    describe('uninstallSolution', () => {
        test('should throw error when uninstallSolution no bound device', async () => {
            // Test Setup
            // Mock uninstallSolution without bound device
            try {
                await solutionManagerService.uninstallSolution();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when uninstallSolution error', async () => {
            // Test Setup
            // Mock uninstallSolution to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.uninstallSolution();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return installerUninstall', async () => {
            // Test Setup
            let installerUninstallSolution = new oxpd2.SolutionManagerService.Installer_UninstallSolution();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return installerUninstallSolution.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.uninstallSolution();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Installer_UninstallSolution);
        });
    });

    describe('enumerateInstallerOperations', () => {
        test('should throw error when enumerateInstallerOperations no bound device', async () => {
            // Test Setup
            // Mock enumerateInstallerOperations without bound device
            try {
                await solutionManagerService.enumerateInstallerOperations();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateInstallerOperations error', async () => {
            // Test Setup
            // Mock enumerateInstallerOperations to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.enumerateInstallerOperations();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return installerOperations with params', async () => {
            // Test Setup
            let installerOperations = new oxpd2.SolutionManagerService.InstallerOperations();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return installerOperations.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.enumerateInstallerOperations(true, {});
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.InstallerOperations);
        });

        test('should return installerOperations without params', async () => {
            // Test Setup
            let installerOperations = new oxpd2.SolutionManagerService.InstallerOperations();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return installerOperations.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.enumerateInstallerOperations();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.InstallerOperations);
        });
    });

    describe('getInstallerOperation', () => {
        test('should throw error when getInstallerOperation no bound device', async () => {
            // Test Setup
            // Mock getInstallerOperation without bound device
            try {
                await solutionManagerService.getInstallerOperation();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getInstallerOperation error', async () => {
            // Test Setup
            // Mock getInstallerOperation to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.getInstallerOperation();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return installerOperations', async () => {
            // Test Setup
            let installerOperation = new oxpd2.SolutionManagerService.InstallerOperation();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return installerOperation.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.getInstallerOperation();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.InstallerOperation);
        });
    });

    describe('enumerateSolutions', () => {

        test('should throw error when enumerateSolutions no bound device', async () => {
            // Test Setup
            // Mock enumerateSolutions without bound device
            try {
                await solutionManagerService.enumerateSolutions();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateSolutions error', async () => {
            // Test Setup
            // Mock enumerateSolutions to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.enumerateSolutions();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return solutions with params', async () => {
            // Test Setup
            let solutions = new oxpd2.SolutionManagerService.Solutions();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return solutions.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.enumerateSolutions(true, {});
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Solutions);
        });

        test('should return solutions without params', async () => {
            // Test Setup
            let solutions = new oxpd2.SolutionManagerService.Solutions();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return solutions.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.enumerateSolutions();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Solutions);
        });
    });

    describe('getSolution', () => {

        test('should throw error when getSolution no bound device', async () => {
            // Test Setup
            // Mock getSolution without bound device
            try {
                await solutionManagerService.getSolution();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getSolution error', async () => {
            // Test Setup
            // Mock getSolution to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.getSolution();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return solution', async () => {
            // Test Setup
            let solution = new oxpd2.SolutionManagerService.Solution();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return solution.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.getSolution();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Solutions);
        });
    });

    describe('reissueInstallCode', () => {

        test('should throw error when reissueInstallCode no bound device', async () => {
            // Test Setup
            // Mock reissueInstallCode without bound device
            try {
                await solutionManagerService.reissueInstallCode();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when reissueInstallCode error', async () => {
            // Test Setup
            // Mock reissueInstallCode to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.reissueInstallCode();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return solutionReissueInstallCode', async () => {
            // Test Setup
            let solutionReissueInstallCode = new oxpd2.SolutionManagerService.Solution_ReissueInstallCode();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return solutionReissueInstallCode.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.reissueInstallCode();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Solution_ReissueInstallCode);
        });
    });

    describe('getSolutionContext', () => {

        test('should throw error when getSolutionContext no bound device', async () => {
            // Test Setup
            // Mock getSolutionContext without bound device
            try {
                await solutionManagerService.getSolutionContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getSolutionContext error', async () => {
            // Test Setup
            // Mock getSolutionContext to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.getSolutionContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return context', async () => {
            // Test Setup
            let context = new oxpd2.SolutionManagerService.Context();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return context.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.getSolutionContext();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Context);
        });
    });

    describe('modifySolutionContext', () => {

        test('should throw error when modifySolutionContext no bound device', async () => {
            // Test Setup
            // Mock modifySolutionContext without bound device
            try {
                await solutionManagerService.modifySolutionContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when modifySolutionContext error', async () => {
            // Test Setup
            // Mock modifySolutionContext to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.modifySolutionContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return context', async () => {
            // Test Setup
            let context = new oxpd2.SolutionManagerService.Context();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return context.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.modifySolutionContext();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Context);
        });
    });

    describe('replaceSolutionContext', () => {

        test('should throw error when replaceSolutionContext no bound device', async () => {
            // Test Setup
            // Mock replaceSolutionContext without bound device
            try {
                await solutionManagerService.replaceSolutionContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when replaceSolutionContext error', async () => {
            // Test Setup
            // Mock replaceSolutionContext to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.replaceSolutionContext();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return context', async () => {
            // Test Setup
            let context = new oxpd2.SolutionManagerService.Context();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return context.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.replaceSolutionContext();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Context);
        });
    });

    describe('getConfiguration', () => {

        test('should throw error when getConfiguration no bound device', async () => {
            // Test Setup
            // Mock getConfiguration without bound device
            try {
                await solutionManagerService.getConfiguration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getConfiguration error', async () => {
            // Test Setup
            // Mock getConfiguration to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.getConfiguration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return configuration', async () => {
            // Test Setup
            let configuration = new oxpd2.SolutionManagerService.Configuration();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return configuration.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.getConfiguration();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Configuration);
        });
    });

    describe('modifyConfiguration', () => {

        test('should throw error when modifyConfiguration no bound device', async () => {
            // Test Setup
            // Mock modifyConfiguration without bound device
            try {
                await solutionManagerService.modifyConfiguration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when modifyConfiguration error', async () => {
            // Test Setup
            // Mock modifyConfiguration to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.modifyConfiguration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return configuration', async () => {
            // Test Setup
            let configuration = new oxpd2.SolutionManagerService.Configuration();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return configuration.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.modifyConfiguration();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Configuration);
        });
    });

    describe('getConfigurationData', () => {

        test('should throw error when getConfigurationData no bound device', async () => {
            // Test Setup
            // Mock getConfigurationData without bound device
            try {
                await solutionManagerService.getConfigurationData();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getConfigurationData error', async () => {
            // Test Setup
            // Mock getConfigurationData to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.getConfigurationData();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return configuration data', async () => {
            // Test Setup
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
            var result = await solutionManagerService.getConfigurationData();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Configuration);
        });
    });

    describe('replaceConfigurationData', () => {

        test('should throw error when replaceConfigurationData no bound device', async () => {
            // Test Setup
            // Mock replaceConfigurationData without bound device
            try {
                await solutionManagerService.replaceConfigurationData();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when replaceConfigurationData error', async () => {
            // Test Setup
            // Mock replaceConfigurationData to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.replaceConfigurationData();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return configuration data', async () => {
            // Test Setup
            let data = new oxpd2.SolutionManagerService.Data();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return data.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.replaceConfigurationData();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.Configuration);
        });
    });

    describe('enumerateCertificateAuthorities', () => {

        test('should throw error when enumerateCertificateAuthorities no bound device', async () => {
            // Test Setup
            // Mock enumerateCertificateAuthorities without bound device
            try {
                await solutionManagerService.enumerateCertificateAuthorities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateCertificateAuthorities error', async () => {
            // Test Setup
            // Mock enumerateCertificateAuthorities to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.enumerateCertificateAuthorities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return context', async () => {
            // Test Setup
            let certificateAuthorities = new oxpd2.SolutionManagerService.CertificateAuthorities();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return certificateAuthorities.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.enumerateCertificateAuthorities();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.CertificateAuthorities);
        });
    });

    describe('exportCertificateAuthorities', () => {

        test('should throw error when exportCertificateAuthorities no bound device', async () => {
            // Test Setup
            // Mock exportCertificateAuthorities without bound device
            try {
                await solutionManagerService.exportCertificateAuthorities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when exportCertificateAuthorities error', async () => {
            // Test Setup
            // Mock exportCertificateAuthorities to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.exportCertificateAuthorities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return response', async () => {
            // Test Setup
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
            var result = await solutionManagerService.exportCertificateAuthorities();
            // Assert Results
            expect(result).toBeTruthy();
        });
    });

    describe('getCertificateAuthority', () => {

        test('should throw error when getCertificateAuthority no bound device', async () => {
            // Test Setup
            // Mock getCertificateAuthority without bound device
            try {
                await solutionManagerService.getCertificateAuthority();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getCertificateAuthority error', async () => {
            // Test Setup
            // Mock getCertificateAuthority to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.getCertificateAuthority();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return certificateAuthority', async () => {
            // Test Setup
            let certificateAuthority = new oxpd2.SolutionManagerService.CertificateAuthority();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return certificateAuthority.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.getCertificateAuthority();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.CertificateAuthority);
        });
    });

    describe('exportCertificateAuthority', () => {

        test('should throw error when exportCertificateAuthority no bound device', async () => {
            // Test Setup
            // Mock exportCertificateAuthority without bound device
            try {
                await solutionManagerService.exportCertificateAuthority();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when exportCertificateAuthority error', async () => {
            // Test Setup
            // Mock exportCertificateAuthority to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.exportCertificateAuthority();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return response', async () => {
            // Test Setup
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
            var result = await solutionManagerService.exportCertificateAuthority();
            // Assert Results
            expect(result).toBeTruthy();
        });
    });

    describe('deleteCertificateAuthority', () => {

        test('should throw error when deleteCertificateAuthority no bound device', async () => {
            // Test Setup
            // Mock deleteCertificateAuthority without bound device
            try {
                await solutionManagerService.deleteCertificateAuthority();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when deleteCertificateAuthority error', async () => {
            // Test Setup
            // Mock deleteCertificateAuthority to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.deleteCertificateAuthority();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return context', async () => {
            // Test Setup
            let deleteContent = new oxpd2.BaseTypes.DeleteContent();
            const response = Promise.resolve({
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
            var result = await solutionManagerService.deleteCertificateAuthority();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.BaseTypes.DeleteContent);
        });
    });

    describe('importCertificateAuthority', () => {

        test('should throw error when importCertificateAuthority no bound device', async () => {
            // Test Setup
            // Mock importCertificateAuthority without bound device
            try {
                await solutionManagerService.importCertificateAuthority();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when importCertificateAuthority error', async () => {
            // Test Setup
            // Mock importCertificateAuthority to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.importCertificateAuthority();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return certificateAuthoritiesImport', async () => {
            // Test Setup
            let certificateAuthoritiesImport = new oxpd2.SolutionManagerService.CertificateAuthorities_Import();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return certificateAuthoritiesImport.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.importCertificateAuthority();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.CertificateAuthorities_Import);
        });
    });

    describe('enumerateRuntimeRegistrations', () => {

        test('should throw error when enumerateRuntimeRegistrations no bound device', async () => {
            // Test Setup
            // Mock enumerateRuntimeRegistrations without bound device
            try {
                await solutionManagerService.enumerateRuntimeRegistrations();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateRuntimeRegistrations error', async () => {
            // Test Setup
            // Mock enumerateRuntimeRegistrations to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.enumerateRuntimeRegistrations();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return runtimeRegistrations', async () => {
            // Test Setup
            let runtimeRegistrations = new oxpd2.SolutionManagerService.RuntimeRegistrations();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return runtimeRegistrations.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.enumerateRuntimeRegistrations();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.RuntimeRegistrations);
        });
    });

    describe('createRuntimeRegistration', () => {

        test('should throw error when createRuntimeRegistration no bound device', async () => {
            // Test Setup
            // Mock createRuntimeRegistration without bound device
            try {
                await solutionManagerService.createRuntimeRegistration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when createRuntimeRegistration error', async () => {
            // Test Setup
            // Mock createRuntimeRegistration to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.createRuntimeRegistration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return runtimeRegistration', async () => {
            // Test Setup
            let runtimeRegistration = new oxpd2.SolutionManagerService.RuntimeRegistration();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return runtimeRegistration.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.createRuntimeRegistration();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.RuntimeRegistration);
        });
    });

    describe('getRuntimeRegistration', () => {

        test('should throw error when getRuntimeRegistration no bound device', async () => {
            // Test Setup
            // Mock getRuntimeRegistration without bound device
            try {
                await solutionManagerService.getRuntimeRegistration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getRuntimeRegistration error', async () => {
            // Test Setup
            // Mock getRuntimeRegistration to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.getRuntimeRegistration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return runtimeRegistration', async () => {
            // Test Setup
            let runtimeRegistration = new oxpd2.SolutionManagerService.RuntimeRegistration();
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return runtimeRegistration.toJSON();
                }
            });

            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => response);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await solutionManagerService.getRuntimeRegistration();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.SolutionManagerService.RuntimeRegistration);
        });
    });

    describe('deleteRuntimeRegistration', () => {

        test('should throw error when deleteRuntimeRegistration no bound device', async () => {
            // Test Setup
            // Mock deleteRuntimeRegistration without bound device
            try {
                await solutionManagerService.deleteRuntimeRegistration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when deleteRuntimeRegistration error', async () => {
            // Test Setup
            // Mock deleteRuntimeRegistration to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await solutionManagerService.deleteRuntimeRegistration();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return deleteContent', async () => {
            // Test Setup
            let deleteContent = new oxpd2.BaseTypes.DeleteContent();
            const response = Promise.resolve({
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
            var result = await solutionManagerService.deleteRuntimeRegistration();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.BaseTypes.DeleteContent);
        });
    });

});
