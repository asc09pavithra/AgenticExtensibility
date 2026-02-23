import { describe, expect, fail, jest, test } from '@jest/globals';
import logService from '../../src/services/logService.js';
import copyAgentService from '../../src/services/copyAgentService.js';
import oxpd2 from 'oxpd2';

global.fetch = jest.fn();

function GetBasicServicesDiscovery() {
    let servicesDiscovery = new oxpd2.CommonTypes.ServicesDiscovery();
    servicesDiscovery.version = "1.0.0";

    let services = [];
    let metadata = new oxpd2.CommonTypes.ServiceMetadata();
    metadata.version = "1.0.0";
    metadata.serviceGun = "com.hp.ext.service.copy.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/copy/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/copy/v1/capabilities";
    links.push(link);
    metadata.links = links;
    services.push(metadata);
    servicesDiscovery.services = services;
    let response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return servicesDiscovery.toJSON();
        }
    });
    return response;
}

function GetBasicHandleNotificationResponse() {
    const response = Promise.resolve({
        ok: true,
        status: 200
    });

    return response;
}

describe('copyAgentService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('handle notification should log when provided copy notification', async () => {
        logService.resetLogs();
        // Setup Test
        let handleNotificationResponse = GetBasicHandleNotificationResponse();
        let servicesDiscovery = GetBasicServicesDiscovery();
        fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => handleNotificationResponse);

        let copyNotification = new oxpd2.CopyService.CopyNotification();
        let copyJobId = new oxpd2.CopyService.CopyJobIdentifier("D3B01D1B-7BB5-43AC-A99B-3B1EC61A80CF");
        let notificationContent = new oxpd2.CopyService.CopyJobNotificationContent();
        notificationContent.copyJobId = copyJobId;
        copyNotification.jobNotification = notificationContent;

        // Test
        await copyAgentService.handleNotification(copyNotification);

        // Assert Results
        let log = await logService.getLog("copyNotifications");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
    });
});
