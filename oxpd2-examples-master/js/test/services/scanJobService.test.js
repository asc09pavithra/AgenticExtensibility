import { describe, expect, jest, test, fail } from '@jest/globals';
import scanJobService from '../../src/services/scanJobService.js';
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
    metadata.serviceGun = "com.hp.ext.service.scanJob.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/scanJob/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/scanJob/v1/capabilities";
    links.push(link);
    link.rel = "scanJobAgents";
    link.href = "/ext/scanJob/v1/scanJobAgents";
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
    let capabilities = new oxpd2.ScanJobService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/scanJob/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/scanJob/v1/capabilities";
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

function GetBasicScanJobAgents() {
    let agents = new oxpd2.ScanJobService.ScanJobAgents();
    let agent = new oxpd2.ScanJobService.ScanJobAgent();
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

function GetBasicScanJobAgent() {
    let agent = new oxpd2.ScanJobService.ScanJobAgent();
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

function GetBasicProfile() {
    let profile = new oxpd2.ScanJobService.Profile();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return profile.toJSON();
        }
    });
    return response;
}

function GetBasicDefaultOptions() {
    let defaultOptions = new oxpd2.ScanJobService.DefaultOptions();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return defaultOptions.toJSON();
        }
    });
    return response;
}

function GetBasicScanJobs() {
    let jobs = new oxpd2.ScanJobService.ScanJobs();
    let job = new oxpd2.ScanJobService.ScanJob();
    job.scanJobId = new oxpd2.ScanJobService.ScanJobIdentifier("F41E8770-3D1B-40AB-867A-851B9034D4F4");
    jobs.members = [job];
    jobs.memberIds = [job.scanJobId];
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return jobs.toJSON();
        }
    });
    return response;
}

function GetBasicScanJob() {
    let job = new oxpd2.ScanJobService.ScanJob();
    job.scanJobId = new oxpd2.ScanJobService.ScanJobIdentifier("F41E8770-3D1B-40AB-867A-851B9034D4F4");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return job.toJSON();
        }
    });
    return response;
}

