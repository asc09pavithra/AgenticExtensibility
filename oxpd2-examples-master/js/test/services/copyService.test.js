import { describe, expect, fail, jest, test } from '@jest/globals';

import { BoundDevice } from '../../src/models/boundDevice.js';
import copyService from '../../src/services/copyService.js';
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
    metadata.serviceGun = "com.hp.ext.service.copy.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/copy/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/copy/v1/capabilities";
    links.push(link);
    link.rel = "copyAgents";
    link.href = "/ext/copy/v1/copyAgents";
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
    let capabilities = new oxpd2.CopyService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/copy/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/copy/v1/capabilities";
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


function GetBasicCopyAgents() {
    let agents = new oxpd2.CopyService.CopyAgents();
    let agent = new oxpd2.CopyService.CopyAgent();
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

function GetBasicCopyAgent() {
    let agent = new oxpd2.CopyService.CopyAgent();
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
    let profile = new oxpd2.CopyService.Profile();
    profile.base = new oxpd2.OptionProfileTypes.OptionProfile();
    profile.base.definitions = [];
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
    let defaultOptions = new oxpd2.CopyService.DefaultOptions();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return defaultOptions.toJSON();
        }
    });
    return response;
}

function GetBasicCopyJobs() {
    let jobs = new oxpd2.CopyService.CopyJobs();
    let job = new oxpd2.CopyService.CopyJob();
    job.copyJobId = new oxpd2.CopyService.CopyJobIdentifier("F41E8770-3D1B-40AB-867A-851B9034D4F4");
    jobs.members = [job];
    jobs.memberIds = [job.copyJobId];
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return jobs.toJSON();
        }
    });
    return response;
}

function GetBasicCopyJob() {
    let job = new oxpd2.CopyService.CopyJob();
    job.copyJobId = new oxpd2.CopyService.CopyJobIdentifier("F41E8770-3D1B-40AB-867A-851B9034D4F4");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return job.toJSON();
        }
    });
    return response;
}

function GetBasicStoredJobs() {
    let storedJobs = new oxpd2.CopyService.StoredJobs();
    let storedJob = new oxpd2.CopyService.StoredJob();
    storedJob.jobId = new oxpd2.JobTypes.JobIdentifier("A1B2C3D4-E5F6-7890-ABCD-EF1234567890");
    storedJobs.members = [storedJob];
    storedJobs.memberIds = [storedJob.jobId];
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return storedJobs.toJSON();
        }
    });
    return response;
}

function GetBasicStoredJob() {
    let storedJob = new oxpd2.CopyService.StoredJob();
    storedJob.jobId = new oxpd2.JobTypes.JobIdentifier("A1B2C3D4-E5F6-7890-ABCD-EF1234567890");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return storedJob.toJSON();
        }
    });
    return response;
}

function GetBasicStoredJobRelease() {
    let storedJobRelease = new oxpd2.CopyService.StoredJob_Release();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return storedJobRelease.toJSON();
        }
    });
    return response;
}

function GetBasicStoredJobRemove() {
    let storedJobRemove = new oxpd2.CopyService.StoredJob_Remove();
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return storedJobRemove.toJSON();
        }
    });
    return response;
}

