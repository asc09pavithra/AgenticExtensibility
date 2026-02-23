/**
 * (C) Copyright 2022 HP Development Company, L.P.
 * All rights reserved.
 */
import solutionDiagnosticsService from "../services/solutionDiagnosticsService.js";

const solutionDiagnosticsController = {};

solutionDiagnosticsController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await solutionDiagnosticsService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

solutionDiagnosticsController.enumerate_solution_diagnostics_agents = async (req, res, next) => {
    try {
        let solutionDiagnosticsAgents = await solutionDiagnosticsService.enumerateSolutionDiagnosticsAgents();
        res.status(200).send(solutionDiagnosticsAgents);
    }
    catch (err) {
        next(err);
    }
}

solutionDiagnosticsController.get_solution_diagnostics_agent = async (req, res, next) => {
    try {
        let solutionDiagnosticsAgent = await solutionDiagnosticsService.getSolutionDiagnosticsAgent(req.params.agentId);
        res.status(200).send(solutionDiagnosticsAgent);
    }
    catch (err) {
        next(err);
    }
}

solutionDiagnosticsController.get_solution_diagnostics_agent_log = async (req, res, next) => {
    try {
        let agentLog = await solutionDiagnosticsService.getAgentLog(req.params.agentId);
        res.status(200).send(agentLog);
    }
    catch (err) {
        next(err);
    }
}

export default solutionDiagnosticsController;
