import { describe, expect, jest, test } from '@jest/globals';
import applicationController from '../../src/controllers/applicationController.js';
import applicationService from '../../src/services/applicationService.js';
import applicationAgentController from '../../src/controllers/applicationAgentController.js';
import oxpd2 from 'oxpd2';

describe('Application Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });

    describe('get_application', () => {
        test('should call service with oxpd header', async () => {
            // Setup Test

            const mReq = { 
                headers: {
                    'x-oxpd2-uicontext': "test"
                }
            };
            const mRes = { status: jest.fn().mockReturnThis(), sendFile: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationAgentController.get_application(mReq, mRes, mNext);

            // Assert Results
            expect(mRes.sendFile).toBeCalledTimes(1);
        });

        test('should call service without oxpd header', async () => {
            // Setup Test

            const mReq = { 
                headers: { }
            };
            const mRes = { status: jest.fn().mockReturnThis(), sendFile: jest.fn() };
            const mNext = jest.fn();

            // Test
            await applicationAgentController.get_application(mReq, mRes, mNext);

            // Assert Results
            expect(mRes.sendFile).toBeCalledTimes(1);
        });
    });

    
});
