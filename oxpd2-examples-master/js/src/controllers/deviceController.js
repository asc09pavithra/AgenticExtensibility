import deviceService from "../services/deviceService.js";

const deviceController = {};

deviceController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await deviceService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

deviceController.get_identity = async (req, res, next) => {
    try {
        let identity = await deviceService.getIdentity();
        res.status(200).send(identity);
    }
    catch (err) {
        next(err);
    }
}

deviceController.get_status = async (req, res, next) => {
    try {
        let status = await deviceService.getStatus();
        res.status(200).send(status);
    }
    catch (err) {
        next(err);
    }
}

deviceController.get_email = async (req, res, next) => {
    try {
        let email = await deviceService.getEmail();
        res.status(200).send(email);
    }
    catch (err) {
        next(err);
    }
}

deviceController.get_scanner = async (req, res, next) => {
    try {
        let scanner = await deviceService.getScanner();
        res.status(200).send(scanner);
    }
    catch (err) {
        next(err);
    }
}

deviceController.get_deployment_information = async (req, res, next) => {
    try {
        let deploymentInformation = await deviceService.getDeploymentInformation();
        res.status(200).send(deploymentInformation);
    }
    catch (err) {
        next(err);
    }
}

export default deviceController;
