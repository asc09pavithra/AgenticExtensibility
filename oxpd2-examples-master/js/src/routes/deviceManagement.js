import express from 'express';
var deviceManagementRouter = express.Router();

// DeviceManagement Controllers
import deviceManagementController from  '../controllers/deviceManagementController.js';

deviceManagementRouter.post("/bindDevice", deviceManagementController.bind_device);

deviceManagementRouter.post("/unbindDevice", deviceManagementController.unbind_device);

deviceManagementRouter.get("/device", deviceManagementController.get_device);

deviceManagementRouter.get("/device/servicesDiscovery", deviceManagementController.services_discovery);

deviceManagementRouter.post("/device/passwordGrant", deviceManagementController.password_grant);

deviceManagementRouter.get("/device/deviceInfo", deviceManagementController.device_info);

deviceManagementRouter.get("/device/tokens", deviceManagementController.tokens);

export default deviceManagementRouter;
