import express from 'express';
var printJobRouter = express.Router();

// Print Job Controllers
import printJobController from "../controllers/printJobController.js";

// Routes

// Capabilities
printJobRouter.get("/capabilities", printJobController.get_capabilities);

// Print Job Agents
printJobRouter.get("/printJobAgents", printJobController.enumerate_print_job_agents);

printJobRouter.get("/printJobAgents/:agentId", printJobController.get_print_job_agent);

export default printJobRouter;
