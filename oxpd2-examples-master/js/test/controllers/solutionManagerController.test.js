import { describe, expect, jest, test } from '@jest/globals';
import solutionManagerController from '../../src/controllers/solutionManagerController.js';
import { BoundDevice } from '../../src/models/boundDevice.js';
import  deviceManagementService  from '../../src/services/deviceManagementService.js';
import solutionManagerService from '../../src/services/solutionMangerService.js';
import oxpd2 from 'oxpd2';
import { IncomingMessage } from 'http';

describe('Solution Manager Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
    describe('get_capabilities', () => {
        test('should call service and send respond with capabilities', async () => {
            // Setup Test

            let capabilities = new oxpd2.SolutionManagerService.Capabilities();
            jest.spyOn(solutionManagerService, 'getCapabilities').mockResolvedValue(capabilities);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getCapabilities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(capabilities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            let capabilities = new oxpd2.SolutionManagerService.Capabilities();
            jest.spyOn(solutionManagerService, 'getCapabilities').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.get_capabilities(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getCapabilities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_installer', () => {
        test('should call service and send respond with installer', async () => {
            // Setup Test

            let installer = new oxpd2.SolutionManagerService.Installer();
            jest.spyOn(solutionManagerService, 'getInstaller').mockResolvedValue(installer);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.get_installer(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getInstaller).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(installer);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'getInstaller').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.get_installer(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getInstaller).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('installer_install_solution', () => {
        test('Installing an Solution should call service and send respond with installerInstallSolution', async () => {
            // Setup Test

            let installer = new oxpd2.SolutionManagerService.Installer_InstallSolution();
            jest.spyOn(solutionManagerService, 'installSolution').mockResolvedValue(installer);

            let resource = "--63db2a35df297e7f\r\n" +
            "Content-Disposition: attachment; name=\"content\"\r\n" +
            "Content-Type: application/json \r\n" +
            "\r\n" +
            "{\r\n" +
            "}\r\n" +

            "--63db2a35df297e7f\r\n" +
            "Content-Disposition: attachment; name=\"context\"\r\n" +
            "Content-Type: application/json\r\n" +
            "\r\n" +
            "{\r\n" +
            "\"data\": [\r\n" +
            "{\r\n" +
            "\"key\": \"username\"\r\n" +
            ",\r\n" +
            "\"value\": \"value\"\r\n" +
            "}\r\n" +
            "],\r\n" +
            "\"sensitiveData\": [\r\n" +
            "{\r\n" +
            "\"key\": \"password\"\r\n" +
            ",\r\n" +
            "\"value\": \"mypassword\"\r\n" +
            "}\r\n" +
            "]\r\n" +
            "}\r\n" +

            "--63db2a35df297e7f\r\n" +
            "Content-Disposition: attachment; name=\"solution\"; filename=\"solution.bdl\"\r\n" +
            "Content-Type: application/vnd.hp.solution-bundle\r\n" +
            "\r\n" +
            "solution.bdl\r\n" +
            "--63db2a35df297e7f--\r\n";

            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.installer_install_solution(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.installSolution).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(installer);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'installSolution').mockRejectedValueOnce(new Error("error"));

            let resource = "--63db2a35df297e7f\r\n" +
            "Content-Disposition: attachment; name=\"content\"\r\n" +
            "Content-Type: application/json \r\n" +
            "\r\n" +
            "{\r\n" +
            "}\r\n" +
            "--63db2a35df297e7f--\r\n";

            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.installer_install_solution(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.installSolution).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('installer_install_remote', () => {
        test('Installing a remote solution should call service and send respond with installerInstallRemote', async () => {
            // Setup Test

            let installer = new oxpd2.SolutionManagerService.Installer_InstallRemote();
            jest.spyOn(solutionManagerService, 'installRemote').mockResolvedValue(installer);

            let resource = "--63db2a35df297e7f\r\n" +
            "Content-Disposition: attachment; name=\"content\"\r\n" +
            "Content-Type: application/json \r\n" +
            "\r\n" +
            "{\r\n" +
            "\"solutionId\": \"5A319018-A64F-4678-86DD-852E90C1C384\"\r\n" +
            "}\r\n" +
            "--63db2a35df297e7f--\r\n";

            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.installer_install_remote(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.installRemote).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(installer);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'installRemote').mockRejectedValueOnce(new Error("error"));

            let resource = "--63db2a35df297e7f\r\n" +
            "Content-Disposition: attachment; name=\"content\"\r\n" +
            "Content-Type: application/json \r\n" +
            "\r\n" +
            "{\r\n" +
            "}\r\n" +
            "--63db2a35df297e7f--\r\n";

            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.installer_install_remote(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.installRemote).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });    

    describe('installer_uninstall_solution', () => {
        test('should call service and send respond with installerUninstallSolution', async () => {
            // Setup Test

            let installer = new oxpd2.SolutionManagerService.Installer_UninstallSolution();
            jest.spyOn(solutionManagerService, 'uninstallSolution').mockResolvedValue(installer);
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.installer_uninstall_solution(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.uninstallSolution).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(installer);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'uninstallSolution').mockRejectedValueOnce(new Error("error"));
            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.installer_uninstall_solution(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.uninstallSolution).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('installer_enumerate_installer_operations', () => {
        test('should call service and send respond with installer operations', async () => {
            // Setup Test

            let installerOperations = new oxpd2.SolutionManagerService.InstallerOperations();
            jest.spyOn(solutionManagerService, 'enumerateInstallerOperations').mockResolvedValue(installerOperations);
            const mReq = {
                query : {
                    includeMembers: true,
                    contentFilter: ""
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.installer_enumerate_installer_operations(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.enumerateInstallerOperations).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(installerOperations);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'enumerateInstallerOperations').mockRejectedValueOnce(new Error("error"));
            const mReq = { 
                query : {
                    includeMembers: true,
                    contentFilter: ""
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.installer_enumerate_installer_operations(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.enumerateInstallerOperations).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('installer_get_installer_operation', () => {
        test('should call service and send respond with installer operations', async () => {
            // Setup Test

            let installerOperation = new oxpd2.SolutionManagerService.InstallerOperation();
            jest.spyOn(solutionManagerService, 'getInstallerOperation').mockResolvedValue(installerOperation);
            const mReq = { 
                params: {
                    operationId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.installer_get_installer_operation(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getInstallerOperation).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(installerOperation);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'getInstallerOperation').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    operationId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.installer_get_installer_operation(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getInstallerOperation).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('enumerate_solutions', () => {
        test('should call service and send respond with solutions', async () => {
            // Setup Test

            let solutions = new oxpd2.SolutionManagerService.Solutions();
            jest.spyOn(solutionManagerService, 'enumerateSolutions').mockResolvedValue(solutions);
            const mReq = {
                query : {
                    includeMembers: true,
                    contentFilter: ""
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.enumerate_solutions(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.enumerateSolutions).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(solutions);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'enumerateSolutions').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                query : {
                    includeMembers: true,
                    contentFilter: ""
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.enumerate_solutions(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.enumerateSolutions).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_solution', () => {
        test('should call service and send respond with solution', async () => {
            // Setup Test

            let solutions = new oxpd2.SolutionManagerService.Solutions();
            jest.spyOn(solutionManagerService, 'getSolution').mockResolvedValue(solutions);
            const mReq = {
                params: {
                    operationId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.get_solution(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getSolution).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(solutions);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'getSolution').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    operationId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.get_solution(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getSolution).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_reissue_install_code', () => {
        test('should call service and send respond with solutionReissueInstallCode', async () => {
            // Setup Test

            let solutionReissueInstallCode = new oxpd2.SolutionManagerService.Solution_ReissueInstallCode();
            jest.spyOn(solutionManagerService, 'reissueInstallCode').mockResolvedValue(solutionReissueInstallCode);
            const mReq = {
                params: {
                    operationId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_reissue_install_code(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.reissueInstallCode).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(solutionReissueInstallCode);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'reissueInstallCode').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    operationId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_reissue_install_code(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.reissueInstallCode).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_get_context', () => {
        test('should call service and send respond with context', async () => {
            // Setup Test

            let context = new oxpd2.SolutionManagerService.Context();
            jest.spyOn(solutionManagerService, 'getSolutionContext').mockResolvedValue(context);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_get_context(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getSolutionContext).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(context);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'getSolutionContext').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_get_context(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getSolutionContext).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_modify_context', () => {
        test('should call service and send respond with context', async () => {
            // Setup Test

            let context = new oxpd2.SolutionManagerService.Context();
            jest.spyOn(solutionManagerService, 'modifySolutionContext').mockResolvedValue(context);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                body: {

                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_modify_context(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.modifySolutionContext).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(context);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'modifySolutionContext').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                body: {
                    
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_modify_context(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.modifySolutionContext).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_replace_context', () => {
        test('should call service and send respond with context', async () => {
            // Setup Test

            let context = new oxpd2.SolutionManagerService.Context();
            jest.spyOn(solutionManagerService, 'replaceSolutionContext').mockResolvedValue(context);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                body: {

                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_replace_context(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.replaceSolutionContext).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(context);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'replaceSolutionContext').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                body: {
                    
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_replace_context(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.replaceSolutionContext).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_configuration', () => {
        test('should call service and send response with configuration', async () => {
            // Setup Test
            let configuration = new oxpd2.SolutionManagerService.Configuration();
            jest.spyOn(solutionManagerService, 'getConfiguration').mockResolvedValue(configuration);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.get_configuration(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getConfiguration).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(configuration);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'getConfiguration').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.get_configuration(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getConfiguration).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('modify_configuration', () => {
        test('should call service and send response with configuration', async () => {
            // Setup Test
            let configuration = new oxpd2.SolutionManagerService.Configuration();
            jest.spyOn(solutionManagerService, 'modifyConfiguration').mockResolvedValue(configuration);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                body: {

                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.modify_configuration(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.modifyConfiguration).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(configuration);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'modifyConfiguration').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                body: {
                    
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.modify_configuration(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.modifyConfiguration).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('get_configuration_data', () => {
        test('should call service and send response with configuration data', async () => {
            // Setup Test
            let response = { item1 : {}, item2 : {}};
            jest.spyOn(solutionManagerService, 'getConfigurationData').mockResolvedValue(response);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.get_configuration_data(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getConfigurationData).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(response);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'getConfigurationData').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.get_configuration_data(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getConfigurationData).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('replace_configuration_data', () => {
        test('should call service and send response with configuration data', async () => {
            // Setup Test
            let data = new oxpd2.SolutionManagerService.Data();
            jest.spyOn(solutionManagerService, 'replaceConfigurationData').mockResolvedValue(data);

            let resource = "--63db2a35df297e7f\r\n"
            + "Content-Type: application/json\r\n"
            + "Content-Disposition: attachment; name=content\r\n"
            + "\r\n"
            + "{\"$opMeta\":{\"contentFilter\":[\"*\"]},\"links\":[{\"href\":\"self\",\"rel\":\"self\"}]}\r\n"
            + "--63db2a35df297e7f\r\n"
            + "Content-Type: application/json\r\n"
            + "Content-Disposition: attachment; name=data\r\n"
            + "\r\n"
            + "{\"mydata\": \"value\"}\r\n"
            + "\r\n"
            + "--63db2a35df297e7f--";

            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
            };

            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.replace_configuration_data(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.replaceConfigurationData).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(data);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'replaceConfigurationData').mockRejectedValueOnce(new Error("error"));
            let resource = "--63db2a35df297e7f\r\n"
            + "Content-Type: application/json\r\n"
            + "Content-Disposition: attachment; name=content\r\n"
            + "\r\n"
            + "{\"$opMeta\":{\"contentFilter\":[\"*\"]},\"links\":[{\"href\":\"self\",\"rel\":\"self\"}]}\r\n"
            + "--63db2a35df297e7f\r\n"
            + "Content-Type: application/json\r\n"
            + "Content-Disposition: attachment; name=data\r\n"
            + "\r\n"
            + "{\"mydata\": \"value\"}\r\n"
            + "\r\n"
            + "--63db2a35df297e7f--";

            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
            };

            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.replace_configuration_data(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.replaceConfigurationData).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_enumerate_certificate_authorities', () => {
        test('should call service and send respond with certificateAuthorities', async () => {
            // Setup Test

            let certificateAuthorities = new oxpd2.SolutionManagerService.CertificateAuthorities();
            jest.spyOn(solutionManagerService, 'enumerateCertificateAuthorities').mockResolvedValue(certificateAuthorities);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_enumerate_certificate_authorities(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.enumerateCertificateAuthorities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(certificateAuthorities);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'enumerateCertificateAuthorities').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_enumerate_certificate_authorities(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.enumerateCertificateAuthorities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_export_certificate_authorities', () => {
        test('should call service and send respond with response', async () => {
            // Setup Test

            let response = { item1 : {}, item2 : {}};
            jest.spyOn(solutionManagerService, 'exportCertificateAuthorities').mockResolvedValue(response);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_export_certificate_authorities(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.exportCertificateAuthorities).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(response);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'exportCertificateAuthorities').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_export_certificate_authorities(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.exportCertificateAuthorities).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_get_certificate_authority', () => {
        test('should call service and send respond with certificateAuthority', async () => {
            // Setup Test

            let certificateAuthority = new oxpd2.SolutionManagerService.CertificateAuthority();
            jest.spyOn(solutionManagerService, 'getCertificateAuthority').mockResolvedValue(certificateAuthority);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                    certificateId: "9880cba4-d810-44f3-8f6d-7b1089f7de5c"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_get_certificate_authority(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getCertificateAuthority).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(certificateAuthority);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'getCertificateAuthority').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                    certificateId: "9880cba4-d810-44f3-8f6d-7b1089f7de5c"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_get_certificate_authority(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getCertificateAuthority).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_delete_certificate_authority', () => {
        test('should call service and send respond with deleteContent', async () => {
            // Setup Test

            let deleteContent = new oxpd2.BaseTypes.DeleteContent();
            jest.spyOn(solutionManagerService, 'deleteCertificateAuthority').mockResolvedValue(deleteContent);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                    certificateId: "9880cba4-d810-44f3-8f6d-7b1089f7de5c"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_delete_certificate_authority(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.deleteCertificateAuthority).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(deleteContent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'deleteCertificateAuthority').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                    certificateId: "9880cba4-d810-44f3-8f6d-7b1089f7de5c"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_delete_certificate_authority(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.deleteCertificateAuthority).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_export_certificate_authority', () => {
        test('should call service and send respond with response', async () => {
            // Setup Test

            let response = { item1 : {}, item2 : {}};
            jest.spyOn(solutionManagerService, 'exportCertificateAuthority').mockResolvedValue(response);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                    certificateId: "9880cba4-d810-44f3-8f6d-7b1089f7de5c"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_export_certificate_authority(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.exportCertificateAuthority).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(response);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'exportCertificateAuthority').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                    certificateId: "9880cba4-d810-44f3-8f6d-7b1089f7de5c"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_export_certificate_authority(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.exportCertificateAuthority).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_import_certificate_authority', () => {
        test('should call service and send respond with certificateAuthoritiesImport', async () => {
            // Setup Test

            let certificateAuthoritiesImport = new oxpd2.SolutionManagerService.CertificateAuthorities_Import();
            jest.spyOn(solutionManagerService, 'importCertificateAuthority').mockResolvedValue(certificateAuthoritiesImport);

            let resource = "--63db2a35df297e7f\r\n" +
            "Content-Disposition: form-data; name=\"content\"\r\n" +
            "Content-Type: application/json \r\n" +
            "\r\n" +
            "{\r\n" +
            "\"keyFormat\": \"KfPKCS8\"\r\n" +
            ",\r\n" +
            "\"certificateId\": \"5A319018-A64F-4678-86DD-852E90C1C384\"\r\n" +
            "}\r\n" +

            "--63db2a35df297e7f\r\n" +
            "Content-Disposition: attachment; name=\"certificate\"; filename=\"certificate.pem\"\r\n" +
            "Content-Type: application/x-pem-file\r\n" +
            "\r\n" +
            "certificate.pem\r\n" +
            "--63db2a35df297e7f--\r\n";

            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_import_certificate_authority(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.importCertificateAuthority).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(certificateAuthoritiesImport);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'importCertificateAuthority').mockRejectedValueOnce(new Error("error"));

            let resource = "--63db2a35df297e7f\r\n" +
            "Content-Disposition: form-data; name=\"content\"\r\n" +
            "Content-Type: application/json \r\n" +
            "\r\n" +
            "{\r\n" +
            "\"keyFormat\": \"KfPKCS8\"\r\n" +
            ",\r\n" +
            "\"certificateId\": \"5A319018-A64F-4678-86DD-852E90C1C384\"\r\n" +
            "}\r\n" +

            "--63db2a35df297e7f\r\n" +
            "Content-Disposition: attachment; name=\"certificate\"; filename=\"certificate.pem\"\r\n" +
            "Content-Type: application/x-pem-file\r\n" +
            "\r\n" +
            "certificate.pem\r\n" +
            "--63db2a35df297e7f--\r\n";

            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                headers: {
                    'content-type': `multipart/mixed; boundary=63db2a35df297e7f`
                },
                body: Buffer.from(resource)
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_import_certificate_authority(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.importCertificateAuthority).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });  
    
    describe('solution_enumerate_runtime_registrations', () => {
        test('should call service and send respond with runtime registrations', async () => {
            // Setup Test

            let runtimeRegistrations = new oxpd2.SolutionManagerService.RuntimeRegistrations();
            jest.spyOn(solutionManagerService, 'enumerateRuntimeRegistrations').mockResolvedValue(runtimeRegistrations);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_enumerate_runtime_registrations(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.enumerateRuntimeRegistrations).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(runtimeRegistrations);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'enumerateRuntimeRegistrations').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_enumerate_runtime_registrations(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.enumerateRuntimeRegistrations).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_create_runtime_registration', () => {
        test('should call service and send respond with the runtime registration that was created', async () => {
            // Setup Test

            let runtimeRegistration = new oxpd2.SolutionManagerService.RuntimeRegistration();
            jest.spyOn(solutionManagerService, 'createRuntimeRegistration').mockResolvedValue(runtimeRegistration);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                body: {}
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_create_runtime_registration(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.createRuntimeRegistration).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(runtimeRegistration);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'createRuntimeRegistration').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a"
                },
                body: {}
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_create_runtime_registration(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.createRuntimeRegistration).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_get_runtime_registration', () => {
        test('should call service and send respond with runtime registration', async () => {
            // Setup Test

            let runtimeRegistration = new oxpd2.SolutionManagerService.RuntimeRegistration();
            jest.spyOn(solutionManagerService, 'getRuntimeRegistration').mockResolvedValue(runtimeRegistration);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                    resourceId: "9880cba4-d810-44f3-8f6d-7b1089f7de5c"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_get_runtime_registration(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getRuntimeRegistration).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(runtimeRegistration);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'getRuntimeRegistration').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                    resourceId: "9880cba4-d810-44f3-8f6d-7b1089f7de5c"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_get_runtime_registration(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.getRuntimeRegistration).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('solution_delete_runtime_registration', () => {
        test('should call service and send respond with deleteContent', async () => {
            // Setup Test

            let deleteContent = new oxpd2.BaseTypes.DeleteContent();
            jest.spyOn(solutionManagerService, 'deleteRuntimeRegistration').mockResolvedValue(deleteContent);
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                    resourceId: "9880cba4-d810-44f3-8f6d-7b1089f7de5c"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await solutionManagerController.solution_delete_runtime_registration(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.deleteRuntimeRegistration).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(deleteContent);
            expect(mRes.status).toBeCalledWith(200);
        });

        test('should call next when exception is thrown', async () => {
            // Setup Test
            jest.spyOn(solutionManagerService, 'deleteRuntimeRegistration').mockRejectedValueOnce(new Error("error"));
            const mReq = {
                params: {
                    solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                    resourceId: "9880cba4-d810-44f3-8f6d-7b1089f7de5c"
                }
             };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();
            // Test
            await solutionManagerController.solution_delete_runtime_registration(mReq, mRes, mNext);

            // Assert Results
            expect(solutionManagerService.deleteRuntimeRegistration).toBeCalledTimes(1);
            expect(mNext).toBeCalledTimes(1);
        });
    });

});
