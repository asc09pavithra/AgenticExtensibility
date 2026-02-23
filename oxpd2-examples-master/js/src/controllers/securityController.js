import securityService from "../services/securityService.js";
import oxpd2 from "oxpd2"

const securityController = {};

securityController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await securityService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

securityController.enumerate_security_agents = async (req, res, next) => {
    try {
        let securityAgents = await securityService.enumerateSecurityAgents();
        res.status(200).send(securityAgents);
    }
    catch (err) {
        next(err);
    }
}

securityController.get_security_agent = async (req, res, next) => {
    try {
        let securityAgent = await securityService.getSecurityAgent(req.params.agentId);
        res.status(200).send(securityAgent);
    }
    catch (err) {
        next(err);
    }
}

securityController.resolve_security_expression = async (req, res, next) => {
    try {
        let resolveSecurityExpressionRequest = new oxpd2.SecurityService.ResolveSecurityExpressionRequest(req.body);
        let resolvedExpression = await securityService.resolveSecurityExpression(req.params.agentId, resolveSecurityExpressionRequest);
        res.status(200).send(resolvedExpression);
    }
    catch (err) {
        next(err);
    }
}

export default securityController;
