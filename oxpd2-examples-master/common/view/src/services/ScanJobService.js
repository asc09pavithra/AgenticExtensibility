import BaseService from './BaseService';

// TODO -  Make better!!

class ScanJobService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/scanJob';
    }

    async getCapabilities(networkAddress) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async getDefaultOptions() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/defaultOptions');
    }

    async enumerateScanJobAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/scanJobAgents');
    }

    async getScanJobAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/scanJobAgents/' + agentId);
    }

    async enumerateScanJobs(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/scanJobAgents/' + agentId + '/scanJobs')
    }

    async getScanJob(agentId, scanJobId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/scanJobAgents/' + agentId + '/scanJobs/' + scanJobId)
    }

    async createScanJob(agentId, createRequest) {
        const uri = `${this.apiRoot}${this.serviceRoot}/scanJobAgents/${agentId}/scanJobs`;
        return this.postResource(uri, createRequest);
    }

    async cancelScanJob(agentId, scanJobId) {
        const uri = `${this.apiRoot}${this.serviceRoot}/scanJobAgents/${agentId}/scanJobs/${scanJobId}/cancel`;
        return this.postResource(uri);
    }

    async getScanProfile() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/profile');
    }

    async postScanJobTicketHelper(scanOptions) {
        const uri = `${this.apiRoot}${this.serviceRoot}/scanTicketHelper`;
        return this.postResource(uri, scanOptions) 
    }
}

export default ScanJobService
