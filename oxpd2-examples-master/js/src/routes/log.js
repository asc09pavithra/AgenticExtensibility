import express from 'express';
var logRouter = express.Router();

// Log Controller
import logController from  '../controllers/logController.js';

// Routes
logRouter.get("/:logName", logController.get_log);

logRouter.delete("/:logName", logController.clear_log);

export default logRouter;