describe('copyService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await copyService.getCapabilities();
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
                await copyService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return copy capabilities', async () => {
            // Test Setup
            let capabilites = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilites);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await copyService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.Capabilities);
        });
    });

    describe('enumerateCopyAgents', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock enumerateCopyAgents without bound device
            try {
                await copyService.enumerateCopyAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateCopyAgents error', async () => {
            // Test Setup
            // Mock enumerateCopyAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await copyService.enumerateCopyAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return copy agents', async () => {
            // Test Setup
            // Mock enumerateCopyAgents to throw error
            let copyAgents = GetBasicCopyAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => copyAgents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await copyService.enumerateCopyAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.CopyAgents);
        });
    });

    describe('getCopyAgent', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCopyAgent without bound device
            try {
                await copyService.getCopyAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getCopyAgent error', async () => {
            // Test Setup
            // Mock getCopyAgent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await copyService.getCopyAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return copy agent', async () => {
            // Test Setup
            // Mock getCopyAgent to throw error
            let copyAgent = GetBasicCopyAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => copyAgent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await copyService.getCopyAgent("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.CopyAgent);
        });
    });

    describe('enumerateCopyJobs', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock enumerateCopyJobs without bound device
            try {
                await copyService.enumerateCopyJobs("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateCopyJobs error', async () => {
            // Test Setup
            // Mock enumerateCopyJobs to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await copyService.enumerateCopyJobs("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return copy jobs', async () => {
            // Test Setup
            let copyJobs = GetBasicCopyJobs();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => copyJobs);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await copyService.enumerateCopyJobs("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.CopyJobs);
        });
    });

    describe('createCopyJob', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock createCopyJob without bound device
            try {
                await copyService.createCopyJob(new oxpd2.CopyService.CopyJob_Create(), "C5AFD0D6-825E-4164-A53D-AB528C068229");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when createCopyJob error', async () => {
            // Test Setup
            // Mock createCopyJob to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await copyService.createCopyJob(new oxpd2.CopyService.CopyJob_Create(), "C5AFD0D6-825E-4164-A53D-AB528C068229");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return copy job', async () => {
            // Test Setup
            let copyJob = GetBasicCopyJob();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => copyJob);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await copyService.createCopyJob(new oxpd2.CopyService.CopyJob_Create(), "C5AFD0D6-825E-4164-A53D-AB528C068229");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.CopyJob);
        });
    });

    describe('getCopyJob', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCopyJob without bound device
            try {
                await copyService.getCopyJob("51AA355B-3C25-466A-84CF-EA1618197561", "2DDB8BD0-488D-4EDE-A3D8-FF41F976BC64");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getCopyJob error', async () => {
            // Test Setup
            // Mock getCopyJob to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await copyService.getCopyJob("51AA355B-3C25-466A-84CF-EA1618197561", "2DDB8BD0-488D-4EDE-A3D8-FF41F976BC64");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return copy job', async () => {
            // Test Setup
            let copyJobs = GetBasicCopyJob();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => copyJobs);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await copyService.getCopyJob("51AA355B-3C25-466A-84CF-EA1618197561", "2DDB8BD0-488D-4EDE-A3D8-FF41F976BC64");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.CopyJob);
        });
    });

    describe('cancelCopyJob', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock cancelCopyJob without bound device
            try {
                await copyService.cancelCopyJob("4CB3B2FD-864A-4638-8745-5118E5E4BDE1", "6D35B452-5959-4426-845F-C8F01108007A");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when cancelCopyJob error', async () => {
            // Test Setup
            // Mock cancelCopyJob to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await copyService.cancelCopyJob("4CB3B2FD-864A-4638-8745-5118E5E4BDE1", "6D35B452-5959-4426-845F-C8F01108007A");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return copy job cancel', async () => {
            // Test Setup
            let copyJobs = GetBasicCopyJob();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => copyJobs);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await copyService.cancelCopyJob("4CB3B2FD-864A-4638-8745-5118E5E4BDE1", "6D35B452-5959-4426-845F-C8F01108007A");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.CopyJob_Cancel);
        });
    });

    describe('getDefaultOptions', () => {
        test('should throw error when default options no bound device', async () => {
            // Test Setup
            // Mock getDefaultOptions without bound device
            try {
                await copyService.getDefaultOptions();
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
                await copyService.getDefaultOptions();
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
            var result = await copyService.getDefaultOptions();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.DefaultOptions);
        });
    });

    describe('getProfile', () => {
        test('should throw error when profile no bound device', async () => {
            // Test Setup
            // Mock getProfile without bound device
            try {
                await copyService.getProfile();
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
                await copyService.getProfile();
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
            var result = await copyService.getProfile();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.Profile);
        });
    });

    describe('verifyCopyTicket', () => {
        test('should throw error when profile no bound device', async () => {
            // Test Setup
            // Mock verifyCopyTicket without bound device
            try {
                await copyService.verifyCopyTicket();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when error', async () => {
            // Test Setup
            // Mock verifyCopyTicket to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await copyService.verifyCopyTicket();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return result', async () => {
            // Test Setup
            // Mock verifyCopyTicket to throw error
            let profile = GetBasicProfile();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => profile);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            let copyOptions = new oxpd2.CopyService.CopyOptions();

            // Run Test
            var result = await copyService.verifyCopyTicket(copyOptions);

            // Assert Results
            expect(result).toBeTruthy();
        });
    });

    describe('enumerateStoredJobs', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock enumerateStoredJobs without bound device
            try {
                await copyService.enumerateStoredJobs("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateStoredJobs error', async () => {
            // Test Setup
            // Mock enumerateStoredJobs to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await copyService.enumerateStoredJobs("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return stored jobs', async () => {
            // Test Setup
            let storedJobs = GetBasicStoredJobs();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => storedJobs);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await copyService.enumerateStoredJobs("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.StoredJobs);
        });
    });

    describe('getStoredJob', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getStoredJob without bound device
            try {
                await copyService.getStoredJob("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC", "A1B2C3D4-E5F6-7890-ABCD-EF1234567890");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getStoredJob error', async () => {
            // Test Setup
            // Mock getStoredJob to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await copyService.getStoredJob("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC", "A1B2C3D4-E5F6-7890-ABCD-EF1234567890");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return stored job', async () => {
            // Test Setup
            let storedJob = GetBasicStoredJob();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => storedJob);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await copyService.getStoredJob("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC", "A1B2C3D4-E5F6-7890-ABCD-EF1234567890");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.StoredJob);
        });
    });

    describe('releaseStoredJob', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock releaseStoredJob without bound device
            try {
                let releaseRequest = new oxpd2.CopyService.ReleaseStoredJobRequest();
                await copyService.releaseStoredJob("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC", "A1B2C3D4-E5F6-7890-ABCD-EF1234567890", releaseRequest);
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when releaseStoredJob error', async () => {
            // Test Setup
            // Mock releaseStoredJob to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                let releaseRequest = new oxpd2.CopyService.ReleaseStoredJobRequest();
                await copyService.releaseStoredJob("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC", "A1B2C3D4-E5F6-7890-ABCD-EF1234567890", releaseRequest);
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return stored job release', async () => {
            // Test Setup
            let storedJobRelease = GetBasicStoredJobRelease();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => storedJobRelease);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            let releaseRequest = new oxpd2.CopyService.ReleaseStoredJobRequest();
            var result = await copyService.releaseStoredJob("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC", "A1B2C3D4-E5F6-7890-ABCD-EF1234567890", releaseRequest);

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.StoredJob_Release);
        });
    });

    describe('removeStoredJob', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock removeStoredJob without bound device
            try {
                let removeRequest = new oxpd2.CopyService.RemoveStoredJobRequest();
                await copyService.removeStoredJob("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC", "A1B2C3D4-E5F6-7890-ABCD-EF1234567890", removeRequest);
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when removeStoredJob error', async () => {
            // Test Setup
            // Mock removeStoredJob to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                let removeRequest = new oxpd2.CopyService.RemoveStoredJobRequest();
                await copyService.removeStoredJob("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC", "A1B2C3D4-E5F6-7890-ABCD-EF1234567890", removeRequest);
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return stored job remove', async () => {
            // Test Setup
            let storedJobRemove = GetBasicStoredJobRemove();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => storedJobRemove);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            let removeRequest = new oxpd2.CopyService.RemoveStoredJobRequest();
            var result = await copyService.removeStoredJob("27AB5777-F99F-4CBA-AB36-3C8B117EBBEC", "A1B2C3D4-E5F6-7890-ABCD-EF1234567890", removeRequest);

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CopyService.StoredJob_Remove);
        });
    });

    describe('verifyStoredCopyTicket', () => {
        test('should throw error when profile no bound device', async () => {
            // Test Setup
            // Mock verifyStoredCopyTicket without bound device
            try {
                await copyService.verifyStoredCopyTicket();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when error', async () => {
            // Test Setup
            // Mock verifyStoredCopyTicket to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await copyService.verifyStoredCopyTicket();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return result', async () => {
            // Test Setup
            let profile = new oxpd2.CopyService.Profile();
            profile.base = new oxpd2.OptionProfileTypes.OptionProfile();
            profile.base.definitions = [];
            profile.storedCopy = new oxpd2.OptionProfileTypes.OptionProfile();
            profile.storedCopy.definitions = [];
            let profileResponse = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return profile.toJSON();
                }
            });
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => profileResponse);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            let copyOptions = new oxpd2.CopyService.CopyOptions();

            // Run Test
            var result = await copyService.verifyStoredCopyTicket(copyOptions);

            // Assert Results
            expect(result).toBeTruthy();
        });
    });
});
