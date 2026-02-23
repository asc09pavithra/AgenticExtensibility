import express from 'express';
var authenticationRouter = express.Router();

// Authentcation Controllers
import authenticationController from '../controllers/authenticationController.js';

// Routes

// Capabilities
authenticationRouter.get("/capabilities", authenticationController.get_capabilities);

// Authentication Access Point/s
authenticationRouter.get("/authenticationAccessPoints", authenticationController.enumerate_authentication_accesspoints);

authenticationRouter.get("/authenticationAccessPoints/:accessPointId", authenticationController.get_authentication_accesspoint);

authenticationRouter.post("/authenticationAccessPoints/:accessPointId/initiateLogin", authenticationController.authentication_accesspoint_initiate_login);

// Authentication Agent/s
authenticationRouter.get("/authenticationAgents", authenticationController.enumerate_authentication_agents);

authenticationRouter.get("/authenticationAgents/:agentId", authenticationController.get_authentication_agent);

authenticationRouter.post("/authenticationAgents/:agentId/login", authenticationController.authentication_agent_login);

// Session
authenticationRouter.post("/session/forceLogout", authenticationController.session_force_logout);

export default authenticationRouter;
