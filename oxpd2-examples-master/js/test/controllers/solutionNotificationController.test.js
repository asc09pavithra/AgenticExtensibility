import { describe, expect, jest, test } from '@jest/globals';
import solutionNotificationController from '../../src/controllers/solutionNotificationController.js';
import solutionNotificationService from '../../src/services/solutionNotificationService.js';
import oxpd2 from 'oxpd2';

describe('Solution Notification Controller', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('post_notification', () => {
        test('should call service and handle notification', async () => {
            // Setup Test
            let notification = new oxpd2.SolutionManagerTypes.SolutionNotification();
            let notificationWrapper = {
                sequence: 10,
                payloads: []
            };
            notificationWrapper.payloads.push(notification.toJSON());
            jest.spyOn(solutionNotificationService, 'handleNotification').mockResolvedValue();
            const mReq = { body: notificationWrapper };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionNotificationController.post_notification(mReq, mRes, mNext);

            // Assert Results
            expect(solutionNotificationService.handleNotification).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
        });
    });
});
