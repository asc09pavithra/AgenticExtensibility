import { describe, expect, jest, test } from '@jest/globals';
import logController from '../../src/controllers/logController.js';
import logService from '../../src/services/logService.js';

describe('Log Controller', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('get_log', () => {
        test('should call service and send respond with log', async () => {
            // Setup Test
            let log = [];
            jest.spyOn(logService, 'getLog').mockResolvedValue(log);
            const mReq = { params: { logName: 'testLog' } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await logController.get_log(mReq, mRes, mNext);

            // Assert Results
            expect(logService.getLog).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledWith(log);
            expect(mRes.status).toBeCalledWith(200);
        });
    });

    describe('clear_log', () => {
        test('should call service and delete log', async () => {
            // Setup Test
            jest.spyOn(logService, 'clearLog').mockResolvedValue();
            const mReq = { params: { logName: 'testLog' } };
            const mRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            const mNext = jest.fn();

            // Test
            await logController.clear_log(mReq, mRes, mNext);

            // Assert Results
            expect(logService.clearLog).toBeCalledTimes(1);
            expect(mRes.send).toBeCalledTimes(1);
            expect(mRes.status).toBeCalledWith(204);
        });
    });
});
