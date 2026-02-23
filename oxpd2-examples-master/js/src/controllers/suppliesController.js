/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */
import suppliesService from "../services/suppliesService.js";

const suppliesController = {};

suppliesController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await suppliesService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

suppliesController.enumerate_supplies_agents = async (req, res, next) => {
    try {
        let suppliesAgents = await suppliesService.enumerateSuppliesAgents();
        res.status(200).send(suppliesAgents);
    }
    catch (err) {
        next(err);
    }
}

suppliesController.get_supplies_agent = async (req, res, next) => {
    try {
        let suppliesAgent = await suppliesService.getSuppliesAgent(req.params.agentId);
        res.status(200).send(suppliesAgent);
    }
    catch (err) {
        next(err);
    }
}

suppliesController.get_supplies_configuration = async (req, res, next) => {
    try {
        let suppliesConfiguration = await suppliesService.getSuppliesConfiguration(req.params.agentId);
        res.status(200).send(suppliesConfiguration);
    }
    catch (err) {
        next(err);
    }
}

suppliesController.get_supplies_info = async (req, res, next) => {
    try {
        let suppliesInfo = await suppliesService.getSuppliesInfo(req.params.agentId);
        res.status(200).send(suppliesInfo);
    }
    catch (err) {
        next(err);
    }
}

suppliesController.get_supplies_usage = async (req, res, next) => {
    try {
        let suppliesUsage = await suppliesService.getSuppliesUsage(req.params.agentId);
        res.status(200).send(suppliesUsage);
    }
    catch (err) {
        next(err);
    }
}

export default suppliesController;
