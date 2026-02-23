/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import express from 'express';
var suppliesRouter = express.Router();

// Supplies Controllers
import suppliesController from "../controllers/suppliesController.js";

// Routes

// Capabilities
suppliesRouter.get("/capabilities", suppliesController.get_capabilities);

// Supplies Agents
suppliesRouter.get("/suppliesAgents", suppliesController.enumerate_supplies_agents);

suppliesRouter.get("/suppliesAgents/:agentId", suppliesController.get_supplies_agent);

suppliesRouter.get("/suppliesAgents/:agentId/suppliesConfiguration", suppliesController.get_supplies_configuration);

suppliesRouter.get("/suppliesAgents/:agentId/suppliesInfo", suppliesController.get_supplies_info);

suppliesRouter.get("/suppliesAgents/:agentId/suppliesUsage", suppliesController.get_supplies_usage);

export default suppliesRouter;
