import copyService from "../services/copyService.js";

const copyController = {};

copyController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await copyService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

copyController.enumerate_copy_agents = async (req, res, next) => {
    try {
        let copyAgents = await copyService.enumerateCopyAgents();
        res.status(200).send(copyAgents);
    }
    catch (err) {
        next(err);
    }
}

copyController.get_copy_agent = async (req, res, next) => {
    try {
        let copyAgent = await copyService.getCopyAgent(req.params.agentId);
        res.status(200).send(copyAgent);
    }
    catch (err) {
        next(err);
    }
}

copyController.enumerate_copy_jobs = async (req, res, next) => {
    try {
        let copyJobs = await copyService.enumerateCopyJobs(req.params.agentId);
        res.status(200).send(copyJobs);
    }
    catch (err) {
        next(err);
    }
}

copyController.create_copy_job = async (req, res, next) => {
    try {
        let copyJob = await copyService.createCopyJob(req.body, req.params.agentId);
        res.status(201).send(copyJob);
    }
    catch (err) {
        next(err);
    }
}

copyController.get_copy_job = async (req, res, next) => {
    try {
        let copyJob = await copyService.getCopyJob(req.params.agentId, req.params.copyJobId);
        res.status(200).send(copyJob);
    }
    catch (err) {
        next(err);
    }
}

copyController.cancel_copy_job = async (req, res, next) => {
    try {
        let copyJobCancel = await copyService.cancelCopyJob(req.params.agentId, req.params.copyJobId);
        res.status(200).send(copyJobCancel);
    }
    catch (err) {
        next(err);
    }
}

copyController.get_default_options = async (req, res, next) => {
    try {
        let defaultOptions = await copyService.getDefaultOptions();
        res.status(200).send(defaultOptions);
    }
    catch (err) {
        next(err);
    }
}

copyController.get_profile = async (req, res, next) => {
    try {
        let profile = await copyService.getProfile();
        res.status(200).send(profile);
    }
    catch (err) {
        next(err);
    }
}

copyController.verify_copy_ticket = async (req, res, next) => {
    try {
        let verifyCopyTicket = await copyService.verifyCopyTicket(req.body);
        res.status(200).send(verifyCopyTicket);
    }
    catch (err) {
        next(err);
    }
}

copyController.enumerate_stored_jobs = async (req, res, next) => {
    try {
        let storedJobs = await copyService.enumerateStoredJobs(req.params.agentId);
        res.status(200).send(storedJobs);
    }
    catch (err) {
        next(err);
    }
}

copyController.get_stored_job = async (req, res, next) => {
    try {
        let storedJob = await copyService.getStoredJob(req.params.agentId, req.params.jobId);
        res.status(200).send(storedJob);
    }
    catch (err) {
        next(err);
    }
}

copyController.release_stored_job = async (req, res, next) => {
    try {
        let storedJobRelease = await copyService.releaseStoredJob(req.params.agentId, req.params.jobId, req.body);
        res.status(200).send(storedJobRelease);
    }
    catch (err) {
        next(err);
    }
}

copyController.remove_stored_job = async (req, res, next) => {
    try {
        let storedJobRemove = await copyService.removeStoredJob(req.params.agentId, req.params.jobId, req.body);
        res.status(200).send(storedJobRemove);
    }
    catch (err) {
        next(err);
    }
}

copyController.verify_stored_copy_ticket = async (req, res, next) => {
    try {
        let verifyStoredCopyTicket = await copyService.verifyStoredCopyTicket(req.body);
        res.status(200).send(verifyStoredCopyTicket);
    }
    catch (err) {
        next(err);
    }
}

export default copyController;
