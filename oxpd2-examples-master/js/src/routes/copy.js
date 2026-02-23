// Copy Controllers
import copyController from "../controllers/copyController.js";
import express from 'express';
var copyRouter = express.Router();


// Capabilities
copyRouter.get("/capabilities", copyController.get_capabilities);

// Copy Agents
copyRouter.get("/copyAgents", copyController.enumerate_copy_agents);

copyRouter.get("/copyAgents/:agentId", copyController.get_copy_agent);

// Copy Jobs
copyRouter.get("/copyAgents/:agentId/copyJobs", copyController.enumerate_copy_jobs);

copyRouter.post("/copyAgents/:agentId/copyJobs", copyController.create_copy_job);

copyRouter.get("/copyAgents/:agentId/copyJobs/:copyJobId", copyController.get_copy_job);

copyRouter.post("/copyAgents/:agentId/copyJobs/:copyJobId/cancel", copyController.cancel_copy_job);

// Stored Jobs
copyRouter.get("/copyAgents/:agentId/storedJobs", copyController.enumerate_stored_jobs);

copyRouter.get("/copyAgents/:agentId/storedJobs/:jobId", copyController.get_stored_job);

copyRouter.post("/copyAgents/:agentId/storedJobs/:jobId/release", copyController.release_stored_job);

copyRouter.post("/copyAgents/:agentId/storedJobs/:jobId/remove", copyController.remove_stored_job);

// Default Options
copyRouter.get("/defaultOptions", copyController.get_default_options);

// Profile
copyRouter.get("/profile", copyController.get_profile);

// Copy Ticket Helpers
copyRouter.post("/copyTicketHelper", copyController.verify_copy_ticket);

copyRouter.post("/storedCopyTicketHelper", copyController.verify_stored_copy_ticket);

export default copyRouter;
