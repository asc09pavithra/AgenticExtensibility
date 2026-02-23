import BaseService from './BaseService';

class SuppliesService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/supplies';
    }

    async getCapabilities() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async enumerateSuppliesAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/suppliesAgents');
    }

    async getSuppliesAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/suppliesAgents/' + agentId);
    }
    
    async getSuppliesConfiguration(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/suppliesAgents/' + agentId + '/suppliesConfiguration');
    }

    async getSuppliesInfo(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/suppliesAgents/' + agentId + '/suppliesInfo');
    }
    
    async getSuppliesUsage(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/suppliesAgents/' + agentId + '/suppliesUsage');
    }
}

export default SuppliesService
