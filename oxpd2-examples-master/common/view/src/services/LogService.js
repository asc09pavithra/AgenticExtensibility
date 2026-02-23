import BaseService from './BaseService';

class LogService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/log';
    }

    async getLog(logName) {
        return this.getResource(this._apiRoot + this.serviceRoot + "/" + logName);
    }

    async clearLog(logName) {
        return this.deleteResource(this._apiRoot + this.serviceRoot + "/" + logName);
    }
}

export default LogService
