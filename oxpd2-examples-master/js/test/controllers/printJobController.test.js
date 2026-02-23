import { describe, expect, jest, test } from '@jest/globals';
import printJobController from '../../src/controllers/printJobController.js';
import { BoundDevice } from '../../src/models/boundDevice.js';
import deviceManagementService from '../../src/services/deviceManagementService.js';
import printJobService from '../../src/services/printJobService.js';
import oxpd2 from 'oxpd2';

describe('Print Job Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.PrintJobService.Capabilities();
            jest.spyOn(printJobService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await printJobController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(printJobService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.PrintJobService.Capabilities();
            jest.spyOn(printJobService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await printJobController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(printJobService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_print_job_agents', () => {
        test('should call service and send respond with print job agents', async () => {
            // Setup Test

            let printJobAgents = new oxpd2.PrintJobService.PrintJobAgents();
            jest.spyOn(printJobService, 'enumeratePrintJobAgents').mockResolvedValue(printJobAgents);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await printJobController.enumerate_print_job_agents(mReq, mRes, mNext);

            // Assert Results
            expect(printJobService.enumeratePrintJobAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(printJobAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let printJobAgents = new oxpd2.PrintJobService.PrintJobAgents();
            jest.spyOn(printJobService, 'enumeratePrintJobAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await printJobController.enumerate_print_job_agents(mReq, mRes, mNext);

            // Assert Results
            expect(printJobService.enumeratePrintJobAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_print_job_agent', () => {
        test('should call service and send respond with print job agent', async () => {
            // Setup Test

            let printJobAgent = new oxpd2.PrintJobService.PrintJobAgent();
            jest.spyOn(printJobService, 'getPrintJobAgent').mockResolvedValue(printJobAgent);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await printJobController.get_print_job_agent(mReq, mRes, mNext);

            // Assert Results
            expect(printJobService.getPrintJobAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(printJobAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let printJobAgent = new oxpd2.PrintJobService.PrintJobAgent();
            jest.spyOn(printJobService, 'getPrintJobAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await printJobController.get_print_job_agent(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
