import { describe, expect, jest, test } from '@jest/globals';
import solutionDiagnosticsController from '../../src/controllers/solutionDiagnosticsController.js';
import solutionDiagnosticsService from '../../src/services/solutionDiagnosticsService.js';
import oxpd2 from 'oxpd2';

describe('Solution Diagnostics Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.SolutionDiagnostics.Capabilities();
            jest.spyOn(solutionDiagnosticsService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionDiagnosticsController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(solutionDiagnosticsService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.SolutionDiagnostics.Capabilities();
            jest.spyOn(solutionDiagnosticsService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionDiagnosticsController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(solutionDiagnosticsService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_solution_diagnostics_agents', () => {
        test('should call service and send respond with solutionDiagnosticsAgents', async () => {
            // Setup Test

            let solutionDiagnosticsAgents = new oxpd2.SolutionDiagnostics.SolutionDiagnosticsAgents();
            jest.spyOn(solutionDiagnosticsService, 'enumerateSolutionDiagnosticsAgents').mockResolvedValue(solutionDiagnosticsAgents);
            const mReq = {};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionDiagnosticsController.enumerate_solution_diagnostics_agents(mReq, mRes, mNext);

            // Assert Results
            expect(solutionDiagnosticsService.enumerateSolutionDiagnosticsAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(solutionDiagnosticsAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionDiagnosticsService, 'enumerateSolutionDiagnosticsAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = {};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionDiagnosticsController.enumerate_solution_diagnostics_agents(mReq, mRes, mNext);

            // Assert Results
            expect(solutionDiagnosticsService.enumerateSolutionDiagnosticsAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_solution_diagnostics_agent', () => {
        test('should call service and send respond with solutionDiagnosticsAgent', async () => {
            // Setup Test

            let solutionDiagnosticsAgent = new oxpd2.SolutionDiagnostics.SolutionDiagnosticsAgent();
            jest.spyOn(solutionDiagnosticsService, 'getSolutionDiagnosticsAgent').mockResolvedValue(solutionDiagnosticsAgent);
            const mReq = { params: { agentId: "EA423102-6161-4FFB-BBC8-0CFFAD25521F" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionDiagnosticsController.get_solution_diagnostics_agent(mReq, mRes, mNext);

            // Assert Results
            expect(solutionDiagnosticsService.getSolutionDiagnosticsAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(solutionDiagnosticsAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionDiagnosticsService, 'getSolutionDiagnosticsAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "EA423102-6161-4FFB-BBC8-0CFFAD25521F" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionDiagnosticsController.get_solution_diagnostics_agent(mReq, mRes, mNext);

            // Assert Results
            expect(solutionDiagnosticsService.getSolutionDiagnosticsAgent).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_solution_diagnostics_agent_log', () => {
        test('should call service and send respond with log', async () => {
            // Setup Test

            let log = {item1: 'logResource', item2: 'logPayload'}
            jest.spyOn(solutionDiagnosticsService, 'getAgentLog').mockResolvedValue(log);
            const mReq = { params: { agentId: "EA423102-6161-4FFB-BBC8-0CFFAD25521F" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionDiagnosticsController.get_solution_diagnostics_agent_log(mReq, mRes, mNext);

            // Assert Results
            expect(solutionDiagnosticsService.getAgentLog).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(log);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionDiagnosticsService, 'getAgentLog').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "EA423102-6161-4FFB-BBC8-0CFFAD25521F" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionDiagnosticsController.get_solution_diagnostics_agent_log(mReq, mRes, mNext);

            // Assert Results
            expect(solutionDiagnosticsService.getAgentLog).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    
});
