/**
 * (C) Copyright 2022 HP Development Company, L.P.
 * All rights reserved.
 */

import { AuthenticationLogItem } from '../models/authenticationLogItem.js';
import { LoginRequest } from '../models/loginRequest.js';
import authenticationAgentService from "../services/authenticationAgentService.js";
import deviceManagementService from '../services/deviceManagementService.js';
import logService from "../services/logService.js"
import oxpd2 from "oxpd2"
import path from "path"

const __dirname = path.resolve()
let filePath = path.join(__dirname, '/src/webcontent/loginPage.html');

const AUTHENTICATION_AGENT_LOG = "authenticationAgent";

// This is a very basic example of a solution implementation, see any applicable demos for more in depth examples.
const authenticationAgentController = {};

function getAuthenticationSuccess() {
    let success = new oxpd2.AuthenticationTypes.AuthenticationSuccess();
    let details = new oxpd2.SecurityTypes.WritableAuthenticatedUserDetails();
    details.displayName = "John Doe";
    details.emailAddress = new oxpd2.CommonTypes.EmailAddress("john.doe@hp.com");
    details.fullyQualifiedUserName = new oxpd2.CommonTypes.FullyQualifiedUserName("jDoe");
    details.userName = "jDoe";
    details.preferredLanguage = new oxpd2.LocalizationTypes.LanguageTag("en-US");

    success.details = details;
    return success;
}

authenticationAgentController.preprompt_result = async (req, res, next) => {
    try {
        let authContextToken = new oxpd2.Oauth2Client.Token();
        authContextToken.accessToken = req.body.sessionAccessToken;
        authContextToken.tokenType = "Bearer";

        // Stash the Auth-Context session token with the our device manager for later use
        deviceManagementService.setAuthContextAccessToken(authContextToken);

        //For prePromptResults, always return continue.
        let result = new oxpd2.AuthenticationTypes.PrePromptResult();
        let resultValue = new oxpd2.AuthenticationTypes.PrePromptResultValue();
        resultValue.continue = new oxpd2.AuthenticationTypes.AuthenticationContinued();
        result.result = resultValue;
        let authLogItem = new AuthenticationLogItem("PrePromptResult", req.body, result)
        logService.log(AUTHENTICATION_AGENT_LOG, authLogItem)
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
}

authenticationAgentController.postprompt_result = async (req, res, next) => {
    try {
        let authContextToken = new oxpd2.Oauth2Client.Token();
        authContextToken.accessToken = req.body.sessionAccessToken;
        authContextToken.tokenType = "Bearer";

        // Stash the Auth-Context session token with the our device manager for later use
        deviceManagementService.setAuthContextAccessToken(authContextToken);

        let result = authenticationAgentService.getPostPromptResult();

        let authLogItem = new AuthenticationLogItem("PostPromptResult", req.body, result)
        logService.log(AUTHENTICATION_AGENT_LOG, authLogItem)
        res.status(200).send(result);
    }
    catch (err) {
        next(err);
    }
}

authenticationAgentController.prompt = async (req, res, next) => {
    try {
        let authLogItem = new AuthenticationLogItem("Prompt", null, null)
        logService.log(AUTHENTICATION_AGENT_LOG, authLogItem)
        res.sendFile(filePath);
    }
    catch (err) {
        next(err);
    }
}

authenticationAgentController.signout_notification = async (req, res, next) => {
    try {
        let authLogItem = new AuthenticationLogItem("SignoutNotification", req.body, null)

        // The user has signed out, remove the authContextToken
        deviceManagementService.setAuthContextAccessToken(null)
        logService.log(AUTHENTICATION_AGENT_LOG, authLogItem)
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}

// The call the user prompt pages will make when the user presses the 'login' button.
authenticationAgentController.login = async (req, res, next) => {
    try {
        let login = new LoginRequest(req.body);
        let postPromptResult = new oxpd2.AuthenticationTypes.PostPromptResult();

        //This is the only success case.  All others are failure.
        if (login && login.pin !== null && login.pin === '1234') {
            let status = new oxpd2.AuthenticationTypes.PostPromptResultValue();
            status.succeeded = getAuthenticationSuccess();
            postPromptResult.result = status;
        }
        else {
            let status = new oxpd2.AuthenticationTypes.PostPromptResultValue();
            let failed = new oxpd2.AuthenticationTypes.AuthenticationFailed();
            failed.message = "Invalid Pin";
            status.failed = failed;
            postPromptResult.result = status;
        }

        authenticationAgentService.setPostPromptResult(postPromptResult);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}

// The call the user prompt pages will make when the user presses the 'cancel' button.
authenticationAgentController.cancel_login = async (req, res, next) => {
    try {
        let postPromptResult = new oxpd2.AuthenticationTypes.PostPromptResult();
        let status = new oxpd2.AuthenticationTypes.PostPromptResultValue();
        status.canceled = new oxpd2.AuthenticationTypes.AuthenticationCanceled();
        postPromptResult.result = status;
        authenticationAgentService.setPostPromptResult(postPromptResult);

        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}



export default authenticationAgentController;
