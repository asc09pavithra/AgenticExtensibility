import deviceManagementService from '../services/deviceManagementService.js';

const deviceManagementController = {};

// Bind Device
deviceManagementController.bind_device = async (req, res, next) => {
    try {
        var device = await deviceManagementService.bindDevice(req.body.networkAddress);
        res.status(200).send(device);
    }
    catch (err) {
        next(err);
    }
};

deviceManagementController.unbind_device = async (req, res, next) => {
    try {
        await deviceManagementService.unbindDevice();
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}

deviceManagementController.get_device = async (req, res, next) => {
    try {
        var device = deviceManagementService.currentDevice;
        let status = device != null ? 200 : 204;
        res.status(status).send(device);
    }
    catch (err) {
        next(err);
    }
}

deviceManagementController.password_grant = async (req, res, next) => {
    try {
        var token = await deviceManagementService.passwordGrant(req.body.username, req.body.password);
        res.status(200).send(token.toJSON());
    }
    catch (err) {
        next(err);
    }
}

deviceManagementController.services_discovery = async (req, res, next) => {
    try {
        var dt = await deviceManagementService.getServicesDiscovery();
        res.send(dt);
    }
    catch (err) {
        next(err);
    }
}

deviceManagementController.device_info = async (req, res, next) => {
    try {
        var deviceInfo = await deviceManagementService.getDeviceInformation();
        res.status(200).send(deviceInfo);
    }
    catch (err) {
        next(err);
    }
}

deviceManagementController.tokens = (req, res, next) => {
    try {
        var accessTokenInfo = deviceManagementService.getTokens();
        res.status(200).send(accessTokenInfo);
    }
    catch (err) {
        next(err);
    }
}

export default deviceManagementController;
