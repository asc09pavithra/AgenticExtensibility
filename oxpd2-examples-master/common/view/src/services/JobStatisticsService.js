import BaseService from './BaseService';

class JobStatisticsService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/jobStatistics';
    }

    async getCapabilities() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async enumerateJobStatisticsAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/jobStatisticsAgents');
    }

    async getJobStatisticsAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/jobStatisticsAgents/' + agentId);
    }

    async enumerateJobs(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/jobStatisticsAgents/' + agentId + '/jobs');
    }

    async modifyJobs(agentId, payload) {
        return this.patchResource(this._apiRoot + this.serviceRoot + '/jobStatisticsAgents/' + agentId + '/jobs', payload);
    }

    async getJob(agentId, sequenceNumber) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/jobStatisticsAgents/' + agentId + '/jobs/' + sequenceNumber);
    }
}

export default JobStatisticsService
