import express from 'express';
var jobStatisticsRouter = express.Router();

// Job Statistics Controllers
import jobStatisticsController from "../controllers/jobStatisticsController.js";

// Routes

// Capabilities
jobStatisticsRouter.get("/capabilities", jobStatisticsController.get_capabilities);

// Job Statistics Agents
jobStatisticsRouter.get("/jobStatisticsAgents", jobStatisticsController.enumerate_job_statistics_agents);

jobStatisticsRouter.get("/jobStatisticsAgents/:agentId", jobStatisticsController.get_job_statistics_agent);

// Jobs
jobStatisticsRouter.get("/jobStatisticsAgents/:agentId/jobs", jobStatisticsController.enumerate_jobs);

jobStatisticsRouter.patch("/jobStatisticsAgents/:agentId/jobs", jobStatisticsController.modify_jobs);

jobStatisticsRouter.get("/jobStatisticsAgents/:agentId/jobs/:sequenceNumber", jobStatisticsController.get_job);

export default jobStatisticsRouter;
