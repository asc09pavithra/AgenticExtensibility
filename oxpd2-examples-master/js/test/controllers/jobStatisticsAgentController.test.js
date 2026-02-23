import { describe, expect, jest, test } from '@jest/globals';
import jobStatisticsAgentController from '../../src/controllers/jobStatisticsAgentController.js';
import jobStatisticsAgentService from '../../src/services/jobStatisticsAgentService.js';
import oxpd2 from 'oxpd2';

describe('Job Statistics Agent Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('post_notification', () => {
        test('should call service and handle notification', async () => {
            // Setup Test
            let statisticsCallbackPayload = new oxpd2.JobStatisticsService.StatisticsCallbackPayload();

            jest.spyOn(jobStatisticsAgentService, 'handleNotification').mockResolvedValue();
            const mReq = { body: statisticsCallbackPayload };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await jobStatisticsAgentController.post_notification(mReq, mRes, mNext);

            // Assert Results
            expect(jobStatisticsAgentService.handleNotification).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
        });
    });
});
