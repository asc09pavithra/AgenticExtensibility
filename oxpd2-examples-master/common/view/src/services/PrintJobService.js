import BaseService from './BaseService';

// TODO -  Make better!!

class PrintJobService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/printjob';
    }

    async getCapabilities(networkAddress) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async enumeratePrintJobAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/printJobAgents');
    }

    async getPrintJobAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/printJobAgents/' + agentId);
    }

}

export default PrintJobService
