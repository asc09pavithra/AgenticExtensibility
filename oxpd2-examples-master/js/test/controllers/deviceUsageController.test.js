import { describe, expect, jest, test } from '@jest/globals';
import deviceUsageController from '../../src/controllers/deviceUsageController.js';
import deviceUsageService from '../../src/services/deviceUsageService.js';
import oxpd2 from 'oxpd2';

describe('Device Usage Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.DeviceUsageService.Capabilities();
            jest.spyOn(deviceUsageService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceUsageController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(deviceUsageService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(deviceUsageService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await deviceUsageController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(deviceUsageService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_device_usage_agents', () => {
        test('should call service and send respond with device usage agents', async () => {
            // Setup Test

            let deviceUsageAgents = new oxpd2.DeviceUsageService.DeviceUsageAgents();
            jest.spyOn(deviceUsageService, 'enumerateDeviceUsageAgents').mockResolvedValue(deviceUsageAgents);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceUsageController.enumerate_device_usage_agents(mReq, mRes, mNext);

            // Assert Results
            expect(deviceUsageService.enumerateDeviceUsageAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(deviceUsageAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(deviceUsageService, 'enumerateDeviceUsageAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await deviceUsageController.enumerate_device_usage_agents(mReq, mRes, mNext);

            // Assert Results
            expect(deviceUsageService.enumerateDeviceUsageAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_device_usage_agent', () => {
        test('should call service and send respond with device usage agent', async () => {
            // Setup Test

            let deviceUsageAgent = new oxpd2.DeviceUsageService.DeviceUsageAgent();
            jest.spyOn(deviceUsageService, 'getDeviceUsageAgent').mockResolvedValue(deviceUsageAgent);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceUsageController.get_device_usage_agent(mReq, mRes, mNext);

            // Assert Results
            expect(deviceUsageService.getDeviceUsageAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(deviceUsageAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(deviceUsageService, 'getDeviceUsageAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await deviceUsageController.get_device_usage_agent(mReq, mRes, mNext);

            // Assert Results
            expect(deviceUsageService.getDeviceUsageAgent).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_device_usage_agent_lifetime_counters', () => {
        test('should call service and send respond with lifetime counters', async () => {
            // Setup Test

            let lifetimeCounters = new oxpd2.DeviceUsageService.LifetimeCounters();
            jest.spyOn(deviceUsageService, 'getDeviceUsageAgentLifetimeCounters').mockResolvedValue(lifetimeCounters);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceUsageController.get_device_usage_agent_lifetime_counters(mReq, mRes, mNext);

            // Assert Results
            expect(deviceUsageService.getDeviceUsageAgentLifetimeCounters).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(lifetimeCounters);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(deviceUsageService, 'getDeviceUsageAgentLifetimeCounters').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await deviceUsageController.get_device_usage_agent_lifetime_counters(mReq, mRes, mNext);

            // Assert Results
            expect(deviceUsageService.getDeviceUsageAgentLifetimeCounters).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
