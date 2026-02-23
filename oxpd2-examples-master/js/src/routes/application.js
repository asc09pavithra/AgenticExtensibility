/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import express from 'express';
var applicationRouter = express.Router();

// Application Controllers
import applicationController from  '../controllers/applicationController.js';

// Routes

// Capabilities
applicationRouter.get("/capabilities", applicationController.get_capabilities);

// Application Access Point/s
applicationRouter.get("/applicationAccessPoints", applicationController.enumerate_application_access_points);

applicationRouter.get("/applicationAccessPoints/:accessPointId", applicationController.get_application_access_point);

applicationRouter.post("/applicationAccessPoints/:accessPointId/initiateLaunch", applicationController.application_access_point_initiate_launch);

// Application Agent/s
applicationRouter.get("/applicationAgents", applicationController.enumerate_application_agents);

applicationRouter.get("/applicationAgents/:agentId", applicationController.get_application_agent);

applicationRouter.post("/applicationAgents/:agentId/refresh", applicationController.refresh_application_agent);

// ApplicationRuntime
applicationRouter.get("/applicationRuntime", applicationController.get_application_runtime);

applicationRouter.post("/applicationRuntime/reset", applicationController.reset_application_runtime);

// ApplicationRuntime CurrentContext
applicationRouter.get("/applicationRuntime/currentContext", applicationController.get_current_context);

applicationRouter.post("/applicationRuntime/currentContext/resetInactivityTimer", applicationController.reset_inactivity_timer_current_context);

applicationRouter.post("/applicationRuntime/currentContext/exit", applicationController.exit_current_context);

applicationRouter.post("/applicationRuntime/currentContext/exec", applicationController.exec_current_context);

applicationRouter.get("/applicationRuntime/currentContext/startIntent", applicationController.get_start_intent);

// Runtime Chrome
applicationRouter.get("/applicationRuntime/currentContext/runtimeChrome", applicationController.get_runtime_chrome);

applicationRouter.put("/applicationRuntime/currentContext/runtimeChrome", applicationController.replace_runtime_chrome);

applicationRouter.patch("/applicationRuntime/currentContext/runtimeChrome", applicationController.modify_runtime_chrome);

// i18n Asset/s
applicationRouter.get("/i18nAssets", applicationController.enumerate_i18n_assets);

applicationRouter.get("/i18nAssets/:assetId", applicationController.get_i18n_asset);

// Message Center Agent/s
applicationRouter.get("/messageCenterAgents", applicationController.enumerate_message_center_agents);

applicationRouter.get("/messageCenterAgents/:agentId", applicationController.get_message_center_agent);

// Message/s
applicationRouter.get("/messageCenterAgents/:agentId/messages", applicationController.enumerate_messages);

applicationRouter.post("/messageCenterAgents/:agentId/messages", applicationController.create_message);

applicationRouter.get("/messageCenterAgents/:agentId/messages/:messageId", applicationController.get_message);

applicationRouter.delete("/messageCenterAgents/:agentId/messages/:messageId", applicationController.delete_message);

// Homescreen
applicationRouter.get("/homescreen", applicationController.get_homescreen);

applicationRouter.patch("/homescreen", applicationController.modify_homescreen);

export default applicationRouter;
