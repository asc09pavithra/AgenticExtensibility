import BaseService from './BaseService';

class CopyService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/copy';
    }

    async getCapabilities() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async getDefaultOptions() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/defaultOptions');
    }

    async getCopyProfile() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/profile');
    }

    async enumerateCopyAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/copyAgents');
    }

    async getCopyAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/copyAgents/' + agentId);
    }

    async enumerateCopyJobs(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/copyAgents/' + agentId + '/copyJobs')
    }

    async getCopyJob(agentId, copyJobId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/copyAgents/' + agentId + '/copyJobs/' + copyJobId)
    }

    async createCopyJob(agentId, createRequest) {
        const uri = `${this.apiRoot}${this.serviceRoot}/copyAgents/${agentId}/copyJobs`;
        return this.postResource(uri, createRequest);
    }

    async cancelCopyJob(agentId, copyJobId) {
        const uri = `${this.apiRoot}${this.serviceRoot}/copyAgents/${agentId}/copyJobs/${copyJobId}/cancel`;
        return this.postResource(uri);
    }

    async postCopyJobTicketHelper(copyOptions) {
        const uri = `${this.apiRoot}${this.serviceRoot}/copyTicketHelper`;
        return this.postResource(uri, copyOptions) 
    }

    async enumerateStoredJobs(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/copyAgents/' + agentId + '/storedJobs')
    }

    async getStoredJob(agentId, jobId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/copyAgents/' + agentId + '/storedJobs/' + jobId)
    }

    async removeStoredJob(agentId, jobId, requestBody) {
        const uri = `${this.apiRoot}${this.serviceRoot}/copyAgents/${agentId}/storedJobs/${jobId}/remove`;
        return this.postResource(uri, requestBody);
    }

    async releaseStoredJob(agentId, jobId, requestBody) {
        const uri = `${this.apiRoot}${this.serviceRoot}/copyAgents/${agentId}/storedJobs/${jobId}/release`;
        return this.postResource(uri, requestBody);
    }

    async postStoredCopyJobTicketHelper(copyOptions) {
        const uri = `${this.apiRoot}${this.serviceRoot}/storedCopyTicketHelper`;
        return this.postResource(uri, copyOptions) 
    }
}

export default CopyService
