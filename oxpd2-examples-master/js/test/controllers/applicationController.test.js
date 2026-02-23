import { describe, expect, jest, test } from '@jest/globals';
import applicationController from '../../src/controllers/applicationController.js';
import applicationService from '../../src/services/applicationService.js';
import oxpd2 from 'oxpd2';

describe('Application Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.ApplicationService.Capabilities();
            jest.spyOn(applicationService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.ApplicationService.Capabilities();
            jest.spyOn(applicationService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_application_access_points', () => {
        test('should call service and send respond with application access points', async () => {
            // Setup Test
            let applicationAccessPoints = new oxpd2.ApplicationService.ApplicationAccessPoints();
            jest.spyOn(applicationService, 'enumerateApplicationAccessPoints').mockResolvedValue(applicationAccessPoints);
            const mReq = {
                query : {
                    includeMembers: true,
                    contentFilter: ""
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.enumerate_application_access_points(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.enumerateApplicationAccessPoints).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(applicationAccessPoints);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let applicationAccessPoints = new oxpd2.ApplicationService.ApplicationAccessPoints();
            jest.spyOn(applicationService, 'enumerateApplicationAccessPoints').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                query : {
                    includeMembers: true,
                    contentFilter: ""
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.enumerate_application_access_points(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.enumerateApplicationAccessPoints).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_application_access_point', () => {
        test('should call service and send respond with application access point', async () => {
            // Setup Test
            let applicationAccessPoint = new oxpd2.ApplicationService.ApplicationAccessPoint();
            jest.spyOn(applicationService, 'getApplicationAccessPoint').mockResolvedValue(applicationAccessPoint);
            const mReq = { params: { accessPointId: "320ABFC3-04EF-4243-BC83-8DAE21383BF5" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_application_access_point(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getApplicationAccessPoint).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(applicationAccessPoint);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let applicationAccessPoint = new oxpd2.ApplicationService.ApplicationAccessPoint();
            jest.spyOn(applicationService, 'getApplicationAccessPoint').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { assetId: "320ABFC3-04EF-4243-BC83-8DAE21383BF5" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.get_application_access_point(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getApplicationAccessPoint).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('application_access_point_initiate_launch', () => {
        test('should call service and then respond with applicationAccessPointInitiateLaunch when multipart', async () => {
            // Setup Test

            let applicationAccessPointInitiateLaunch = new oxpd2.ApplicationService.ApplicationAccessPoint_InitiateLaunch();
            jest.spyOn(applicationService, 'applicationAccessPointInitiateLaunch').mockResolvedValue(applicationAccessPointInitiateLaunch);

            let resource = "--63db2a35df297e7f\r\n"
                + "Content-Type: application/json\r\n"
                + "Content-Disposition: attachment; name=content\r\n"
                + "\r\n"
                + "{\"$opMeta\":{\"contentFilter\":[\"*\"]},\"links\":[{\"href\":\"self\",\"rel\":\"self\"}]}\r\n"
                + "--63db2a35df297e7f\r\n"
                + "Content-Type: application/json\r\n"
                + "Content-Disposition: attachment; name=startIntent\r\n"
                + "\r\n"
                + "{\"mydata\": \"value\"}\r\n"
                + "\r\n"
                + "--63db2a35df297e7f--";

            const mReq = {
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                params: { accessPointId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" },
                body: Buffer.from(resource)
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.application_access_point_initiate_launch(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.applicationAccessPointInitiateLaunch).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(applicationAccessPointInitiateLaunch);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service and then respond with applicationAccessPointInitiateLaunch when not multipart', async () => {
            // Setup Test

            let applicationAccessPointInitiateLaunch = new oxpd2.ApplicationService.ApplicationAccessPoint_InitiateLaunch();
            jest.spyOn(applicationService, 'applicationAccessPointInitiateLaunch').mockResolvedValue(applicationAccessPointInitiateLaunch);
            const mReq = {
                headers: {
                    'content-type': `application/json`
                },
                params: { accessPointId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" },
                body: applicationAccessPointInitiateLaunch
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.application_access_point_initiate_launch(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.applicationAccessPointInitiateLaunch).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(applicationAccessPointInitiateLaunch);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(applicationService, 'applicationAccessPointInitiateLaunch').mockRejectedValueOnce(new Error("error"));

            let resource = "--63db2a35df297e7f\r\n"
                + "Content-Type: application/json\r\n"
                + "Content-Disposition: attachment; name=content\r\n"
                + "\r\n"
                + "{\"$opMeta\":{\"contentFilter\":[\"*\"]},\"links\":[{\"href\":\"self\",\"rel\":\"self\"}]}\r\n"
                + "--63db2a35df297e7f\r\n"
                + "Content-Type: application/json\r\n"
                + "Content-Disposition: attachment; name=startIntent\r\n"
                + "\r\n"
                + "{\"mydata\": \"value\"}\r\n"
                + "\r\n"
                + "--63db2a35df297e7f--";

            const mReq = {
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                params: { accessPointId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" },
                body: Buffer.from(resource)
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.application_access_point_initiate_launch(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.applicationAccessPointInitiateLaunch).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_application_agents', () => {
        test('should call service and send respond with application agents', async () => {
            // Setup Test

            let applicationAgents = new oxpd2.ApplicationService.ApplicationAgents();
            jest.spyOn(applicationService, 'enumerateApplicationAgents').mockResolvedValue(applicationAgents);
            const mReq = {};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.enumerate_application_agents(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.enumerateApplicationAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(applicationAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let applicationAgents = new oxpd2.ApplicationService.ApplicationAgents();
            jest.spyOn(applicationService, 'enumerateApplicationAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = {};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.enumerate_application_agents(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.enumerateApplicationAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_application_agent', () => {
        test('should call service and send respond with application agent', async () => {
            // Setup Test

            let applicationAgent = new oxpd2.ApplicationService.ApplicationAgent();
            jest.spyOn(applicationService, 'getApplicationAgent').mockResolvedValue(applicationAgent);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_application_agent(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getApplicationAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(applicationAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let applicationAgent = new oxpd2.ApplicationService.ApplicationAgent();
            jest.spyOn(applicationService, 'getApplicationAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.get_application_agent(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getApplicationAgent).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('refresh_application_agent', () => {
        test('should call service and send respond with application agent', async () => {
            // Setup Test

            let applicationAgentRefresh = new oxpd2.ApplicationService.ApplicationAgent_Refresh();
            jest.spyOn(applicationService, 'refreshApplicationAgent').mockResolvedValue(applicationAgentRefresh);
            const mReq = { 
                params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" },
                body: new oxpd2.ApplicationService.RefreshRequest
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.refresh_application_agent(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.refreshApplicationAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(applicationAgentRefresh);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let applicationAgentRefresh = new oxpd2.ApplicationService.ApplicationAgent_Refresh();
            jest.spyOn(applicationService, 'refreshApplicationAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" },
                body: new oxpd2.ApplicationService.RefreshRequest
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.refresh_application_agent(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.refreshApplicationAgent).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_application_runtime', () => {
        test('should call service and send respond with application runtime', async () => {
            // Setup Test

            let applicationRuntime = new oxpd2.ApplicationService.ApplicationRuntime();
            jest.spyOn(applicationService, 'getApplicationRuntime').mockResolvedValue(applicationRuntime);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_application_runtime(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getApplicationRuntime).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(applicationRuntime);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(applicationService, 'getApplicationRuntime').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.get_application_runtime(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getApplicationRuntime).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('reset_application_runtime', () => {
        test('should call service and send respond with applicationRuntimeReset', async () => {
            // Setup Test

            let applicationRuntimeReset = new oxpd2.ApplicationService.ApplicationRuntime_Reset();
            jest.spyOn(applicationService, 'resetApplicationRuntime').mockResolvedValue(applicationRuntimeReset);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.reset_application_runtime(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.resetApplicationRuntime).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(applicationRuntimeReset);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(applicationService, 'resetApplicationRuntime').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.reset_application_runtime(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.resetApplicationRuntime).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    })

    describe('get_current_context', () => {
        test('should call service and send respond with currentContext', async () => {
            // Setup Test

            let currentContext = new oxpd2.ApplicationService.CurrentContext();
            jest.spyOn(applicationService, 'getCurrentContext').mockResolvedValue(currentContext);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_current_context(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getCurrentContext).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(currentContext);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(applicationService, 'getCurrentContext').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.get_current_context(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getCurrentContext).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    })

    describe('reset_inactivity_timer_current_context', () => {
        test('should call service and send respond with resetRequest', async () => {
            // Setup Test

            let resetRequest = new oxpd2.ApplicationService.CurrentContext_ResetInactivityTimer();
            jest.spyOn(applicationService, 'resetInactivityTimerCurrentContext').mockResolvedValue(resetRequest);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.reset_inactivity_timer_current_context(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.resetInactivityTimerCurrentContext).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(resetRequest);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(applicationService, 'resetInactivityTimerCurrentContext').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.reset_inactivity_timer_current_context(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.resetInactivityTimerCurrentContext).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    })

    describe('exit_current_context', () => {
        test('should call service and send respond with exitRequest', async () => {
            // Setup Test

            let exitRequest = new oxpd2.ApplicationService.CurrentContext_Exit();
            jest.spyOn(applicationService, 'exitCurrentContext').mockResolvedValue(exitRequest);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.exit_current_context(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.exitCurrentContext).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(exitRequest);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(applicationService, 'exitCurrentContext').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.exit_current_context(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.exitCurrentContext).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('exec_current_context', () => {
        test('should call service and then respond with execCurrentContext when multipart', async () => {
            // Setup Test

            let execCurrentContext = new oxpd2.ApplicationService.CurrentContext_Exec();
            jest.spyOn(applicationService, 'execCurrentContext').mockResolvedValue(execCurrentContext);

            let resource = "--63db2a35df297e7f\r\n"
                + "Content-Type: application/json\r\n"
                + "Content-Disposition: attachment; name=content\r\n"
                + "\r\n"
                + "{\"applicationId\": \"12341234-1234-1234-1234-123412341234\"}\r\n"
                + "--63db2a35df297e7f\r\n"
                + "Content-Type: application/json\r\n"
                + "Content-Disposition: attachment; name=startIntent\r\n"
                + "\r\n"
                + "{\"mydata\": \"value\"}\r\n"
                + "\r\n"
                + "--63db2a35df297e7f--";

            const mReq = {
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.exec_current_context(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.execCurrentContext).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(execCurrentContext);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service and then respond with execCurrentContext when not multipart', async () => {
            // Setup Test

            let execCurrentContext = new oxpd2.ApplicationService.CurrentContext_Exec();
            jest.spyOn(applicationService, 'execCurrentContext').mockResolvedValue(execCurrentContext);
            const mReq = {
                headers: {
                    'content-type': `application/json`
                },
                body: execCurrentContext
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.exec_current_context(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.execCurrentContext).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(execCurrentContext);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(applicationService, 'execCurrentContext').mockRejectedValueOnce(new Error("error"));

            let resource = "--63db2a35df297e7f\r\n"
                + "Content-Type: application/json\r\n"
                + "Content-Disposition: attachment; name=content\r\n"
                + "\r\n"
                + "{\"applicationId\": \"12341234-1234-1234-1234-123412341234\"}\r\n"
                + "--63db2a35df297e7f\r\n"
                + "Content-Type: application/json\r\n"
                + "Content-Disposition: attachment; name=startIntent\r\n"
                + "\r\n"
                + "{\"mydata\": \"value\"}\r\n"
                + "\r\n"
                + "--63db2a35df297e7f--";

            const mReq = {
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.exec_current_context(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.execCurrentContext).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_start_intent', () => {
        test('should call service and send respond with startIntent', async () => {
            // Setup Test

            let startIntent = new oxpd2.ApplicationService.StartIntent();
            jest.spyOn(applicationService, 'getStartIntent').mockResolvedValue(startIntent);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_start_intent(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getStartIntent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(startIntent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(applicationService, 'getStartIntent').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.get_start_intent(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getStartIntent).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    })

    describe('get_runtime_chrome', () => {
        test('should call service and send respond with runtime chrome', async () => {
            // Setup Test
            let runtimeChrome = new oxpd2.ApplicationService.RuntimeChrome();
            jest.spyOn(applicationService, 'getRuntimeChrome').mockResolvedValue(runtimeChrome);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_runtime_chrome(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getRuntimeChrome).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(runtimeChrome);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let runtimeChrome = new oxpd2.ApplicationService.RuntimeChrome();
            jest.spyOn(applicationService, 'getRuntimeChrome').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_runtime_chrome(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getRuntimeChrome).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('replace_runtime_chrome', () => {
        test('should call service and send respond with runtime chrome', async () => {
            // Setup Test
            let runtimeChrome = new oxpd2.ApplicationService.RuntimeChrome();
            let applicationRuntimeChrome = new oxpd2.ApplicationTypes.ApplicationRuntimeChrome();
            let webApplicationRuntimeChrome = new oxpd2.ApplicationTypes.WebApplicationRuntimeChrome();
            webApplicationRuntimeChrome.headerTitle = "myHeaderTitle";
            applicationRuntimeChrome.webApplicationRuntimeChrome = webApplicationRuntimeChrome;
            runtimeChrome.applicationChrome = applicationRuntimeChrome;
            jest.spyOn(applicationService, 'replaceRuntimeChrome').mockResolvedValue(runtimeChrome);
            const mReq = { 
                body: new oxpd2.ApplicationService.RuntimeChrome_Replace
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.replace_runtime_chrome(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.replaceRuntimeChrome).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(runtimeChrome);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let runtimeChrome = new oxpd2.ApplicationService.RuntimeChrome();
            let applicationRuntimeChrome = new oxpd2.ApplicationTypes.ApplicationRuntimeChrome();
            let webApplicationRuntimeChrome = new oxpd2.ApplicationTypes.WebApplicationRuntimeChrome();
            webApplicationRuntimeChrome.headerTitle = "myHeaderTitle";
            applicationRuntimeChrome.webApplicationRuntimeChrome = webApplicationRuntimeChrome;
            runtimeChrome.applicationChrome = applicationRuntimeChrome;
            jest.spyOn(applicationService, 'replaceRuntimeChrome').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                body: new oxpd2.ApplicationService.RuntimeChrome_Replace
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.replace_runtime_chrome(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.replaceRuntimeChrome).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('modify_runtime_chrome', () => {
        test('should call service and send respond with runtime chrome', async () => {
            // Setup Test
            let runtimeChrome = new oxpd2.ApplicationService.RuntimeChrome();
            let applicationRuntimeChrome = new oxpd2.ApplicationTypes.ApplicationRuntimeChrome();
            let webApplicationRuntimeChrome = new oxpd2.ApplicationTypes.WebApplicationRuntimeChrome();
            webApplicationRuntimeChrome.headerTitle = "myHeaderTitle";
            applicationRuntimeChrome.webApplicationRuntimeChrome = webApplicationRuntimeChrome;
            runtimeChrome.applicationChrome = applicationRuntimeChrome;
            jest.spyOn(applicationService, 'modifyRuntimeChrome').mockResolvedValue(runtimeChrome);
            const mReq = { 
                body: new oxpd2.ApplicationService.RuntimeChrome_Modify
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.modify_runtime_chrome(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.modifyRuntimeChrome).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(runtimeChrome);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let runtimeChrome = new oxpd2.ApplicationService.RuntimeChrome();
            let applicationRuntimeChrome = new oxpd2.ApplicationTypes.ApplicationRuntimeChrome();
            let webApplicationRuntimeChrome = new oxpd2.ApplicationTypes.WebApplicationRuntimeChrome();
            webApplicationRuntimeChrome.headerTitle = "myHeaderTitle";
            applicationRuntimeChrome.webApplicationRuntimeChrome = webApplicationRuntimeChrome;
            runtimeChrome.applicationChrome = applicationRuntimeChrome;
            jest.spyOn(applicationService, 'modifyRuntimeChrome').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                body: new oxpd2.ApplicationService.RuntimeChrome_Modify
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.modify_runtime_chrome(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.modifyRuntimeChrome).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_i18n_assets', () => {
        test('should call service and send respond with i18n assets', async () => {
            // Setup Test
            let i18nAssets = new oxpd2.ApplicationService.I18nAssets();
            jest.spyOn(applicationService, 'enumerateI18nAssets').mockResolvedValue(i18nAssets);
            const mReq = {};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.enumerate_i18n_assets(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.enumerateI18nAssets).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(i18nAssets);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let i18nAssets = new oxpd2.ApplicationService.I18nAssets();
            jest.spyOn(applicationService, 'enumerateI18nAssets').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                query : {
                    includeMembers: true,
                    contentFilter: ""
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.enumerate_i18n_assets(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.enumerateI18nAssets).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_i18n_asset', () => {
        test('should call service and send respond with application agent', async () => {
            // Setup Test
            let i18nAsset = new oxpd2.ApplicationService.I18nAsset();
            jest.spyOn(applicationService, 'getI18nAsset').mockResolvedValue(i18nAsset);
            const mReq = { params: { assetId: "B40E175D-B09A-46E5-A458-114E56810051" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_i18n_asset(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getI18nAsset).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(i18nAsset);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let i18nAsset = new oxpd2.ApplicationService.I18nAsset();
            jest.spyOn(applicationService, 'getI18nAsset').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { assetId: "B40E175D-B09A-46E5-A458-114E56810051" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.get_i18n_asset(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getI18nAsset).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_message_center_agents', () => {
        test('should call service and send respond with application agents', async () => {
            // Setup Test
            let messageCenterAgents = new oxpd2.ApplicationService.MessageCenterAgents();
            jest.spyOn(applicationService, 'enumerateMessageCenterAgents').mockResolvedValue(messageCenterAgents);
            const mReq = {};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.enumerate_message_center_agents(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.enumerateMessageCenterAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(messageCenterAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let messageCenterAgents = new oxpd2.ApplicationService.MessageCenterAgents();
            jest.spyOn(applicationService, 'enumerateMessageCenterAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = {};
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.enumerate_message_center_agents(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.enumerateMessageCenterAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_message_center_agent', () => {
        test('should call service and send respond with application agent', async () => {
            // Setup Test
            let messageCenterAgent = new oxpd2.ApplicationService.MessageCenterAgent();
            jest.spyOn(applicationService, 'getMessageCenterAgent').mockResolvedValue(messageCenterAgent);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_message_center_agent(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getMessageCenterAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(messageCenterAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let messageCenterAgents = new oxpd2.ApplicationService.MessageCenterAgent();
            jest.spyOn(applicationService, 'getMessageCenterAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.get_message_center_agent(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getMessageCenterAgent).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_messages', () => {
        test('should call service and send respond with messages', async () => {
            // Setup Test
            let messages = new oxpd2.ApplicationService.Messages();
            jest.spyOn(applicationService, 'enumerateMessages').mockResolvedValue(messages);
            const mReq = { 
                params: { agentId: "E5BCA10B-3D21-4FF1-8BCC-A28F599AA873" },
                query : { includeMembers: true }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.enumerate_messages(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.enumerateMessages).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(messages);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let messages = new oxpd2.ApplicationService.Messages();
            jest.spyOn(applicationService, 'enumerateMessages').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { agentId: "E5BCA10B-3D21-4FF1-8BCC-A28F599AA873" },
                query : { includeMembers: true }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.enumerate_messages(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.enumerateMessages).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('create_message', () => {
        test('should call service and send respond with message', async () => {
            // Setup Test

            let message = new oxpd2.ApplicationService.Message();
            jest.spyOn(applicationService, 'createMessage').mockResolvedValue(message);
            const mReq = { 
                params: { agentId: "C0DD6166-43CF-45C6-998E-65BDE800D687" },
                body: new oxpd2.ApplicationService.Message_Create()
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.create_message(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.createMessage).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(message);
            expect(mRes.status).toBeCalledWith(201);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let message = new oxpd2.ApplicationService.Message();
            jest.spyOn(applicationService, 'createMessage').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { agentId: "C0DD6166-43CF-45C6-998E-65BDE800D687" },
                body: new oxpd2.ApplicationService.Message_Create()
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.create_message(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.createMessage).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_message', () => {
        test('should call service and send respond with message', async () => {
            // Setup Test
            let message = new oxpd2.ApplicationService.Messages();
            jest.spyOn(applicationService, 'getMessage').mockResolvedValue(message);
            const mReq = { 
                params: { 
                    agentId: "F46222DB-B83D-47CB-B22F-1CA7753E2E89",
                    messageId: "786D020E-6959-4391-994D-1651680548A4"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_message(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getMessage).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(message);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let message = new oxpd2.ApplicationService.Messages();
            jest.spyOn(applicationService, 'getMessage').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { 
                    agentId: "F46222DB-B83D-47CB-B22F-1CA7753E2E89",
                    messageId: "786D020E-6959-4391-994D-1651680548A4"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.get_message(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getMessage).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('delete_message', () => {
        test('should call service and send respond with opMeta', async () => {
            // Setup Test
            let opMeta = new oxpd2.BaseTypes.OperationMeta();
            jest.spyOn(applicationService, 'deleteMessage').mockResolvedValue(opMeta);
            const mReq = { 
                params: { 
                    agentId: "0AEF4A47-B449-4290-B2AF-E3CF5EF24811",
                    messageId: "0A137DEA-3CBE-485A-B3AD-45FE9C05AD67"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.delete_message(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.deleteMessage).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(opMeta);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let opMeta = new oxpd2.BaseTypes.OperationMeta();
            jest.spyOn(applicationService, 'deleteMessage').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                params: { 
                    agentId: "0AEF4A47-B449-4290-B2AF-E3CF5EF24811",
                    messageId: "0A137DEA-3CBE-485A-B3AD-45FE9C05AD67"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.delete_message(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.deleteMessage).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_homescreen', () => {
        test('should call service and send respond with homescreen', async () => {
            // Setup Test
            let homescreen = new oxpd2.ApplicationService.Homescreen();
            jest.spyOn(applicationService, 'getHomescreen').mockResolvedValue(homescreen);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.get_homescreen(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getHomescreen).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(homescreen);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(applicationService, 'getHomescreen').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.get_homescreen(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.getHomescreen).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('modify_homescreen', () => {
        test('should call service and send respond with homescreen', async () => {
            // Setup Test
            let homescreen = new oxpd2.ApplicationService.Homescreen();
            jest.spyOn(applicationService, 'modifyHomescreen').mockResolvedValue(homescreen);
            const mReq = { 
                body: new oxpd2.ApplicationService.Homescreen_Modify()
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationController.modify_homescreen(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.modifyHomescreen).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(homescreen);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(applicationService, 'modifyHomescreen').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                body: new oxpd2.ApplicationService.Homescreen_Modify()
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await applicationController.modify_homescreen(mReq, mRes, mNext);

            // Assert Results
            expect(applicationService.modifyHomescreen).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
