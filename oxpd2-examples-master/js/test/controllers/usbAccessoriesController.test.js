import { describe, expect, jest, test } from '@jest/globals';

import oxpd2 from 'oxpd2';
import usbAccessoriesController from '../../src/controllers/usbAccessoriesController.js';
import usbAccessoriesService from '../../src/services/usbAccessoriesService.js';

describe('Usb Accessories Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.UsbAccessoriesService.Capabilities();
            jest.spyOn(usbAccessoriesService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.UsbAccessoriesService.Capabilities();
            jest.spyOn(usbAccessoriesService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_accessories_agents', () => {
        test('should call service and send respond with accessories agents', async () => {
            // Setup Test
            let accessoriesAgents = new oxpd2.UsbAccessoriesService.UsbAccessoriesAgents();
            jest.spyOn(usbAccessoriesService, 'enumerateAccessoriesAgents').mockResolvedValue(accessoriesAgents);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.enumerate_accessories_agents(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.enumerateAccessoriesAgents).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(accessoriesAgents);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let accessoriesAgents = new oxpd2.UsbAccessoriesService.UsbAccessoriesAgents();
            jest.spyOn(usbAccessoriesService, 'enumerateAccessoriesAgents').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.enumerate_accessories_agents(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.enumerateAccessoriesAgents).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_accessories_agent', () => {
        test('should call service and send respond with accessories agent', async () => {
            // Setup Test
            let accessoriesAgent = new oxpd2.UsbAccessoriesService.UsbAccessoriesAgent();
            jest.spyOn(usbAccessoriesService, 'getAccessoriesAgent').mockResolvedValue(accessoriesAgent);
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.get_accessories_agent(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.getAccessoriesAgent).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(accessoriesAgent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let accessoriesAgent = new oxpd2.UsbAccessoriesService.UsbAccessoriesAgent();
            jest.spyOn(usbAccessoriesService, 'getAccessoriesAgent').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "54E666C3-370B-4834-BB30-2E72A6DF20C4" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.get_accessories_agent(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_accessories', () => {
        test('should call service and send respond with accessories', async () => {
            // Setup Test
            let accessories = new oxpd2.UsbAccessoriesService.Accessories();
            jest.spyOn(usbAccessoriesService, 'enumerateAccessories').mockResolvedValue(accessories);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.enumerate_accessories(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.enumerateAccessories).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(accessories);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let accessories = new oxpd2.UsbAccessoriesService.Accessories();
            jest.spyOn(usbAccessoriesService, 'enumerateAccessories').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.enumerate_accessories(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.enumerateAccessories).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_accessory', () => {
        test('should call service and send respond with accessory', async () => {
            // Setup Test
            let accessory = new oxpd2.UsbAccessoriesService.Accessory();
            jest.spyOn(usbAccessoriesService, 'getAccessory').mockResolvedValue(accessory);
            const mReq = { params: { accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.get_accessory(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.getAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(accessory);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let accessory = new oxpd2.UsbAccessoriesService.Accessory();
            jest.spyOn(usbAccessoriesService, 'getAccessory').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.get_accessory(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_accessory_hid', () => {
        test('should call service and send response with hid', async () => {
            // Setup Test
            let hid = new oxpd2.UsbAccessoriesService.Hid();
            jest.spyOn(usbAccessoriesService, 'getUsbAccessoryHid').mockResolvedValue(hid);
            const mReq = { params: { accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.get_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.getUsbAccessoryHid).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(hid);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(usbAccessoriesService, 'getUsbAccessoryHid').mockRejectedValueOnce(new Error("error"));
            const mReq = { params: { agentId: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE" } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.get_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('open_accessory_hid', () => {
        test('should call openOwnedAccessoryHid and send response with hid_open', async () => {
            // Setup Test
            let hid_open = new oxpd2.UsbAccessoriesService.Hid_Open();
            jest.spyOn(usbAccessoriesService, 'openOwnedAccessoryHid').mockResolvedValue(hid_open);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.openOwnedAccessoryHid).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(hid_open);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call openSharedAccessoryHid and send response with hid_open', async () => {
            // Setup Test
            let hid_open = new oxpd2.UsbAccessoriesService.Hid_Open();
            jest.spyOn(usbAccessoriesService, 'openSharedAccessoryHid').mockResolvedValue(hid_open);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE"
                },
                query: {
                    isOwned: false
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.openSharedAccessoryHid).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(hid_open);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(usbAccessoriesService, 'openOwnedAccessoryHid').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_open_accessory_hid', () => {
        test('should call service with true isOwned and send response with openHIDAccessory', async () => {
            // Setup Test
            let openHIDAccessory = new oxpd2.UsbAccessoriesService.OpenHIDAccessory();
            jest.spyOn(usbAccessoriesService, 'getOpenHIDAccessory').mockResolvedValue(openHIDAccessory);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.get_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.getOpenHIDAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(openHIDAccessory);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service with missing isOwned and send response with openHIDAccessory', async () => {
            // Setup Test
            let openHIDAccessory = new oxpd2.UsbAccessoriesService.OpenHIDAccessory();
            jest.spyOn(usbAccessoriesService, 'getOpenHIDAccessory').mockResolvedValue(openHIDAccessory);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.get_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.getOpenHIDAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(openHIDAccessory);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(usbAccessoriesService, 'getOpenHIDAccessory').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.get_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('delete_open_accessory_hid', () => {
        test('should call service with true isOwned and send response', async () => {
            // Setup Test
            jest.spyOn(usbAccessoriesService, 'deleteOpenHIDAccessory').mockResolvedValue();
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.delete_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.deleteOpenHIDAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(204);
        });

        test('should call service with missing isOwned and send response', async () => {
            // Setup Test
            let openHIDAccessory = new oxpd2.UsbAccessoriesService.OpenHIDAccessory();
            jest.spyOn(usbAccessoriesService, 'deleteOpenHIDAccessory').mockResolvedValue(openHIDAccessory);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.delete_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.deleteOpenHIDAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(204);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(usbAccessoriesService, 'deleteOpenHIDAccessory').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.delete_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('modify_open_accessory_hid', () => {
        test('should call service with true isOwned and send response with openHIDAccessory', async () => {
            // Setup Test
            let openHIDAccessory = new oxpd2.UsbAccessoriesService.OpenHIDAccessory();
            jest.spyOn(usbAccessoriesService, 'modifyOpenHIDAccessory').mockResolvedValue(openHIDAccessory);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.modify_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.modifyOpenHIDAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(openHIDAccessory);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service with missing isOwned and send response with openHIDAccessory', async () => {
            // Setup Test
            let openHIDAccessory = new oxpd2.UsbAccessoriesService.OpenHIDAccessory();
            jest.spyOn(usbAccessoriesService, 'modifyOpenHIDAccessory').mockResolvedValue(openHIDAccessory);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.modify_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.modifyOpenHIDAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(openHIDAccessory);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(usbAccessoriesService, 'modifyOpenHIDAccessory').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.modify_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('read_report_open_accessory_hid', () => {
        test('should call service with true isOwned and send response with readReport', async () => {
            // Setup Test
            let readReport = new oxpd2.UsbAccessoriesService.OpenHIDAccessory_ReadReport();
            jest.spyOn(usbAccessoriesService, 'readReportOpenHIDAccessory').mockResolvedValue(readReport);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.read_report_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.readReportOpenHIDAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(readReport);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service with missing isOwned and send response with readReport', async () => {
            // Setup Test
            let readReport = new oxpd2.UsbAccessoriesService.OpenHIDAccessory_ReadReport();
            jest.spyOn(usbAccessoriesService, 'readReportOpenHIDAccessory').mockResolvedValue(readReport);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.read_report_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.readReportOpenHIDAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(readReport);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(usbAccessoriesService, 'readReportOpenHIDAccessory').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.read_report_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('write_report_open_accessory_hid', () => {
        test('should call service with true isOwned and send response with writeReport', async () => {
            // Setup Test
            let writeReport = new oxpd2.UsbAccessoriesService.OpenHIDAccessory_WriteReport();
            jest.spyOn(usbAccessoriesService, 'writeReportOpenHIDAccessory').mockResolvedValue(writeReport);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.write_report_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.writeReportOpenHIDAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(writeReport);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call service with missing isOwned and send response with writeReport', async () => {
            // Setup Test
            let writeReport = new oxpd2.UsbAccessoriesService.OpenHIDAccessory_WriteReport();
            jest.spyOn(usbAccessoriesService, 'writeReportOpenHIDAccessory').mockResolvedValue(writeReport);
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await usbAccessoriesController.write_report_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(usbAccessoriesService.writeReportOpenHIDAccessory).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(writeReport);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(usbAccessoriesService, 'writeReportOpenHIDAccessory').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    accessoryID: "7468F9A2-711E-4C05-BA1D-0B206A32E1AE",
                    openHIDAccessoryID: "6548F9BC-AA11-C1C2-ACDC-32106A32E4BC"
                },
                query: {
                    isOwned: true
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await usbAccessoriesController.write_report_open_accessory_hid(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });
});
