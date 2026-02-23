import jobStatisticsService from "../services/jobStatisticsService.js";

const jobStatisticsController = {};

jobStatisticsController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await jobStatisticsService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

jobStatisticsController.enumerate_job_statistics_agents = async (req, res, next) => {
    try {
        let jobStatisticsAgents = await jobStatisticsService.enumerateJobStatisticsAgents();
        res.status(200).send(jobStatisticsAgents);
    }
    catch (err) {
        next(err);
    }
}

jobStatisticsController.get_job_statistics_agent = async (req, res, next) => {
    try {
        let jobStatisticsAgent = await jobStatisticsService.getJobStatisticsAgent(req.params.agentId);
        res.status(200).send(jobStatisticsAgent);
    }
    catch (err) {
        next(err);
    }
}

jobStatisticsController.enumerate_jobs = async (req, res, next) => {
    try {
        let jobs = await jobStatisticsService.enumerateJobs(req.params.agentId);
        res.status(200).send(jobs);
    }
    catch (err) {
        next(err);
    }
}

jobStatisticsController.modify_jobs = async (req, res, next) => {
    try {
        let jobs = await jobStatisticsService.modifyJobs(req.params.agentId, req.body);
        res.status(200).send(jobs);
    }
    catch (err) {
        next(err);
    }
}

jobStatisticsController.get_job = async (req, res, next) => {
    try {
        let job = await jobStatisticsService.getJob(req.params.agentId, req.params.sequenceNumber);
        res.status(200).send(job);
    }
    catch (err) {
        next(err);
    }
}

export default jobStatisticsController;
