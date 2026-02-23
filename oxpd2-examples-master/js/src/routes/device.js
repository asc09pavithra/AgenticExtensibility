import express from 'express';
var deviceRouter = express.Router();

// Device Controllers
import deviceController from '../controllers/deviceController.js';

// Routes

// Capabilities
deviceRouter.get("/capabilities", deviceController.get_capabilities);

// DeploymentInformation
deviceRouter.get("/deploymentInformation", deviceController.get_deployment_information);

// Identity
deviceRouter.get("/identity", deviceController.get_identity);

// Status
deviceRouter.get("/status", deviceController.get_status);

// Email
deviceRouter.get("/email", deviceController.get_email);

// Scanner
deviceRouter.get("/scanner", deviceController.get_scanner);

export default deviceRouter;
