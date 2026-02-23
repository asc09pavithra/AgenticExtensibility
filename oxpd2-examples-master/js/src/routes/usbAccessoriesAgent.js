/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import usbAccessoriesAgentController from '../controllers/usbAccessoriesAgentController.js';
import express from 'express';

var usbAccessoriesAgentRouter = express.Router();

// Routes
usbAccessoriesAgentRouter.post("/registration", usbAccessoriesAgentController.registration_target);

usbAccessoriesAgentRouter.post("/operationCallback", usbAccessoriesAgentController.operation_callback_target);

export default usbAccessoriesAgentRouter;
