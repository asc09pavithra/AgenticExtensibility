import { describe, expect, jest, test, fail } from '@jest/globals';
import authenticationAgentService from '../../src/services/authenticationAgentService.js';
import oxpd2 from 'oxpd2';

global.fetch = jest.fn();

describe('authenticationAgentService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getPostPromptResult and setPostPromptResult', () => {
        test('should set PostPrompResult and retreive proper result', async () => {
            let postPromptResult = new oxpd2.AuthenticationTypes.PostPromptResult();
            let status = new oxpd2.AuthenticationTypes.PostPromptResultValue();
            status.canceled = new oxpd2.AuthenticationTypes.AuthenticationCanceled();
            postPromptResult.result = status;

            authenticationAgentService.setPostPromptResult(postPromptResult);

            let result = authenticationAgentService.getPostPromptResult();
            expect(result.result.isCanceled).toEqual(true);
        });
    });
});
