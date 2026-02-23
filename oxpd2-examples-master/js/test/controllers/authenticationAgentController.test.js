import { describe, expect, jest, test } from '@jest/globals';
import authenticationAgentController from '../../src/controllers/authenticationAgentController.js';
import logService from '../../src/services/logService.js';

describe('authenticationAgent Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
        logService.resetLogs();
      });

    describe('preprompt_result', () => {
        test('should complete successfully', async () => {
            
            // Setup Test

            const mReq = { 
                headers: { },
                body: {
                    sessionAccessToken: "abc123"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationAgentController.preprompt_result(mReq, mRes, mNext);

            // Assert Results
            let log = await logService.getLog("authenticationAgent");
            expect(log).toBeTruthy();
            expect(log.length).toBe(1);
            expect(mRes.send).toBeCalledTimes(1);
        });

        test('should call mNext without body', async () => {
            
            // Setup Test

            const mReq = { 
                headers: { },
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationAgentController.preprompt_result(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('postprompt_result', () => {
        test('should complete successfully', async () => {
            // Setup Test

            const mReq = { 
                headers: { },
                body: {
                    sessionAccessToken: "abc123"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationAgentController.postprompt_result(mReq, mRes, mNext);

            // Assert Results
            let log = await logService.getLog("authenticationAgent");
            expect(log).toBeTruthy();
            expect(log.length).toBe(1);
            expect(mRes.send).toBeCalledTimes(1);
        });

        test('should call mNext without body', async () => {
            // Setup Test

            const mReq = { 
                headers: { }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationAgentController.postprompt_result(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('prompt', () => {
        test('should complete successfully', async () => {
            // Setup Test

            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), sendFile: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationAgentController.prompt(mReq, mRes, mNext);

            // Assert Results
            let log = await logService.getLog("authenticationAgent");
            expect(log).toBeTruthy();
            expect(log.length).toBe(1);
            expect(mRes.sendFile).toBeCalledTimes(1);
        });
    });

    describe('signout_notification', () => {
        test('should complete successfully', async () => {
            // Setup Test

            const mReq = { 
                headers: { },
                body: {
                    sessionAccessToken: "abc123"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationAgentController.signout_notification(mReq, mRes, mNext);

            // Assert Results
            let log = await logService.getLog("authenticationAgent");
            expect(log).toBeTruthy();
            expect(log.length).toBe(1);
            expect(mRes.send).toBeCalledTimes(1);
        });
    });

    describe('login', () => {
        test('should return successful notification with valid pin', async () => {
            // Setup Test

            const mReq = { 
                headers: { },
                body: {
                    pin: "1234"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationAgentController.login(mReq, mRes, mNext);

            // Assert Results
            expect(mRes.send).toBeCalledTimes(1);
        });

        test('should return successful notification with invalid pin', async () => {
            // Setup Test

            const mReq = { 
                headers: { },
                body: {
                    pin: "xxx"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationAgentController.login(mReq, mRes, mNext);

            // Assert Results
            expect(mRes.send).toBeCalledTimes(1);
        });

        test('should return call mNext with invalid mReq', async () => {
            // Setup Test

            const mReq = null;
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationAgentController.login(mReq, mRes, mNext);

            // Assert Results
            expect(mNext).toBeCalledTimes(1);
        });
    });

    describe('cancel_login', () => {
        test('should complete successfully', async () => {
            // Setup Test

            const mReq = { };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await authenticationAgentController.cancel_login(mReq, mRes, mNext);

            // Assert Results
            expect(mRes.send).toBeCalledTimes(1);
        });
    });

    
});
