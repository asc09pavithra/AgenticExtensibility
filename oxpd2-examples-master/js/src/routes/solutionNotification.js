import express from 'express';
var solutionNotificationRouter = express.Router();

// Log Controller
import solutionNotificationController from  '../controllers/solutionNotificationController.js';

// Routes
solutionNotificationRouter.post("/", solutionNotificationController.post_notification);

export default solutionNotificationRouter;
