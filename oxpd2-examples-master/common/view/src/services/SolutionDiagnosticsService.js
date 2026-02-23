import BaseService from './BaseService';

class SolutionDiagnosticsService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/solutionDiagnostics';
    }

    async getCapabilities() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async enumerateSolutionDiagnosticsAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/solutionDiagnosticsAgents');
    }

    async getSolutionDiagnosticsAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/solutionDiagnosticsAgents/' + agentId);
    }

    async getSolutionDiagnosticsAgentLog(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/solutionDiagnosticsAgents/' + agentId + "/log");
    }
}

export default SolutionDiagnosticsService
