import BaseService from "./BaseService";

class SecurityService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/security';
    }

    async getCapabilities(networkAddress) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async enumerateSecurityAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/securityAgents');
    }

    async getSecurityAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/securityAgents/' + agentId);
    }

    async resolveSecurityExpression(agentId, request) {
        return this.postResource(this._apiRoot + this.serviceRoot + '/securityAgents/' + agentId + '/resolveSecurityExpression', request);
    }
}

export default SecurityService;
