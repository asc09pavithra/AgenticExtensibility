import { describe, expect, jest, test } from '@jest/globals';
import jobStatisticsController from '../../src/controllers/jobStatisticsController.js';
import { BoundDevice } from '../../src/models/boundDevice.js';
import deviceManagementService from '../../src/services/deviceManagementService.js';
import jobStatisticsService from '../../src/services/jobStatisticsService.js';
import oxpd2 from 'oxpd2';

describe('Job Statistics Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.JobStatisticsService.Capabilities();
            jest.spyOn(jobStatisticsService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await jobStatisticsController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(jobStatisticsService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(jobStatisticsService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await jobStatisticsController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(jobStatisticsService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_job_statistics_agents', () => {
        test('should call service and send respond with job statistics agents', async () => {
            // Setup Test

            let jobStatisticsAgents = new oxpd2.JobStatisticsService.JobStatisticsAgents();
            jest.spyOn(jobStatisticsService, 'enumerateJobStatisticsAgents').mockResolvedValue(jobStatisticsAgents);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await jobStatisticsController.enumerate_job_statistics_agents(mReq, mRes, mNext);

            // Assert Results
            expect(jobStatisticsService.enumerateJobStatisticsAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(jobStatisticsAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let jobStatisticsAgents = new oxpd2.JobStatisticsService.JobStatisticsAgents();
            jest.spyOn(jobStatisticsService, 'enumerateJobStatisticsAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await jobStatisticsController.enumerate_job_statistics_agents(mReq, mRes, mNext);

            // Assert Results
            expect(jobStatisticsService.enumerateJobStatisticsAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_job_statistics_agent', () => {
        test('should call service and send respond with job statistics agent', async () => {
            // Setup Test

            let jobStatisticsAgent = new oxpd2.JobStatisticsService.JobStatisticsAgent();
            jest.spyOn(jobStatisticsService, 'getJobStatisticsAgent').mockResolvedValue(jobStatisticsAgent);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await jobStatisticsController.get_job_statistics_agent(mReq, mRes, mNext);

            // Assert Results
            expect(jobStatisticsService.getJobStatisticsAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(jobStatisticsAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let jobStatisticsAgent = new oxpd2.JobStatisticsService.JobStatisticsAgent();
            jest.spyOn(jobStatisticsService, 'getJobStatisticsAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await jobStatisticsController.get_job_statistics_agent(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_jobs', () => {
        test('should call service and send respond with jobs', async () => {
            // Setup Test

            let jobs = new oxpd2.JobStatisticsService.Jobs();
            jest.spyOn(jobStatisticsService, 'enumerateJobs').mockResolvedValue(jobs);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await jobStatisticsController.enumerate_jobs(mReq, mRes, mNext);

            // Assert Results
            expect(jobStatisticsService.enumerateJobs).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(jobs);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let jobs = new oxpd2.JobStatisticsService.Jobs();
            jest.spyOn(jobStatisticsService, 'enumerateJobs').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await jobStatisticsController.enumerate_jobs(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('modify_jobs', () => {
        test('should call service and send respond with jobs', async () => {
            // Setup Test

            let jobs = new oxpd2.JobStatisticsService.Jobs();
            jest.spyOn(jobStatisticsService, 'modifyJobs').mockResolvedValue(jobs);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" }, body: new oxpd2.JobStatisticsService.Jobs_Modify() };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await jobStatisticsController.modify_jobs(mReq, mRes, mNext);

            // Assert Results
            expect(jobStatisticsService.modifyJobs).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(jobs);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let jobs = new oxpd2.JobStatisticsService.Jobs();
            jest.spyOn(jobStatisticsService, 'modifyJobs').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" }, body: new oxpd2.JobStatisticsService.Jobs_Modify() };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await jobStatisticsController.modify_jobs(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_job', () => {
        test('should call service and send respond with job', async () => {
            // Setup Test

            let job = new oxpd2.JobStatisticsService.Job();
            jest.spyOn(jobStatisticsService, 'getJob').mockResolvedValue(job);
            const mReq = { params: { sequenceNumber: 1 } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await jobStatisticsController.get_job(mReq, mRes, mNext);

            // Assert Results
            expect(jobStatisticsService.getJob).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(job);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let job = new oxpd2.JobStatisticsService.Job();
            jest.spyOn(jobStatisticsService, 'getJob').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { sequenceNumber: 1 } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await jobStatisticsController.get_job(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
