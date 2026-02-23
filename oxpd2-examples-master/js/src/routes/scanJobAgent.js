/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import express from 'express';
import scanJobAgentController from "../controllers/scanJobAgentController.js";

var scanJobAgentRouter = express.Router();

// Routes

scanJobAgentRouter.post("/scanJobNotification", scanJobAgentController.post_notification);

scanJobAgentRouter.post("/scanJobReceiver", scanJobAgentController.receive_scan_job);

export default scanJobAgentRouter;
