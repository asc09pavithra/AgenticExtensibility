import { describe, expect, jest, test } from '@jest/globals';
import scanJobAgentController from '../../src/controllers/scanJobAgentController.js';
import scanJobAgentService from '../../src/services/scanJobAgentService.js';
import oxpd2 from 'oxpd2';

describe('Scan Job Agent Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('post_notification', () => {
        test('should call service and handle notification', async () => {
            // Setup Test
            let scanNotification = new oxpd2.ScanJobService.ScanNotification();
            let notificationWrapper = {
                sequence: 10,
                payloads: []
            };
            notificationWrapper.payloads.push(scanNotification.toJSON());

            jest.spyOn(scanJobAgentService, 'handleNotification').mockResolvedValue();
            const mReq = { body: notificationWrapper };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobAgentController.post_notification(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobAgentService.handleNotification).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
        });
    });

    describe('receive_scan_job', () => {
        test('should call service and send respond with log when multipart', async () => {
            // Setup Test

            jest.spyOn(scanJobAgentService, 'handleScanJobReceiver').mockResolvedValue();

            let resource = "--63db2a35df297e7f\r\n" +
                "Content-Disposition: form-data; name=content\r\n" +
                "Content-Type: application/json \r\n" +
                "\r\n" +
                "{\r\n" +
                "\"deliveredScanFiles\": 10\r\n" +
                ",\r\n" +
                "\"includedScanFiles\": 10\r\n" +
                ",\r\n" +
                "\"metadataFile\": false\r\n" +
                ",\r\n" +
                "\"transmittingState\": \"tsStarted\"\r\n" +
                ",\r\n" +
                "\"scanJobId\": \"b3453ac1-9091-5ca4-64ad-48a439c49eca\"\r\n" +
                "}\r\n" +


                "--63db2a35df297e7f\r\n" +
                "Content-Disposition: attachment; name=\"scanFile\"; filename=\"scanfile.json\"\r\n" +
                "Content-Type: multipart/form-data\r\n" +
                "\r\n" +
                "scanfile.json\r\n" +
                "--63db2a35df297e7f--";

            const mReq = {
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobAgentController.receive_scan_job(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobAgentService.handleScanJobReceiver).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service and send respond with log when multipart and unknown scanJobId', async () => {
            // Setup Test

            jest.spyOn(scanJobAgentService, 'handleScanJobReceiver').mockResolvedValue();

            let resource = "--63db2a35df297e7f\r\n" +
                "Content-Disposition: form-data; name=content\r\n" +
                "Content-Type: application/json \r\n" +
                "\r\n" +
                "{\r\n" +
                "\"deliveredScanFiles\": 10\r\n" +
                ",\r\n" +
                "\"includedScanFiles\": 10\r\n" +
                ",\r\n" +
                "\"metadataFile\": false\r\n" +
                ",\r\n" +
                "\"transmittingState\": \"tsStarted\"\r\n" +
                "}\r\n" +


                "--63db2a35df297e7f\r\n" +
                "Content-Disposition: attachment; name=\"scanFile\"; filename=\"scanfile.json\"\r\n" +
                "Content-Type: multipart/form-data\r\n" +
                "\r\n" +
                "scanfile.json\r\n" +
                "--63db2a35df297e7f--";

            const mReq = {
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobAgentController.receive_scan_job(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobAgentService.handleScanJobReceiver).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service and send respond with log when not multipart', async () => {
            // Setup Test
            let scanJobReceived = new oxpd2.ScanJobService.ServiceTargetContent();
            scanJobReceived.transmittingState = oxpd2.ScanJobService.TransmittingState.tsStarted;
            jest.spyOn(scanJobAgentService, 'handleScanJobReceiver').mockResolvedValue();
            const mReq = {
                headers: {
                    'content-type': `application/json`
                },
                body: scanJobReceived
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await scanJobAgentController.receive_scan_job(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobAgentService.handleScanJobReceiver).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(scanJobAgentService, 'handleScanJobReceiver').mockRejectedValueOnce(new Error("error"));

            let resource = "--63db2a35df297e7f\r\n" +
            "Content-Disposition: form-data; name=content\r\n" +
            "Content-Type: application/json \r\n" +
            "\r\n" +
            "{\r\n" +
            "\"deliveredScanFiles\": 10\r\n" +
            ",\r\n" +
            "\"includedScanFiles\": 10\r\n" +
            ",\r\n" +
            "\"metadataFile\": false\r\n" +
            ",\r\n" +
            "\"transmittingState\": \"tsStarted\"\r\n" +
            ",\r\n" +
            "\"scanJobId\": \"b3453ac1-9091-5ca4-64ad-48a439c49eca\"\r\n" +
            "}\r\n" +


            "--63db2a35df297e7f\r\n" +
            "Content-Disposition: attachment; name=\"scanFile\"; filename=\"scanfile.json\"\r\n" +
            "Content-Type: multipart/form-data\r\n" +
            "\r\n" +
            "scanfile.json\r\n" +
            "--63db2a35df297e7f--";

            const mReq = {
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await scanJobAgentController.receive_scan_job(mReq, mRes, mNext);

            // Assert Results
            expect(scanJobAgentService.handleScanJobReceiver).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
