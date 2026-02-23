import authenticationService from "../services/authenticationService.js";

const authenticationController = {};

authenticationController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await authenticationService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

authenticationController.enumerate_authentication_accesspoints = async (req, res, next) => {
    let query = new URLSearchParams(req.query);

    try {
        let authenticationAccessPoints = await authenticationService.enumerateAuthenticationAccessPoints(query);
        res.status(200).send(authenticationAccessPoints);
    }
    catch (err) {
        next(err);
    }
}

authenticationController.get_authentication_accesspoint = async (req, res, next) => {
    try {
        let authenticationAccessPoint = await authenticationService.getAuthenticationAccessPoint(req.params.accessPointId);
        res.status(200).send(authenticationAccessPoint);
    }
    catch (err) {
        next(err);
    }
}

authenticationController.authentication_accesspoint_initiate_login = async (req, res, next) => {
    try {
        let loginResult = await authenticationService.authenticationAccessPointInitiateLogin(req.params.accessPointId);
        res.status(200).send(loginResult);
    }
    catch (err) {
        next(err);
    }
}

authenticationController.enumerate_authentication_agents = async (req, res, next) => {
    try {
        let authenticationAgents = await authenticationService.enumerateAuthenticationAgents();
        res.status(200).send(authenticationAgents);
    }
    catch (err) {
        next(err);
    }
}

authenticationController.get_authentication_agent = async (req, res, next) => {
    try {
        let authenticationAgent = await authenticationService.getAuthenticationAgent(req.params.agentId);
        res.status(200).send(authenticationAgent);
    }
    catch (err) {
        next(err);
    }
}

authenticationController.authentication_agent_login = async (req, res, next) => {
    try {
        let loginResult = await authenticationService.authenticationAgentLogin(req.body, req.params.agentId);
        res.status(200).send(loginResult);
    }
    catch (err) {
        next(err);
    }
}

authenticationController.session_force_logout = async (req, res, next) => {
    try {
        let logoutResult = await authenticationService.sessionForceLogout();
        res.status(200).send(logoutResult);
    }
    catch (err) {
        next(err);
    }
}

export default authenticationController;
