import { describe, expect, fail, jest, test } from '@jest/globals';
import { BoundDevice } from '../../src/models/boundDevice.js';
import { LogItem } from '../../src/models/logItem.js';
import deviceManagementService from '../../src/services/deviceManagementService.js';
import logService from '../../src/services/logService.js';
import solutionNotificationService from '../../src/services/solutionNotificationService.js';
import oxpd2 from 'oxpd2';

const mockValue = jest.Mock;

global.fetch = jest.fn();

function GetBasicServicesDiscovery() {
    let servicesDiscovery = new oxpd2.CommonTypes.ServicesDiscovery();
    servicesDiscovery.version = "1.0.0";

    let services = [];
    let metadata = new oxpd2.CommonTypes.ServiceMetadata();
    metadata.version = "1.0.0";
    metadata.serviceGun = "com.hp.ext.service.solutionManager.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/solutionManager/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/solutionManager/v1/capabilities";
    links.push(link);
    link.rel = "installer";
    link.href = "/ext/solutionManager/v1/installer";
    links.push(link);
    link.rel = "solutions";
    link.href = "/ext/solutionManager/v1/solutions";
    links.push(link);
    link.rel = "i18nAssets";
    link.href = "/ext/solutionManager/v1/i18nAssets";
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

function GetBasicAuthCodeGrantResponse() {
    var token = new oxpd2.Oauth2Client.Token();
    token.accessToken = "THE-TOKEN";
    token.tokenType = "Bearer";
    token.scope = "THE-SCOPE";
    token.expiresIn = 12345;

    const response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return token.toJSON();
        }
    });

    return response;
}

describe('solutionNotificationService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('handle notificaiton should get authorization grant when type is ntAuthCode', async () => {
        logService.resetLogs();
        // Setup Test
        var device = new BoundDevice();
        device.networkAddress = "12.23.12.42";
        jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

        let authCodeGrantResponse = GetBasicAuthCodeGrantResponse();
        let servicesDiscovery = GetBasicServicesDiscovery();
        fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => authCodeGrantResponse);

        let notification = new oxpd2.SolutionManagerTypes.SolutionNotification();
        notification.notificationType = oxpd2.SolutionManagerTypes.NotificationType.ntAuthCode;
        let authCodeNotificationPayload = new oxpd2.SolutionManagerTypes.AuthCodeNotificationPayload();
        authCodeNotificationPayload.code = "code";
        let payloadData = new oxpd2.SolutionManagerTypes.NotificationPayloadData();
        payloadData.authCodeNotificationPayload = authCodeNotificationPayload;
        notification.notificationPayload = payloadData;

        // Test
        await solutionNotificationService.handleNotification(notification);

        // Assert Results
        let log = await logService.getLog("solutionNotifications");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
        expect(log[0].type == "ntAuthCode").toBe(true);
    });

    test('handle notificaiton should log when no bound device', async () => {
        logService.resetLogs();
        // Setup Test
        let authCodeGrantResponse = GetBasicAuthCodeGrantResponse();
        let servicesDiscovery = GetBasicServicesDiscovery();
        fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => authCodeGrantResponse);

        let notification = new oxpd2.SolutionManagerTypes.SolutionNotification();
        notification.notificationType = oxpd2.SolutionManagerTypes.NotificationType.ntAuthCode;
        let authCodeNotificationPayload = new oxpd2.SolutionManagerTypes.AuthCodeNotificationPayload();
        authCodeNotificationPayload.code = "code";
        let payloadData = new oxpd2.SolutionManagerTypes.NotificationPayloadData();
        payloadData.authCodeNotificationPayload = authCodeNotificationPayload;
        notification.notificationPayload = payloadData;

        // Test
        await solutionNotificationService.handleNotification(notification);

        // Assert Results
        let log = await logService.getLog("solutionNotifications");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
        expect(log[0].type == "ntAuthCode").toBe(true);
    });
});
