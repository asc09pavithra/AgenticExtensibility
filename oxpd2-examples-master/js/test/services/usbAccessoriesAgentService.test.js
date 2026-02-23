import { describe, expect, fail, jest, test } from '@jest/globals';
import { BoundDevice } from '../../src/models/boundDevice.js';
import { LogItem } from '../../src/models/logItem.js';
import deviceManagementService from '../../src/services/deviceManagementService.js';
import logService from '../../src/services/logService.js';
import usbAccessoriesAgentService from '../../src/services/usbAccessoriesAgentService.js';
import oxpd2 from 'oxpd2';

const mockValue = jest.Mock;

global.fetch = jest.fn();

function GetBasicServicesDiscovery() {
    let servicesDiscovery = new oxpd2.CommonTypes.ServicesDiscovery();
    servicesDiscovery.version = "1.0.0";

    let services = [];
    let metadata = new oxpd2.CommonTypes.ServiceMetadata();
    metadata.version = "1.0.0";
    metadata.serviceGun = "com.hp.ext.service.usbAccessories.version.1";

    let links = [];
    let link = new oxpd2.BaseTypes.Link();
    link.rel = "self";
    link.href = "/ext/usbAccessories/v1/capabilities";
    links.push(link);
    link.rel = "capabilities";
    link.href = "/ext/usbAccessories/v1/capabilities";
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

function GetBasicUsbAccessoriesAgentResponse() {
    const response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return null;
        }
    });

    return response;
}

function createEnvelopeFromPayload(payload) {
    let envelope = new oxpd2.UsbAccessoriesService.UsbCallbackEnvelope();
    envelope.usbCallback = payload;
    return envelope;
}

describe('usbAccessoriesAgentService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('handle usb registration with attached notification should log usbAttached', async () => {
        logService.resetLogs();
        // Setup Test
        var device = new BoundDevice();
        device.networkAddress = "12.23.12.42";
        jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

        let usbAccessoriesAgentResponse = GetBasicUsbAccessoriesAgentResponse();
        let servicesDiscovery = GetBasicServicesDiscovery();
        fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => usbAccessoriesAgentResponse);

        let registrationPayload = new oxpd2.UsbAccessoriesService.UsbRegistrationPayload();
        registrationPayload.usbAttached = new oxpd2.UsbAccessoriesService.UsbAttached();

        // Test
        await usbAccessoriesAgentService.handleUsbRegistrationNotification(registrationPayload);

        // Assert Results
        let log = await logService.getLog("usbregistration");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
        expect(log[0].type).toBe(registrationPayload.usbAttached.typeName);
    });

    test('handle usb registration with detached notification should log usbDetached', async () => {
        logService.resetLogs();
        // Setup Test
        var device = new BoundDevice();
        device.networkAddress = "12.23.12.42";
        jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

        let usbAccessoriesAgentResponse = GetBasicUsbAccessoriesAgentResponse();
        let servicesDiscovery = GetBasicServicesDiscovery();
        fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => usbAccessoriesAgentResponse);

        let registrationPayload = new oxpd2.UsbAccessoriesService.UsbRegistrationPayload();
        registrationPayload.usbDetached = new oxpd2.UsbAccessoriesService.UsbDetached();

        // Test
        await usbAccessoriesAgentService.handleUsbRegistrationNotification(registrationPayload);

        // Assert Results
        let log = await logService.getLog("usbregistration");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
        expect(log[0].type).toBe(registrationPayload.usbDetached.typeName);
    });

    test('handle usb callback with hidRead should log hidRead', async () => {
        logService.resetLogs();
        // Setup Test
        var device = new BoundDevice();
        device.networkAddress = "12.23.12.42";
        jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

        let usbAccessoriesAgentResponse = GetBasicUsbAccessoriesAgentResponse();
        let servicesDiscovery = GetBasicServicesDiscovery();
        fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => usbAccessoriesAgentResponse);

        let callbackPayload = new oxpd2.UsbAccessoriesService.UsbCallback();
        callbackPayload.hidRead = new oxpd2.UsbAccessoriesService.HidReadCallbackPayload();

        // Test
        await usbAccessoriesAgentService.handleUsbCallback(createEnvelopeFromPayload(callbackPayload));

        // Assert Results
        let log = await logService.getLog("usbcallback");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
        expect(log[0].type).toBe(callbackPayload.hidRead.typeName);
    });

    test('handle usb callback with usbRead should log usbRead', async () => {
        logService.resetLogs();
        // Setup Test
        var device = new BoundDevice();
        device.networkAddress = "12.23.12.42";
        jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

        let usbAccessoriesAgentResponse = GetBasicUsbAccessoriesAgentResponse();
        let servicesDiscovery = GetBasicServicesDiscovery();
        fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => usbAccessoriesAgentResponse);

        let callbackPayload = new oxpd2.UsbAccessoriesService.UsbCallback();
        callbackPayload.usbRead = new oxpd2.UsbAccessoriesService.UsbReadCallbackPayload().toJSON();

        // Test
        await usbAccessoriesAgentService.handleUsbCallback(createEnvelopeFromPayload(callbackPayload));

        // Assert Results
        let log = await logService.getLog("usbcallback");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
        expect(log[0].type).toBe(callbackPayload.usbRead.typeName);
    });

    test('handle usb callback with usbWrite should log usbWrite', async () => {
        logService.resetLogs();
        // Setup Test
        var device = new BoundDevice();
        device.networkAddress = "12.23.12.42";
        jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

        let usbAccessoriesAgentResponse = GetBasicUsbAccessoriesAgentResponse();
        let servicesDiscovery = GetBasicServicesDiscovery();
        fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => usbAccessoriesAgentResponse);

        let callbackPayload = new oxpd2.UsbAccessoriesService.UsbCallback();
        callbackPayload.usbWrite = new oxpd2.UsbAccessoriesService.UsbWriteCallbackPayload().toJSON();

        // Test
        await usbAccessoriesAgentService.handleUsbCallback(createEnvelopeFromPayload(callbackPayload));

        // Assert Results
        let log = await logService.getLog("usbcallback");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
        expect(log[0].type).toBe(callbackPayload.usbWrite.typeName);
    });

    test('handle usb callback with usbClosed should log usbClosed', async () => {
        logService.resetLogs();
        // Setup Test
        var device = new BoundDevice();
        device.networkAddress = "12.23.12.42";
        jest.spyOn(deviceManagementService, 'currentDevice', 'get').mockReturnValue(device);

        let usbAccessoriesAgentResponse = GetBasicUsbAccessoriesAgentResponse();
        let servicesDiscovery = GetBasicServicesDiscovery();
        fetch.mockImplementationOnce(() => servicesDiscovery).mockImplementationOnce(() => usbAccessoriesAgentResponse);

        let callbackPayload = new oxpd2.UsbAccessoriesService.UsbCallback();
        callbackPayload.usbClosed = new oxpd2.UsbAccessoriesService.UsbClosedCallbackPayload().toJSON();

        // Test
        await usbAccessoriesAgentService.handleUsbCallback(createEnvelopeFromPayload(callbackPayload));

        // Assert Results
        let log = await logService.getLog("usbcallback");
        expect(log).toBeTruthy();
        expect(log.length).toBe(1);
        expect(log[0].type).toBe(callbackPayload.usbClosed.typeName);
    });
});
