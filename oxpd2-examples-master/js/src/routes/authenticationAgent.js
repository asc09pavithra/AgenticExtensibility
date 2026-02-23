/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import authenticationAgentController from '../controllers/authenticationAgentController.js';
import express from 'express';

var authenticationAgentRouter = express.Router();

// Routes

authenticationAgentRouter.post("/prePromptResult", authenticationAgentController.preprompt_result);

authenticationAgentRouter.post("/postPromptResult", authenticationAgentController.postprompt_result);

authenticationAgentRouter.get("/prompt", authenticationAgentController.prompt);

authenticationAgentRouter.post("/signoutNotification", authenticationAgentController.signout_notification);

authenticationAgentRouter.post("/login", authenticationAgentController.login);

authenticationAgentRouter.post("/cancelLogin", authenticationAgentController.cancel_login);

export default authenticationAgentRouter;