describe('scanJobService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await scanJobService.getCapabilities();
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
                await scanJobService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return scan job capabilities', async () => {
            // Test Setup
            let capabilites = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilites);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await scanJobService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ScanJobService.Capabilities);
        });
    });

    describe('enumerateScanJobAgents', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock enumerateScanJobAgents without bound device
            try {
                await scanJobService.enumerateScanJobAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateScanJobAgents error', async () => {
            // Test Setup
            // Mock enumerateScanJobAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await scanJobService.enumerateScanJobAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return scan job agents', async () => {
            // Test Setup
            // Mock enumerateScanJobAgents to throw error
            let scanJobAgents = GetBasicScanJobAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => scanJobAgents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await scanJobService.enumerateScanJobAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ScanJobService.ScanJobAgents);
        });
    });

    describe('getScanJobAgent', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getScanJobAgent without bound device
            try {
                await scanJobService.getScanJobAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getScanJobAgent error', async () => {
            // Test Setup
            // Mock getScanJobAgent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await scanJobService.getScanJobAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return scan job agent', async () => {
            // Test Setup
            // Mock getScanJobAgent to throw error
            let scanJobAgent = GetBasicScanJobAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => scanJobAgent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await scanJobService.getScanJobAgent("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ScanJobService.ScanJobAgent);
        });
    });

    describe('getDefaultOptions', () => {
        test('should throw error when default options no bound device', async () => {
            // Test Setup
            // Mock getDefaultOptions without bound device
            try {
                await scanJobService.getDefaultOptions();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when default options error', async () => {
            // Test Setup
            // Mock getDefaultOptions to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await scanJobService.getDefaultOptions();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return default options', async () => {
            // Test Setup
            // Mock getDefaultOptions to throw error
            let profile = GetBasicDefaultOptions();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => profile);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await scanJobService.getDefaultOptions();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ScanJobService.DefaultOptions);
        });
    });

    describe('getProfile', () => {
        test('should throw error when profile no bound device', async () => {
            // Test Setup
            // Mock getProfile without bound device
            try {
                await scanJobService.getProfile();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when profile error', async () => {
            // Test Setup
            // Mock getProfile to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await scanJobService.getProfile();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return profile', async () => {
            // Test Setup
            // Mock getProfile to throw error
            let profile = GetBasicProfile();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => profile);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await scanJobService.getProfile();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ScanJobService.Profile);
        });
    });

    describe('enumerateScanJobs', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock enumerateScanJobs without bound device
            try {
                await scanJobService.enumerateScanJobs("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateScanJobs error', async () => {
            // Test Setup
            // Mock enumerateScanJobs to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await scanJobService.enumerateScanJobs("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return scan jobs', async () => {
            // Test Setup
            let scanJobs = GetBasicScanJobs();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => scanJobs);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await scanJobService.enumerateScanJobs("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ScanJobService.ScanJobs);
        });
    });

    describe('createScanJob', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock createScanJob without bound device
            try {
                await scanJobService.createScanJob(new oxpd2.ScanJobService.ScanJob_Create(), "C5AFD0D6-825E-4164-A53D-AB528C068229");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when createScanJob error', async () => {
            // Test Setup
            // Mock createScanJob to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await scanJobService.createScanJob(new oxpd2.ScanJobService.ScanJob_Create(), "C5AFD0D6-825E-4164-A53D-AB528C068229");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return scan job', async () => {
            // Test Setup
            let scanJob = GetBasicScanJob();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => scanJob);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await scanJobService.createScanJob(new oxpd2.ScanJobService.ScanJob_Create(), "C5AFD0D6-825E-4164-A53D-AB528C068229");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ScanJobService.ScanJob);
        });
    });

    describe('getScanJob', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getScanJob without bound device
            try {
                await scanJobService.getScanJob("51AA355B-3C25-466A-84CF-EA1618197561", "2DDB8BD0-488D-4EDE-A3D8-FF41F976BC64");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getScanJob error', async () => {
            // Test Setup
            // Mock getScanJob to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await scanJobService.getScanJob("51AA355B-3C25-466A-84CF-EA1618197561", "2DDB8BD0-488D-4EDE-A3D8-FF41F976BC64");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return scan job', async () => {
            // Test Setup
            let scanJobs = GetBasicScanJob();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => scanJobs);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await scanJobService.getScanJob("51AA355B-3C25-466A-84CF-EA1618197561", "2DDB8BD0-488D-4EDE-A3D8-FF41F976BC64");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ScanJobService.ScanJob);
        });
    });

    describe('cancelScanJob', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock cancelScanJob without bound device
            try {
                await scanJobService.cancelScanJob("4CB3B2FD-864A-4638-8745-5118E5E4BDE1", "6D35B452-5959-4426-845F-C8F01108007A");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when cancelScanJob error', async () => {
            // Test Setup
            // Mock cancelScanJob to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await scanJobService.cancelScanJob("4CB3B2FD-864A-4638-8745-5118E5E4BDE1", "6D35B452-5959-4426-845F-C8F01108007A");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return scan job cancel', async () => {
            // Test Setup
            let scanJobs = GetBasicScanJob();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => scanJobs);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await scanJobService.cancelScanJob("4CB3B2FD-864A-4638-8745-5118E5E4BDE1", "6D35B452-5959-4426-845F-C8F01108007A");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.ScanJobService.ScanJob_Cancel);
        });
    });

    describe('verifyScanTicket', () => {
        test('should return option rule norification list when device is bound', async () => {
            // Test Setup
            let profile = GetBasicProfile();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery);
            jest.spyOn(scanJobService, 'getProfile').mockImplementationOnce(() => profile);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var notifications = await scanJobService.verifyScanTicket(new oxpd2.ScanJobService.ScanOptions());

            // Assert Results
            expect(notifications).toBeTruthy();
            expect(notifications.length).toEqual(0);
        });
    });

    describe('verifyScanTicketExamples', () => {
        test('should return option rule notification list when device is bound', async () => {
            let optionsJson = require('../testdata/scanJob/BasicScanOptions.json');
            let baseOptionProfileJson = require('../testdata/scanJob/BaseScanOptionsProfile_Basic.json');
            let httpOptionProfileJson = require('../testdata/scanJob/HttpScanOptionsProfile_Basic.json');

            // Setup Profile
            let profile = new oxpd2.ScanJobService.Profile();
            profile.base = baseOptionProfileJson;
            profile.http = httpOptionProfileJson;

            // Test Setup
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery);
            jest.spyOn(scanJobService, 'getProfile').mockImplementationOnce(() => profile);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            await scanJobService.verifyScanTicketExamples(new oxpd2.ScanJobService.ScanOptions(optionsJson));
        });
    });
});
