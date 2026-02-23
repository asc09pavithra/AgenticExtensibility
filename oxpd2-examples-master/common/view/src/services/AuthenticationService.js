import BaseService from './BaseService';

class AuthenticationService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/authentication';
    }

    async getCapabilities() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async enumerateAuthenticationAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/authenticationAgents');
    }

    async getAuthenticationAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/authenticationAgents/' + agentId);
    }

    async postLogin(agentId, prePromptResult) {
        const uri = `${this.apiRoot}${this.serviceRoot}/authenticationAgents/${agentId}/login`;
        return this.postResource(uri, prePromptResult);
    }

    async enumerateAuthenticationAccessPoints(queryParams) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/authenticationAccessPoints?' + queryParams);
    }

    async getAuthenticationAccessPoint(accessPointId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/authenticationAccessPoints/' + accessPointId);
    }

    async postInitiateLogin(accessPointId, ) {
        const uri = `${this.apiRoot}${this.serviceRoot}/authenticationAccessPoints/${accessPointId}/initiateLogin`;
        return this.postResource(uri);
    }

    async postSessionForceLogout() {
        const uri = `${this.apiRoot}${this.serviceRoot}/session/forceLogout`;
        return this.postResource(uri);
    }
}

export default AuthenticationService
