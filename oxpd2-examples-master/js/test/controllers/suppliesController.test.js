import { describe, expect, jest, test } from '@jest/globals';
import suppliesController from '../../src/controllers/suppliesController.js';
import suppliesService from '../../src/services/suppliesService.js';
import oxpd2 from 'oxpd2';

describe('Supplies Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.SuppliesService.Capabilities();
            jest.spyOn(suppliesService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await suppliesController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(suppliesService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.SuppliesService.Capabilities();
            jest.spyOn(suppliesService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await suppliesController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(suppliesService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    
    describe('enumerate_supplies_agents', () => {
        test('should call service and send respond with supplies agents', async () => {
            // Setup Test

            let suppliesAgents = new oxpd2.SuppliesService.SuppliesAgents();
            jest.spyOn(suppliesService, 'enumerateSuppliesAgents').mockResolvedValue(suppliesAgents);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await suppliesController.enumerate_supplies_agents(mReq, mRes, mNext);

            // Assert Results
            expect(suppliesService.enumerateSuppliesAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(suppliesAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let suppliesAgents = new oxpd2.SuppliesService.SuppliesAgents();
            jest.spyOn(suppliesService, 'enumerateSuppliesAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await suppliesController.enumerate_supplies_agents(mReq, mRes, mNext);

            // Assert Results
            expect(suppliesService.enumerateSuppliesAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_supplies_agent', () => {
        test('should call service and send respond with supplies agent', async () => {
            // Setup Test

            let suppliesAgent = new oxpd2.SuppliesService.SuppliesAgent();
            jest.spyOn(suppliesService, 'getSuppliesAgent').mockResolvedValue(suppliesAgent);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await suppliesController.get_supplies_agent(mReq, mRes, mNext);

            // Assert Results
            expect(suppliesService.getSuppliesAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(suppliesAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let suppliesAgent = new oxpd2.SuppliesService.SuppliesAgent();
            jest.spyOn(suppliesService, 'getSuppliesAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await suppliesController.get_supplies_agent(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_supplies_configuration', () => {
        test('should call service and send respond with supplies agent', async () => {
            // Setup Test

            let suppliesConfiguration = new oxpd2.SuppliesService.SuppliesConfiguration();
            jest.spyOn(suppliesService, 'getSuppliesConfiguration').mockResolvedValue(suppliesConfiguration);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await suppliesController.get_supplies_configuration(mReq, mRes, mNext);

            // Assert Results
            expect(suppliesService.getSuppliesConfiguration).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(suppliesConfiguration);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(suppliesService, 'getSuppliesConfiguration').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await suppliesController.get_supplies_configuration(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_supplies_info', () => {
        test('should call service and send respond with supplies agent', async () => {
            // Setup Test

            let suppliesInfo = new oxpd2.SuppliesService.SuppliesInfo();
            jest.spyOn(suppliesService, 'getSuppliesInfo').mockResolvedValue(suppliesInfo);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await suppliesController.get_supplies_info(mReq, mRes, mNext);

            // Assert Results
            expect(suppliesService.getSuppliesInfo).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(suppliesInfo);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(suppliesService, 'getSuppliesInfo').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await suppliesController.get_supplies_info(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_supplies_usage', () => {
        test('should call service and send respond with supplies agent', async () => {
            // Setup Test

            let suppliesUsage = new oxpd2.SuppliesService.SuppliesUsage();
            jest.spyOn(suppliesService, 'getSuppliesUsage').mockResolvedValue(suppliesUsage);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await suppliesController.get_supplies_usage(mReq, mRes, mNext);

            // Assert Results
            expect(suppliesService.getSuppliesUsage).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(suppliesUsage);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(suppliesService, 'getSuppliesUsage').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await suppliesController.get_supplies_usage(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
