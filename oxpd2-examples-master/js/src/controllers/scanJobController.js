import scanJobService from "../services/scanJobService.js";

const scanJobController = {};

scanJobController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await scanJobService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

scanJobController.enumerate_scan_job_agents = async (req, res, next) => {
    try {
        let scanJobAgents = await scanJobService.enumerateScanJobAgents();
        res.status(200).send(scanJobAgents);
    }
    catch (err) {
        next(err);
    }
}

scanJobController.get_scan_job_agent = async (req, res, next) => {
    try {
        let scanJobAgent = await scanJobService.getScanJobAgent(req.params.agentId);
        res.status(200).send(scanJobAgent);
    }
    catch (err) {
        next(err);
    }
}

scanJobController.get_default_options = async (req, res, next) => {
    try {
        let defaultOptions = await scanJobService.getDefaultOptions();
        res.status(200).send(defaultOptions);
    }
    catch (err) {
        next(err);
    }
}

scanJobController.get_profile = async (req, res, next) => {
    try {
        let profile = await scanJobService.getProfile();
        res.status(200).send(profile);
    }
    catch (err) {
        next(err);
    }
}

scanJobController.enumerate_scan_jobs = async (req, res, next) => {
    try {
        let scanJobs = await scanJobService.enumerateScanJobs(req.params.agentId);
        res.status(200).send(scanJobs);
    }
    catch (err) {
        next(err);
    }
}

scanJobController.create_scan_job = async (req, res, next) => {
    try {
        let scanJob = await scanJobService.createScanJob(req.body, req.params.agentId);
        res.status(201).send(scanJob);
    }
    catch (err) {
        next(err);
    }
}

scanJobController.get_scan_job = async (req, res, next) => {
    try {
        let scanJob = await scanJobService.getScanJob(req.params.agentId, req.params.scanJobId);
        res.status(200).send(scanJob);
    }
    catch (err) {
        next(err);
    }
}

scanJobController.cancel_scan_job = async (req, res, next) => {
    try {
        let scanJobCancel = await scanJobService.cancelScanJob(req.params.agentId, req.params.scanJobId);
        res.status(200).send(scanJobCancel);
    }
    catch (err) {
        next(err);
    }
}

scanJobController.verify_scan_ticket = async (req, res, next) => {
    try {
        let verifyScanTicket = await scanJobService.verifyScanTicket(req.body);
        res.status(200).send(verifyScanTicket);
    }
    catch (err) {
        next(err);
    }
}

export default scanJobController;
