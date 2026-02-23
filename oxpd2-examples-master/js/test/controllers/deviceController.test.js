import { describe, expect, jest, test } from '@jest/globals';
import deviceController from '../../src/controllers/deviceController.js';
import deviceService from '../../src/services/deviceService.js';
import oxpd2 from 'oxpd2';

describe('Device Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.DeviceService.Capabilities();
            jest.spyOn(deviceService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.DeviceService.Capabilities();
            jest.spyOn(deviceService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await deviceController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_identity', () => {
        test('should call service and send respond with identity', async () => {
            // Setup Test
            let identity = new oxpd2.DeviceService.Identity();
            jest.spyOn(deviceService, 'getIdentity').mockResolvedValue(identity);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceController.get_identity(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getIdentity).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(identity);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let identity = new oxpd2.DeviceService.Identity();
            jest.spyOn(deviceService, 'getIdentity').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await deviceController.get_identity(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getIdentity).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_status', () => {
        test('should call service and send respond with status', async () => {
            // Setup Test
            let status = new oxpd2.DeviceService.Status();
            jest.spyOn(deviceService, 'getStatus').mockResolvedValue(status);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceController.get_status(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getStatus).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(status);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let status = new oxpd2.DeviceService.Status();
            jest.spyOn(deviceService, 'getStatus').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await deviceController.get_status(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getStatus).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_email', () => {
        test('should call service and send respond with email', async () => {
            // Setup Test
            let email = new oxpd2.DeviceService.Email();
            jest.spyOn(deviceService, 'getEmail').mockResolvedValue(email);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceController.get_email(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getEmail).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(email);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let email = new oxpd2.DeviceService.Email();
            jest.spyOn(deviceService, 'getEmail').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await deviceController.get_email(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getEmail).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_scanner', () => {
        test('should call service and send respond with scanner', async () => {
            // Setup Test
            let scanner = new oxpd2.DeviceService.Scanner();
            jest.spyOn(deviceService, 'getScanner').mockResolvedValue(scanner);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceController.get_scanner(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getScanner).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(scanner);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let scanner = new oxpd2.DeviceService.Scanner();
            jest.spyOn(deviceService, 'getScanner').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await deviceController.get_scanner(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getScanner).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_deployment_information', () => {
        test('should call service and send respond with deploymentInformation', async () => {
            // Setup Test
            let deploymentInformation = new oxpd2.DeviceService.DeploymentInformation();
            jest.spyOn(deviceService, 'getDeploymentInformation').mockResolvedValue(deploymentInformation);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await deviceController.get_deployment_information(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getDeploymentInformation).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(deploymentInformation);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let deploymentInformation = new oxpd2.DeviceService.DeploymentInformation();
            jest.spyOn(deviceService, 'getDeploymentInformation').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await deviceController.get_deployment_information(mReq, mRes, mNext);

            // Assert Results
            expect(deviceService.getDeploymentInformation).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
