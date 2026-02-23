import { describe, expect, jest, test, fail } from '@jest/globals';
import jobStatisticsService from '../../src/services/jobStatisticsService.js';
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
    metadata.serviceGun = "com.hp.ext.service.jobStatistics.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/jobStatistics/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/jobStatistics/v1/capabilities";
    links.push(link);
    link.rel = "jobStatisticsAgents";
    link.href = "/ext/jobStatistics/v1/jobStatisticsAgents";
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
    let capabilities = new oxpd2.JobStatisticsService.Capabilities();
    capabilities.description = "Test Capabilities";
    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/jobStatistics/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/jobStatistics/v1/capabilities";
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

function GetBasicJobStatisticsAgents() {
    let agents = new oxpd2.JobStatisticsService.JobStatisticsAgents();
    let agent = new oxpd2.JobStatisticsService.JobStatisticsAgent();
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

function GetBasicJobStatisticsAgent() {
    let agent = new oxpd2.JobStatisticsService.JobStatisticsAgent();
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

function GetBasicJobs() {
    let jobs = new oxpd2.JobStatisticsService.Jobs();
    let job = new oxpd2.JobStatisticsService.Job();
    job.jobId = new oxpd2.JobStatisticsService.JobIdentifier("838F03E2-081A-4654-A599-A1CB22E2884D");
    jobs.members = [job];
    jobs.memberIds = [123];
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return jobs.toJSON();
        }
    });
    return response;
}

function GetBasicJob(){
    let job = new oxpd2.JobStatisticsService.Job();
    job.jobId = new oxpd2.JobStatisticsService.JobIdentifier("838F03E2-081A-4654-A599-A1CB22E2884D");
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return job.toJSON();
        }
    });
    return response;
}

describe('jobStatisticsService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('capabilities', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getCapabilities without bound device
            try {
                await jobStatisticsService.getCapabilities();
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
                await jobStatisticsService.getCapabilities();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return job statistics capabilities', async () => {
            // Test Setup
            let capabilites = GetBasicCapabilities();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => capabilites);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await jobStatisticsService.getCapabilities();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.JobStatisticsService.Capabilities);
        });
    });

    describe('enumerateJobStatisticsAgents', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock enumerateJobStatisticsAgents without bound device
            try {
                await jobStatisticsService.enumerateJobStatisticsAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateJobStatisticsAgents error', async () => {
            // Test Setup
            // Mock enumerateJobStatisticsAgents to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await jobStatisticsService.enumerateJobStatisticsAgents();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return job statistics agents', async () => {
            // Test Setup
            // Mock enumerateJobStatisticsAgents
            let jobStatisticsAgents = GetBasicJobStatisticsAgents();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => jobStatisticsAgents);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await jobStatisticsService.enumerateJobStatisticsAgents();

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.JobStatisticsService.JobStatisticsAgents);
        });
    });

    describe('getJobStatisticsAgent', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getJobStatisticsAgent without bound device
            try {
                await jobStatisticsService.getJobStatisticsAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getJobStatisticsAgent error', async () => {
            // Test Setup
            // Mock getJobStatisticsAgent to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await jobStatisticsService.getJobStatisticsAgent();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return job statistics agent', async () => {
            // Test Setup
            // Mock getJobStatisticsAgent
            let jobStatisticsAgent = GetBasicJobStatisticsAgent();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => jobStatisticsAgent);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await jobStatisticsService.getJobStatisticsAgent("FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.JobStatisticsService.JobStatisticsAgent);
        });
    });

    describe('enumerateJobs', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock enumerateJobs without bound device
            try {
                await jobStatisticsService.enumerateJobs("4EE565FB-E5E9-4D16-B167-8FB9D576DC1B");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when enumerateJobs error', async () => {
            // Test Setup
            // Mock enumerateJobs to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await jobStatisticsService.enumerateJobs("4EE565FB-E5E9-4D16-B167-8FB9D576DC1B");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return jobs', async () => {
            // Test Setup
            // Mock enumerateJobs
            let jobs = GetBasicJobs();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => jobs);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await jobStatisticsService.enumerateJobs("4EE565FB-E5E9-4D16-B167-8FB9D576DC1B");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.JobStatisticsService.Jobs);
        });
    });

    describe('modifyJobs', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock modifyJobs without bound device
            try {
                await jobStatisticsService.modifyJobs("4EE565FB-E5E9-4D16-B167-8FB9D576DC1B", new oxpd2.JobStatisticsService.Jobs_Modify());
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when modifyJobs error', async () => {
            // Test Setup
            // Mock modifyJobs to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await jobStatisticsService.modifyJobs("4EE565FB-E5E9-4D16-B167-8FB9D576DC1B", new oxpd2.JobStatisticsService.Jobs_Modify());
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return jobs', async () => {
            // Test Setup
            // Mock modifyJobs
            let jobs = GetBasicJobs();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => jobs);
            var device = new BoundDevice();
            device.networkAddress = "12.32.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await jobStatisticsService.modifyJobs("4EE565FB-E5E9-4D16-B167-8FB9D576DC1B", new oxpd2.JobStatisticsService.Jobs_Modify());

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.JobStatisticsService.Jobs);
        });
    });

    describe('getJob', () => {
        test('should throw error when capabilities no bound device', async () => {
            // Test Setup
            // Mock getJob without bound device
            try {
                await jobStatisticsService.getJob("4EE565FB-E5E9-4D16-B167-8FB9D576DC1B", "FEB1FFB9-B032-4241-91B2-E15E2D171354");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.NO_BOUND_DEVICE);
            }
        });

        test('should throw error when getJob error', async () => {
            // Test Setup
            // Mock getJob to throw error
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);
            fetch.mockRejectedValueOnce("some error message");

            try {
                await jobStatisticsService.getJob("4EE565FB-E5E9-4D16-B167-8FB9D576DC1B", "FEB1FFB9-B032-4241-91B2-E15E2D171354");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error).toEqual("some error message");
            }
        });

        test('should return job', async () => {
            // Test Setup
            // Mock getJob
            let job = GetBasicJob();
            let servicesDiscovery = GetBasicServicesDiscovery();
            fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => job);
            var device = new BoundDevice();
            device.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

            // Run Test
            var result = await jobStatisticsService.getJob("4EE565FB-E5E9-4D16-B167-8FB9D576DC1B", "FEB1FFB9-B032-4241-91B2-E15E2D171354");

            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.JobStatisticsService.Job);
        });
    });
});
