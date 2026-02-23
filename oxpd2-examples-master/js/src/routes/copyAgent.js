import express from 'express';
var copyAgentRouter = express.Router();

// Log Controller
import copyAgentController from  '../controllers/copyAgentController.js';

// Routes
copyAgentRouter.post("/copyJobNotification", copyAgentController.post_notification);

export default copyAgentRouter;
