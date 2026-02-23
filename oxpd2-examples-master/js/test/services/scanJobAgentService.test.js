import { describe, expect, jest, test, fail } from '@jest/globals';
import scanJobAgentService from '../../src/services/scanJobAgentService.js';
import logService from '../../src/services/logService.js';
import oxpd2 from 'oxpd2';

global.fetch = jest.fn();

describe('scanJobAgentService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('handle notification should get log successfully', async () => {
        logService.resetLogs();
        // Setup Test

        let scanNotification = new oxpd2.ScanJobService.ScanNotification();
        let jobNotification = new oxpd2.ScanJobService.ScanJobNotificationContent();
        jobNotification.scanJobId = "1C92487E-4614-48F1-A6DB-18E2BA8D646F";
        scanNotification.jobNotification = jobNotification;

        // Test
        await scanJobAgentService.handleNotification(scanNotification);

        // Assert Results
        let log = await logService.getLog("scanNotifications");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
    });

    test('handle ScanJobReciver should log successfully', async () => {
        logService.resetLogs();
        // Setup Test
        let scanJobReceived = new oxpd2.ScanJobService.ServiceTargetContent();

        // Test
        await scanJobAgentService.handleScanJobReceiver(scanJobReceived);

        // Assert Results
        let log = await logService.getLog("scanJobReceiver");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
    });
});
