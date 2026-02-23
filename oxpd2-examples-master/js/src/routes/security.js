import express from 'express';
var securityRouter = express.Router();

// Security Controllers
import securityController from '../controllers/securityController.js';

// Routes

// Capabilities
securityRouter.get("/capabilities", securityController.get_capabilities);

// Security Agents
securityRouter.get("/securityAgents", securityController.enumerate_security_agents);

securityRouter.get("/securityAgents/:agentId", securityController.get_security_agent);

// Resolve Security Expression
securityRouter.post("/securityAgents/:agentId/resolveSecurityExpression", securityController.resolve_security_expression);

export default securityRouter;
