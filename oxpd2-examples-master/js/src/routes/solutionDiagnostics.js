/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import express from 'express';
import solutionDiagnosticsController from '../controllers/solutionDiagnosticsController.js';

var solutionDiagnosticsRouter = express.Router();

// Routes

// Capabilities
solutionDiagnosticsRouter.get("/capabilities", solutionDiagnosticsController.get_capabilities);

// SolutionDiagnosticsAgents
solutionDiagnosticsRouter.get("/solutionDiagnosticsAgents", solutionDiagnosticsController.enumerate_solution_diagnostics_agents);

solutionDiagnosticsRouter.get("/solutionDiagnosticsAgents/:agentId", solutionDiagnosticsController.get_solution_diagnostics_agent);

solutionDiagnosticsRouter.get("/solutionDiagnosticsAgents/:agentId/log", solutionDiagnosticsController.get_solution_diagnostics_agent_log);


export default solutionDiagnosticsRouter;
