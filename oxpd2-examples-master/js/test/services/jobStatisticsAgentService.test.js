import { describe, expect, jest, test, fail } from '@jest/globals';
import jobStatisticsAgentService from '../../src/services/jobStatisticsAgentService.js';
import logService from '../../src/services/logService.js';
import oxpd2 from 'oxpd2';

global.fetch = jest.fn();

describe('jobStatisticsAgentService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('handle notification should get log successfully', async () => {
        logService.resetLogs();
        // Setup Test

        let statisticsCallbackPayload = new oxpd2.JobStatisticsService.StatisticsCallbackPayload();

        statisticsCallbackPayload.lastSequenceNumberNotified = 10;
        statisticsCallbackPayload.lastSequenceNumberProcessed = 5;

        // Test
        await jobStatisticsAgentService.handleNotification(statisticsCallbackPayload);

        // Assert Results
        let log = await logService.getLog("jobStatisticsNotifications");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
    });
});
