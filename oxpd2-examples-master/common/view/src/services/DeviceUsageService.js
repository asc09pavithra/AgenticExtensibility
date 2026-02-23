import BaseService from './BaseService';

// TODO -  Make better!!

class DeviceUsageService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/deviceUsage';
    }

    async getCapabilities(networkAddress) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async enumerateDeviceUsageAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/deviceUsageAgents');
    }

    async getDeviceUsageAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/deviceUsageAgents/' + agentId);
    }

    async getLifetimeCounters(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/deviceUsageAgents/' + agentId + '/lifetimeCounters');
    }
}

export default DeviceUsageService
