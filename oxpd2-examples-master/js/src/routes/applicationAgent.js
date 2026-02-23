import express from 'express';
var applicationAgentRouter = express.Router();

// ApplicationAgent Controllers
import applicationAgentController from '../controllers/applicationAgentController.js';

// Routes

applicationAgentRouter.get("/index.html", applicationAgentController.get_application);

export default applicationAgentRouter;
