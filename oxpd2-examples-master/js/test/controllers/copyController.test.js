import { describe, expect, jest, test } from '@jest/globals';

import { BoundDevice } from '../../src/models/boundDevice.js';
import copyController from '../../src/controllers/copyController.js';
import copyService from '../../src/services/copyService.js';
import deviceManagementService from '../../src/services/deviceManagementService.js';
import oxpd2 from 'oxpd2';

describe('Copy Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.CopyService.Capabilities();
            jest.spyOn(copyService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.CopyService.Capabilities();
            jest.spyOn(copyService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_copy_agents', () => {
        test('should call service and send respond with copy agents', async () => {
            // Setup Test

            let copyAgents = new oxpd2.CopyService.CopyAgents();
            jest.spyOn(copyService, 'enumerateCopyAgents').mockResolvedValue(copyAgents);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.enumerate_copy_agents(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.enumerateCopyAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(copyAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let copyAgents = new oxpd2.CopyService.CopyAgents();
            jest.spyOn(copyService, 'enumerateCopyAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.enumerate_copy_agents(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.enumerateCopyAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_copy_agent', () => {
        test('should call service and send respond with copy agent', async () => {
            // Setup Test

            let copyAgent = new oxpd2.CopyService.CopyAgent();
            jest.spyOn(copyService, 'getCopyAgent').mockResolvedValue(copyAgent);
            const mReq = { params: { agentId: "EA423102-6161-4FFB-BBC8-0CFFAD25521F" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.get_copy_agent(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.getCopyAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(copyAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let copyAgent = new oxpd2.CopyService.CopyAgent();
            jest.spyOn(copyService, 'getCopyAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "EA423102-6161-4FFB-BBC8-0CFFAD25521F" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.get_copy_agent(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_copy_jobs', () => {
        test('should call service and send respond with copy jobs', async () => {
            // Setup Test
            let copyJobs = new oxpd2.CopyService.CopyJobs();
            jest.spyOn(copyService, 'enumerateCopyJobs').mockResolvedValue(copyJobs);
            const mReq = { params: { agentId: "F5ABF521-D27C-489E-8683-C2F9143349A6" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.enumerate_copy_jobs(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.enumerateCopyJobs).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(copyJobs);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let copyJobs = new oxpd2.CopyService.CopyJobs();
            jest.spyOn(copyService, 'enumerateCopyJobs').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "F5ABF521-D27C-489E-8683-C2F9143349A6" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.enumerate_copy_jobs(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.enumerateCopyJobs).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('create_copy_job', () => {
        test('should call service and send respond with created copy job', async () => {
            // Setup Test
            let copyJob = new oxpd2.CopyService.CopyJob();
            jest.spyOn(copyService, 'createCopyJob').mockResolvedValue(copyJob);
            const mReq = { 
                params: { agentId: "66CA0FB2-41FF-43B9-B42F-8B05A6B1746B" }, 
                body: new oxpd2.CopyService.CopyJob_Create
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.create_copy_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.createCopyJob).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(copyJob);
            expect(mRes.status).toBeCalledWith(201);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let copyJob = new oxpd2.CopyService.CopyJob();
            jest.spyOn(copyService, 'createCopyJob').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { agentId: "66CA0FB2-41FF-43B9-B42F-8B05A6B1746B" }, 
                body: new oxpd2.CopyService.CopyJob_Create
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.create_copy_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.createCopyJob).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_copy_job', () => {
        test('should call service and send respond with copy job', async () => {
            // Setup Test
            let copyJob = new oxpd2.CopyService.CopyJob();
            jest.spyOn(copyService, 'getCopyJob').mockResolvedValue(copyJob);
            const mReq = { params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", copyJobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"}};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.get_copy_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.getCopyJob).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(copyJob);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let copyJob = new oxpd2.CopyService.CopyJob();
            jest.spyOn(copyService, 'getCopyJob').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", copyJobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"}};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.get_copy_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.getCopyJob).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('cancel_copy_job', () => {
        test('should call service and send respond with copy job', async () => {
            // Setup Test
            let copyJobCancel = new oxpd2.CopyService.CopyJob_Cancel();
            jest.spyOn(copyService, 'cancelCopyJob').mockResolvedValue(copyJobCancel);
            const mReq = { params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", copyJobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"}};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.cancel_copy_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.cancelCopyJob).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(copyJobCancel);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let copyJobCancel = new oxpd2.CopyService.CopyJob_Cancel();
            jest.spyOn(copyService, 'cancelCopyJob').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", copyJobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"}};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.cancel_copy_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.cancelCopyJob).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_profile', () => {
        test('should call service and send respond with profile', async () => {
            // Setup Test
            let profile = new oxpd2.CopyService.Profile();
            jest.spyOn(copyService, 'getProfile').mockResolvedValue(profile);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.get_profile(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.getProfile).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(profile);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let profile = new oxpd2.CopyService.Profile();
            jest.spyOn(copyService, 'getProfile').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.get_profile(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_default_options', () => {
        test('should call service and send respond with default options', async () => {
            // Setup Test
            let defaultOptions = new oxpd2.CopyService.DefaultOptions();
            jest.spyOn(copyService, 'getDefaultOptions').mockResolvedValue(defaultOptions);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.get_default_options(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.getDefaultOptions).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(defaultOptions);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let defaultOptions = new oxpd2.CopyService.DefaultOptions();
            jest.spyOn(copyService, 'getDefaultOptions').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.get_default_options(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('verify_copy_ticket', () => {
        test('should call service and send respond with results', async () => {
            // Setup Test
            let result = []
            jest.spyOn(copyService, 'verifyCopyTicket').mockResolvedValue(result);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.verify_copy_ticket(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.verifyCopyTicket).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(result);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(copyService, 'verifyCopyTicket').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.verify_copy_ticket(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_stored_jobs', () => {
        test('should call service and send respond with stored jobs', async () => {
            // Setup Test
            let storedJobs = new oxpd2.CopyService.StoredJobs();
            jest.spyOn(copyService, 'enumerateStoredJobs').mockResolvedValue(storedJobs);
            const mReq = { params: { agentId: "F5ABF521-D27C-489E-8683-C2F9143349A6" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.enumerate_stored_jobs(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.enumerateStoredJobs).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(storedJobs);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let storedJobs = new oxpd2.CopyService.StoredJobs();
            jest.spyOn(copyService, 'enumerateStoredJobs').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "F5ABF521-D27C-489E-8683-C2F9143349A6" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.enumerate_stored_jobs(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.enumerateStoredJobs).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_stored_job', () => {
        test('should call service and send respond with stored job', async () => {
            // Setup Test
            let storedJob = new oxpd2.CopyService.StoredJob();
            jest.spyOn(copyService, 'getStoredJob').mockResolvedValue(storedJob);
            const mReq = { params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", jobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"}};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.get_stored_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.getStoredJob).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(storedJob);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let storedJob = new oxpd2.CopyService.StoredJob();
            jest.spyOn(copyService, 'getStoredJob').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", jobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"}};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.get_stored_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.getStoredJob).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('release_stored_job', () => {
        test('should call service and send respond with stored job release', async () => {
            // Setup Test
            let storedJobRelease = new oxpd2.CopyService.StoredJob_Release();
            jest.spyOn(copyService, 'releaseStoredJob').mockResolvedValue(storedJobRelease);
            const mReq = { 
                params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", jobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"},
                body: new oxpd2.CopyService.ReleaseStoredJobRequest()
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.release_stored_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.releaseStoredJob).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(storedJobRelease);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let storedJobRelease = new oxpd2.CopyService.StoredJob_Release();
            jest.spyOn(copyService, 'releaseStoredJob').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", jobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"},
                body: new oxpd2.CopyService.ReleaseStoredJobRequest()
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.release_stored_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.releaseStoredJob).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('remove_stored_job', () => {
        test('should call service and send respond with stored job remove', async () => {
            // Setup Test
            let storedJobRemove = new oxpd2.CopyService.StoredJob_Remove();
            jest.spyOn(copyService, 'removeStoredJob').mockResolvedValue(storedJobRemove);
            const mReq = { 
                params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", jobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"},
                body: new oxpd2.CopyService.RemoveStoredJobRequest()
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.remove_stored_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.removeStoredJob).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(storedJobRemove);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let storedJobRemove = new oxpd2.CopyService.StoredJob_Remove();
            jest.spyOn(copyService, 'removeStoredJob').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { agentId: "EB9B3E8F-D8B6-4048-9929-8CA5C25BCFD3", jobId: "052CAF31-28C2-421F-B8B0-353CC7FE771A"},
                body: new oxpd2.CopyService.RemoveStoredJobRequest()
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.remove_stored_job(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.removeStoredJob).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('verify_stored_copy_ticket', () => {
        test('should call service and send respond with results', async () => {
            // Setup Test
            let result = []
            jest.spyOn(copyService, 'verifyStoredCopyTicket').mockResolvedValue(result);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyController.verify_stored_copy_ticket(mReq, mRes, mNext);

            // Assert Results
            expect(copyService.verifyStoredCopyTicket).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(result);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(copyService, 'verifyStoredCopyTicket').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await copyController.verify_stored_copy_ticket(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
