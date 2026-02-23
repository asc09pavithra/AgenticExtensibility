import express from 'express';
var scanJobRouter = express.Router();

// Scan Job Controllers
import scanJobController from "../controllers/scanJobController.js";

// Routes

// Capabilities
scanJobRouter.get("/capabilities", scanJobController.get_capabilities);

// Scan Job Agents
scanJobRouter.get("/scanJobAgents", scanJobController.enumerate_scan_job_agents);

scanJobRouter.get("/scanJobAgents/:agentId", scanJobController.get_scan_job_agent);

// Default Options
scanJobRouter.get("/defaultOptions", scanJobController.get_default_options);

// Profile
scanJobRouter.get("/profile", scanJobController.get_profile);

// Scan Jobs
scanJobRouter.get("/scanJobAgents/:agentId/scanJobs", scanJobController.enumerate_scan_jobs);

scanJobRouter.post("/scanJobAgents/:agentId/scanJobs", scanJobController.create_scan_job);

scanJobRouter.get("/scanJobAgents/:agentId/scanJobs/:scanJobId", scanJobController.get_scan_job);

scanJobRouter.post("/scanJobAgents/:agentId/scanJobs/:scanJobId/cancel", scanJobController.cancel_scan_job);

// Scan Ticket Helper
scanJobRouter.post("/scanTicketHelper", scanJobController.verify_scan_ticket);

export default scanJobRouter;
