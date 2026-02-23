import BaseService from './BaseService';

class DeviceService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/device';
    }

    async getCapabilities() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async getIdentity() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/identity');
    }

    async getStatus() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/status')
    }

    async getEmail() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/email')
    }

    async getScanner() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/scanner')
    }

    async getDeploymentInformation() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/deploymentInformation')
    }
}

export default DeviceService
