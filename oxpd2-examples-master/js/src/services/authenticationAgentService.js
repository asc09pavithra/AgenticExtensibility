/**
 * (C) Copyright 2022 HP Development Company, L.P.
 * All rights reserved.
 */
import oxpd2 from 'oxpd2';

class AuthenticationAgentService {
    #postPromptResult

    constructor() {
        this.#postPromptResult = new oxpd2.AuthenticationTypes.PostPromptResult(); 
    }

    getPostPromptResult() {
        return this.#postPromptResult;
    }

    setPostPromptResult(result) {
        this.#postPromptResult = result;
    }
}

const authenticationAgentService = new AuthenticationAgentService();

export default authenticationAgentService;
