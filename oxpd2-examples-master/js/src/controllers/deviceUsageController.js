/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */
import deviceUsageService from "../services/deviceUsageService.js";

const deviceUsageController = {};

deviceUsageController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await deviceUsageService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

deviceUsageController.enumerate_device_usage_agents = async (req, res, next) => {
    try {
        let deviceUsageAgents = await deviceUsageService.enumerateDeviceUsageAgents();
        res.status(200).send(deviceUsageAgents);
    }
    catch (err) {
        next(err);
    }
}

deviceUsageController.get_device_usage_agent = async (req, res, next) => {
    try {
        let deviceUsageAgent = await deviceUsageService.getDeviceUsageAgent(req.params.agentId);
        res.status(200).send(deviceUsageAgent);
    }
    catch (err) {
        next(err);
    }
}

deviceUsageController.get_device_usage_agent_lifetime_counters = async (req, res, next) => {
    try {
        let lifetimeCounters = await deviceUsageService.getDeviceUsageAgentLifetimeCounters(req.params.agentId);
        res.status(200).send(lifetimeCounters);
    }
    catch (err) {
        next(err);
    }
}

export default deviceUsageController;
