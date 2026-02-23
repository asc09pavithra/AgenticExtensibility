import { describe, expect, jest, test } from '@jest/globals';
import securityController from '../../src/controllers/securityController.js';
import securityService from '../../src/services/securityService.js';
import oxpd2 from 'oxpd2';

describe('Security Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.SecurityService.Capabilities();
            jest.spyOn(securityService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await securityController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(securityService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.SecurityService.Capabilities();
            jest.spyOn(securityService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await securityController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(securityService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_security_agents', () => {
        test('should call service and send respond with security agents', async () => {
            // Setup Test

            let securityAgents = new oxpd2.SecurityService.SecurityAgents();
            jest.spyOn(securityService, 'enumerateSecurityAgents').mockResolvedValue(securityAgents);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await securityController.enumerate_security_agents(mReq, mRes, mNext);

            // Assert Results
            expect(securityService.enumerateSecurityAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(securityAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let securityAgents = new oxpd2.SecurityService.SecurityAgents();
            jest.spyOn(securityService, 'enumerateSecurityAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await securityController.enumerate_security_agents(mReq, mRes, mNext);

            // Assert Results
            expect(securityService.enumerateSecurityAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_security_agent', () => {
        test('should call service and send respond with security agent', async () => {
            // Setup Test

            let securityAgent = new oxpd2.SecurityService.SecurityAgent();
            jest.spyOn(securityService, 'getSecurityAgent').mockResolvedValue(securityAgent);
            const mReq = { params: { agentId: "84097535-1E07-45E5-83FC-C7505A534D83" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await securityController.get_security_agent(mReq, mRes, mNext);

            // Assert Results
            expect(securityService.getSecurityAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(securityAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let securityAgent = new oxpd2.SecurityService.SecurityAgent();
            jest.spyOn(securityService, 'getSecurityAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "84097535-1E07-45E5-83FC-C7505A534D83" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await securityController.get_security_agent(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('resolve_security_expression', () => {
        test('should call service and send respond with security agent', async () => {
            // Setup Test
            let resolvedExpression = new oxpd2.SecurityService.SecurityAgent_ResolveSecurityExpression();
            jest.spyOn(securityService, 'resolveSecurityExpression').mockResolvedValue(resolvedExpression);
            const mReq = { params: { agentId: "84097535-1E07-45E5-83FC-C7505A534D83" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await securityController.resolve_security_expression(mReq, mRes, mNext);

            // Assert Results
            expect(securityService.resolveSecurityExpression).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(resolvedExpression);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(securityService, 'resolveSecurityExpression').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "84097535-1E07-45E5-83FC-C7505A534D83" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await securityController.resolve_security_expression(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
