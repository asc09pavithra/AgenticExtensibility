import express from 'express';
var jobStatisticsAgentRouter = express.Router();

// Log Controller
import jobStatisticsAgentController from  '../controllers/jobStatisticsAgentController.js';

// Routes
jobStatisticsAgentRouter.post("/jobStatistics", jobStatisticsAgentController.post_notification);

export default jobStatisticsAgentRouter;
