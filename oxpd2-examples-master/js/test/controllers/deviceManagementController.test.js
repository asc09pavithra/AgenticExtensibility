import { describe, expect, jest, test } from '@jest/globals';
import deviceManagementController from '../../src/controllers/deviceManagementController.js';
import { BoundDevice } from '../../src/models/boundDevice.js';
import  deviceManagementService  from '../../src/services/deviceManagementService.js';
import oxpd2 from 'oxpd2';

describe('Device Management Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('bind_device', () => {
        test('should call service and send respond with device', async () => {
            // Setup Test
            let target = new BoundDevice();
            target.bindStatus = "bound";
            target.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'bindDevice').mockResolvedValueOnce(target);
            const mReq = { body: { networkAddress: target.networkAddress } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.bind_device(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.bindDevice).toBeCalledWith(target.networkAddress);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(target);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let target = new BoundDevice();
            target.bindStatus = "bound";
            target.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'bindDevice').mockRejectedValueOnce(new Error("error"));
            const mReq = { body: { networkAddress: target.networkAddress } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.bind_device(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.bindDevice).toBeCalledWith(target.networkAddress);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('unbind_device', () => {
        test('should call service and respond with no content', async () => {
            // Setup Test
            jest.spyOn(deviceManagementService, 'unbindDevice').mockResolvedValueOnce(null);
            const mReq = { body: { } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.unbind_device(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.unbindDevice).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith();
            expect(mRes.status).toBeCalledWith(204);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(deviceManagementService, 'unbindDevice').mockRejectedValueOnce(new Error("error"));
            const mReq = { body: { } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.unbind_device(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.unbindDevice).toBeCalledWith();
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_device', () => {
        test('should call service and respond with device', async () => {
            // Setup Test
            let target = new BoundDevice();
            target.bindStatus = "bound";
            target.networkAddress = "12.23.12.42";
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(target);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.get_device(mReq, mRes, mNext);

            // Assert Results
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(target);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service and respond with no content when device is not set', async () => {
            // Setup Test
            jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(null);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.get_device(mReq, mRes, mNext);

            // Assert Results
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(null);
            expect(mRes.status).toBeCalledWith(204);
        });
    });

    describe('password_grant', () => {
        test('should call service and respond with a token', async () => {
            // Setup Test
            let token = new oxpd2.Oauth2Client.Token();
            jest.spyOn(deviceManagementService, 'passwordGrant').mockReturnValue(token);
            const mReq = {
                body: {
                    username: "admin",
                    password: "12345678"
                } 
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.password_grant(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.passwordGrant).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(token);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service and respond with no content when device is not set', async () => {
            // Setup Test
            jest.spyOn(deviceManagementService, 'passwordGrant').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                body: {
                    username: "admin",
                    password: "12345678"
                } 
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.password_grant(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.passwordGrant).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('services_discovery', () => {
        test('should call service and respond with deviceInfo', async () => {
            // Setup Test
            let sd = new Object();
            jest.spyOn(deviceManagementService, 'getServicesDiscovery').mockReturnValue(sd);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.services_discovery(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.getServicesDiscovery).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(sd);
        });

        test('should call service and respond with no content when device is not set', async () => {
            // Setup Test
            jest.spyOn(deviceManagementService, 'getServicesDiscovery').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.services_discovery(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.getServicesDiscovery).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('device_info', () => {
        test('should call service and respond with deviceInfo', async () => {
            // Setup Test
            let deviceInfo = new Object();
            jest.spyOn(deviceManagementService, 'getDeviceInformation').mockReturnValue(deviceInfo);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.device_info(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.getDeviceInformation).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(deviceInfo);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service and respond with no content when device is not set', async () => {
            // Setup Test
            jest.spyOn(deviceManagementService, 'getDeviceInformation').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.device_info(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.getDeviceInformation).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('tokens', () => {
        test('should call service and respond with tokens', async () => {
            // Setup Test
            let token = new oxpd2.Oauth2Client.Token();
            let tokens = [token]
            jest.spyOn(deviceManagementService, 'getTokens').mockReturnValue(tokens);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceManagementController.tokens(mReq, mRes, mNext);

            // Assert Results
            expect(deviceManagementService.getTokens).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(tokens);
            expect(mRes.status).toBeCalledWith(200);
        });
    });
});
