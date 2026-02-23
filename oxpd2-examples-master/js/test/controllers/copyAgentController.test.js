import { describe, expect, jest, test } from '@jest/globals';
import copyAgentController from '../../src/controllers/copyAgentController.js';
import copyAgentService from '../../src/services/copyAgentService.js';
import oxpd2 from 'oxpd2';

describe('Copy Agent Controller', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('post_notification', () => {
        test('should call service and handle notification', async () => {
            // Setup Test
            let notification = new oxpd2.CopyService.CopyNotification();
            let notificationWrapper = {
                sequence: 10,
                payloads: []
            };
            notificationWrapper.payloads.push(notification.toJSON());

            jest.spyOn(copyAgentService, 'handleNotification').mockResolvedValue();
            const mReq = { body: notificationWrapper };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await copyAgentController.post_notification(mReq, mRes, mNext);

            // Assert Results
            expect(copyAgentService.handleNotification).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
        });
    });
});
