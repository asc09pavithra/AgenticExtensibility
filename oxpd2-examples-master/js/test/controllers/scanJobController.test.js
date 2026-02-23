import { describe, expect, jest, test } from '@jest/globals';
import scanJobController from '../../src/controllers/scanJobController.js';
import scanJobService from '../../src/services/scanJobService.js';
import oxpd2 from 'oxpd2';

describe('Scan Job Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.ScanJobService.Capabilities();
            jest.spyOn(scanJobService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.ScanJobService.Capabilities();
            jest.spyOn(scanJobService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await scanJobController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_scan_job_agents', () => {
        test('should call service and send respond with scan job agents', async () => {
            // Setup Test

            let scanJobAgents = new oxpd2.ScanJobService.ScanJobAgents();
            jest.spyOn(scanJobService, 'enumerateScanJobAgents').mockResolvedValue(scanJobAgents);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobController.enumerate_scan_job_agents(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.enumerateScanJobAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(scanJobAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let scanJobAgents = new oxpd2.ScanJobService.ScanJobAgents();
            jest.spyOn(scanJobService, 'enumerateScanJobAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await scanJobController.enumerate_scan_job_agents(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.enumerateScanJobAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_scan_job_agent', () => {
        test('should call service and send respond with scan job agent', async () => {
            // Setup Test

            let scanJobAgent = new oxpd2.ScanJobService.ScanJobAgent();
            jest.spyOn(scanJobService, 'getScanJobAgent').mockResolvedValue(scanJobAgent);
            const mReq = { params: { agentId: "EA423102-6161-4FFB-BBC8-0CFFAD25521F" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobController.get_scan_job_agent(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.getScanJobAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(scanJobAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let scanJobAgent = new oxpd2.ScanJobService.ScanJobAgent();
            jest.spyOn(scanJobService, 'getScanJobAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "EA423102-6161-4FFB-BBC8-0CFFAD25521F" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await scanJobController.get_scan_job_agent(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_profile', () => {
        test('should call service and send respond with profile', async () => {
            // Setup Test
            let profile = new oxpd2.ScanJobService.Profile();
            jest.spyOn(scanJobService, 'getProfile').mockResolvedValue(profile);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobController.get_profile(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.getProfile).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(profile);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let profile = new oxpd2.ScanJobService.Profile();
            jest.spyOn(scanJobService, 'getProfile').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await scanJobController.get_profile(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_default_options', () => {
        test('should call service and send respond with default options', async () => {
            // Setup Test
            let defaultOptions = new oxpd2.ScanJobService.DefaultOptions();
            jest.spyOn(scanJobService, 'getDefaultOptions').mockResolvedValue(defaultOptions);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobController.get_default_options(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.getDefaultOptions).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(defaultOptions);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let defaultOptions = new oxpd2.ScanJobService.DefaultOptions();
            jest.spyOn(scanJobService, 'getDefaultOptions').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await scanJobController.get_default_options(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_scan_jobs', () => {
        test('should call service and send respond with scan jobs', async () => {
            // Setup Test
            let scanJobs = new oxpd2.ScanJobService.ScanJobs();
            jest.spyOn(scanJobService, 'enumerateScanJobs').mockResolvedValue(scanJobs);
            const mReq = { params: { agentId: "F5ABF521-D27C-489E-8683-C2F9143349A6" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobController.enumerate_scan_jobs(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.enumerateScanJobs).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(scanJobs);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let scanJobs = new oxpd2.ScanJobService.ScanJobs();
            jest.spyOn(scanJobService, 'enumerateScanJobs').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "F5ABF521-D27C-489E-8683-C2F9143349A6" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await scanJobController.enumerate_scan_jobs(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.enumerateScanJobs).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('create_scan_job', () => {
        test('should call service and send respond with created scan job', async () => {
            // Setup Test
            let scanJob = new oxpd2.ScanJobService.ScanJob();
            jest.spyOn(scanJobService, 'createScanJob').mockResolvedValue(scanJob);
            const mReq = { 
                params: { agentId: "66CA0FB2-41FF-43B9-B42F-8B05A6B1746B" }, 
                body: new oxpd2.ScanJobService.ScanJob_Create
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobController.create_scan_job(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.createScanJob).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(scanJob);
            expect(mRes.status).toBeCalledWith(201);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let scanJob = new oxpd2.ScanJobService.ScanJob();
            jest.spyOn(scanJobService, 'createScanJob').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { agentId: "66CA0FB2-41FF-43B9-B42F-8B05A6B1746B" }, 
                body: new oxpd2.ScanJobService.ScanJob_Create
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await scanJobController.create_scan_job(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.createScanJob).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_scan_job', () => {
        test('should call service and send respond with scan job', async () => {
            // Setup Test
            let scanJob = new oxpd2.ScanJobService.ScanJob();
            jest.spyOn(scanJobService, 'getScanJob').mockResolvedValue(scanJob);
            const mReq = { params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", scanJobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"}};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobController.get_scan_job(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.getScanJob).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(scanJob);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let scanJob = new oxpd2.ScanJobService.ScanJob();
            jest.spyOn(scanJobService, 'getScanJob').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", scanJobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"}};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await scanJobController.get_scan_job(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.getScanJob).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('cancel_scan_job', () => {
        test('should call service and send respond with scan job', async () => {
            // Setup Test
            let scanJobCancel = new oxpd2.ScanJobService.ScanJob_Cancel();
            jest.spyOn(scanJobService, 'cancelScanJob').mockResolvedValue(scanJobCancel);
            const mReq = { params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", scanJobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"}};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobController.cancel_scan_job(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.cancelScanJob).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(scanJobCancel);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let scanJobCancel = new oxpd2.ScanJobService.ScanJob_Cancel();
            jest.spyOn(scanJobService, 'cancelScanJob').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", scanJobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"}};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await scanJobController.cancel_scan_job(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobService.cancelScanJob).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
