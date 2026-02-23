/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */
import express from 'express';
import applicationRouter from './application.js';
import applicationAgentRouter from './applicationAgent.js';
import authenticationRouter from './authentication.js';
import authenticationAgentRouter from './authenticationAgent.js';
import copyRouter from './copy.js';
import copyAgentRouter from './copyAgent.js';
import deviceRouter from './device.js';
import deviceManagementRouter from './deviceManagement.js';
import deviceUsageRouter from './deviceUsage.js';
import jobStatisticsAgentRouter from './jobStatisticsAgent.js';
import jobStatisticsRouter from './jobStatistics.js';
import logRouter from './log.js';
import printJobRouter from './printJob.js';
import scanJobRouter from './scanJob.js';
import scanJobAgentRouter from './scanJobAgent.js';
import securityRouter from './security.js';
import solutionDiagnosticsRouter from './solutionDiagnostics.js';
import solutionManagerRouter from './solutionManager.js';
import solutionNotificationRouter from './solutionNotification.js';
import suppliesRouter from './supplies.js';
import usbAccessoriesRouter from './usbAccessories.js';
import usbAccessoriesAgentRouter from './usbAccessoriesAgent.js';

var router = express.Router();

router.use('/api/application', applicationRouter);
router.use('/api/applicationAgent', applicationAgentRouter);
router.use('/api/authentication', authenticationRouter);
router.use('/api/authenticationAgent', authenticationAgentRouter);
router.use('/api/copy', copyRouter);
router.use('/api/copyAgent', copyAgentRouter);
router.use('/api/device', deviceRouter);
router.use('/api/deviceManagement', deviceManagementRouter);
router.use('/api/deviceUsage', deviceUsageRouter);
router.use('/api/jobStatistics', jobStatisticsRouter);
router.use('/api/jobStatisticsAgent', jobStatisticsAgentRouter);
router.use('/api/log', logRouter);
router.use('/api/printJob', printJobRouter);
router.use('/api/scanJob', scanJobRouter);
router.use('/api/scanJobAgent', scanJobAgentRouter);
router.use('/api/security', securityRouter);
router.use('/api/solutionDiagnostics', solutionDiagnosticsRouter);
router.use('/api/solutionManager', solutionManagerRouter);
router.use('/api/solutionNotifications', solutionNotificationRouter);
router.use('/api/supplies', suppliesRouter);
router.use('/api/usbAccessories', usbAccessoriesRouter);
router.use('/api/usbAccessoriesAgent', usbAccessoriesAgentRouter);

export default router;
