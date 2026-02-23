import { describe, expect, jest, test } from '@jest/globals';
import authenticationController from '../../src/controllers/authenticationController.js';
import authenticationService from '../../src/services/authenticationService.js';
import oxpd2 from 'oxpd2';

describe('Authentication Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.AuthenticationService.Capabilities();
            jest.spyOn(authenticationService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.AuthenticationService.Capabilities();
            jest.spyOn(authenticationService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await authenticationController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_authentication_accesspoints', () => {
        test('should call service and send respond with authentication access points', async () => {
            // Setup Test
            let authenticationAccessPoints = new oxpd2.AuthenticationService.AuthenticationAccessPoints();
            jest.spyOn(authenticationService, 'enumerateAuthenticationAccessPoints').mockResolvedValue(authenticationAccessPoints);
            const mReq = {
                query : {
                    includeMembers: true,
                    contentFilter: ""
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationController.enumerate_authentication_accesspoints(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.enumerateAuthenticationAccessPoints).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(authenticationAccessPoints);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let authenticationAccessPoints = new oxpd2.AuthenticationService.AuthenticationAccessPoints();
            jest.spyOn(authenticationService, 'enumerateAuthenticationAccessPoints').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                query : {
                    includeMembers: true,
                    contentFilter: ""
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await authenticationController.enumerate_authentication_accesspoints(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.enumerateAuthenticationAccessPoints).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_authentication_accesspoint', () => {
        test('should call service and send respond with authentication access point', async () => {
            // Setup Test
            let authenticationAccessPoint = new oxpd2.AuthenticationService.AuthenticationAccessPoint();
            jest.spyOn(authenticationService, 'getAuthenticationAccessPoint').mockResolvedValue(authenticationAccessPoint);
            const mReq = { params: { accessPointId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationController.get_authentication_accesspoint(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.getAuthenticationAccessPoint).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(authenticationAccessPoint);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let authenticationAccessPoint = new oxpd2.AuthenticationService.AuthenticationAccessPoint();
            jest.spyOn(authenticationService, 'getAuthenticationAccessPoint').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { accessPointId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await authenticationController.get_authentication_accesspoint(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.getAuthenticationAccessPoint).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('authentication_accesspoint_initiate_login', () => {
        test('should call service and send respond with authentication access point initiate login', async () => {
            // Setup Test
            let authenticationAccessPointInitiateLogin = new oxpd2.AuthenticationService.AuthenticationAccessPoint_InitiateLogin();
            jest.spyOn(authenticationService, 'authenticationAccessPointInitiateLogin').mockResolvedValue(authenticationAccessPointInitiateLogin);
            const mReq = { 
                params: { accessPointId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationController.authentication_accesspoint_initiate_login(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.authenticationAccessPointInitiateLogin).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(authenticationAccessPointInitiateLogin);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let authenticationAccessPointInitiateLogin = new oxpd2.AuthenticationService.AuthenticationAccessPoint_InitiateLogin();
            jest.spyOn(authenticationService, 'authenticationAccessPointInitiateLogin').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { accessPointId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await authenticationController.authentication_accesspoint_initiate_login(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.authenticationAccessPointInitiateLogin).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_authentication_agents', () => {
        test('should call service and send respond with authentication agents', async () => {
            // Setup Test

            let authenticationAgents = new oxpd2.AuthenticationService.AuthenticationAgents();
            jest.spyOn(authenticationService, 'enumerateAuthenticationAgents').mockResolvedValue(authenticationAgents);
            const mReq = {};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationController.enumerate_authentication_agents(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.enumerateAuthenticationAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(authenticationAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let authenticationAgents = new oxpd2.AuthenticationService.AuthenticationAgents();
            jest.spyOn(authenticationService, 'enumerateAuthenticationAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = {};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await authenticationController.enumerate_authentication_agents(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.enumerateAuthenticationAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_authentication_agent', () => {
        test('should call service and send respond with authentication agent', async () => {
            // Setup Test

            let authenticationAgent = new oxpd2.AuthenticationService.AuthenticationAgent();
            jest.spyOn(authenticationService, 'getAuthenticationAgent').mockResolvedValue(authenticationAgent);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationController.get_authentication_agent(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.getAuthenticationAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(authenticationAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let authenticationAgent = new oxpd2.AuthenticationService.AuthenticationAgent();
            jest.spyOn(authenticationService, 'getAuthenticationAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await authenticationController.get_authentication_agent(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.getAuthenticationAgent).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('authentication_agent_login', () => {
        test('should call service and send respond with authentication agent login', async () => {
            // Setup Test

            let authenticationAgentLogin = new oxpd2.AuthenticationService.AuthenticationAgent_Login();
            jest.spyOn(authenticationService, 'authenticationAgentLogin').mockResolvedValue(authenticationAgentLogin);
            const mReq = { 
                params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" },
                body: new oxpd2.AuthenticationTypes.PrePromptResult
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationController.authentication_agent_login(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.authenticationAgentLogin).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(authenticationAgentLogin);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let authenticationAgentLogin = new oxpd2.AuthenticationService.AuthenticationAgent_Login();
            jest.spyOn(authenticationService, 'authenticationAgentLogin').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" },
                body: new oxpd2.AuthenticationTypes.PrePromptResult
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await authenticationController.authentication_agent_login(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.authenticationAgentLogin).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('session_force_logout', () => {
        test('should call service and send respond with session force logout', async () => {
            // Setup Test

            let sessionForceLogout = new oxpd2.AuthenticationService.Session_ForceLogout();
            jest.spyOn(authenticationService, 'sessionForceLogout').mockResolvedValue(sessionForceLogout);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationController.session_force_logout(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.sessionForceLogout).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(sessionForceLogout);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let sessionForceLogout = new oxpd2.AuthenticationService.Session_ForceLogout();
            jest.spyOn(authenticationService, 'sessionForceLogout').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await authenticationController.session_force_logout(mReq, mRes, mNext);

            // Assert Results
            expect(authenticationService.sessionForceLogout).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
