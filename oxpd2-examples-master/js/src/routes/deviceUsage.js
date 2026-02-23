/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */
import deviceUsageController from "../controllers/deviceUsageController.js";
import express from 'express';

var deviceUsageRouter = express.Router();

// Routes

// Capabilities
deviceUsageRouter.get("/capabilities", deviceUsageController.get_capabilities);

// Device Usage Agents
deviceUsageRouter.get("/deviceUsageAgents", deviceUsageController.enumerate_device_usage_agents);

deviceUsageRouter.get("/deviceUsageAgents/:agentId", deviceUsageController.get_device_usage_agent);

// Device Usage Agent Lifetime Counters
deviceUsageRouter.get("/deviceUsageAgents/:agentId/lifetimeCounters", deviceUsageController.get_device_usage_agent_lifetime_counters);

export default deviceUsageRouter;
