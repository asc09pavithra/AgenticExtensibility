import { describe, expect, jest, test } from '@jest/globals';
import usbAccessoriesAgentController from '../../src/controllers/usbAccessoriesAgentController.js';
import usbAccessoriesAgentService from '../../src/services/usbAccessoriesAgentService.js';
import logService from '../../src/services/logService.js';
import oxpd2 from 'oxpd2';

describe('Usb Accessories Agent Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        logService.resetLogs();
    });

    describe('registration_target', () => {
        test('should call service and handle notification', async () => {
            // Setup Test
            let notification = new oxpd2.UsbAccessoriesService.UsbRegistrationPayload();
            jest.spyOn(usbAccessoriesAgentService, 'handleUsbRegistrationNotification').mockResolvedValue();
            const mReq = { body: { registrationPayload: notification.toJSON() } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesAgentController.registration_target(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesAgentService.handleUsbRegistrationNotification).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
        });
    });

    describe('operation_callback_target', () => {
        test('should call service and handle notification', async () => {
            // Setup Test
            let notification = {
                usbCallback: {}
            };
            jest.spyOn(usbAccessoriesAgentService, 'handleUsbCallback').mockResolvedValue();
            const mReq = { body: notification };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesAgentController.operation_callback_target(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesAgentService.handleUsbCallback).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
        });
    });
});
