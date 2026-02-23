import BaseService from './BaseService';

// TODO -  Make better!!

class DeviceManagementService extends BaseService {
    // https://eslint.org/docs/rules/no-useless-constructor
    //constructor(apiRoot) {
    //    super(apiRoot);
    //}


    async bindDevice(networkAddress) {
        return this.postResource(this._apiRoot + '/deviceManagement/bindDevice', { networkAddress: networkAddress });
    }

    async unbindDevice(networkAddress) {
        return this.postResource(this._apiRoot + '/deviceManagement/unbindDevice');
    }

    async getCurrentDevice() {
        return this.getResource(this._apiRoot + '/deviceManagement/device');
    }

    async passwordGrant(username, password) {
        console.log('api root is: ' + this.apiRoot);
        return this.postResource(this._apiRoot + '/deviceManagement/device/passwordGrant', { username: username, password: password });
    }

    async getDeviceServicesDiscovery() {
        return this.getResource(this._apiRoot + '/deviceManagement/device/servicesDiscovery');
    }

    async getDeviceInfo() {
        return this.getResource(this._apiRoot + '/deviceManagement/device/deviceInfo');
    }

    async getTokens() {
        return this.getResource(this._apiRoot + '/deviceManagement/device/tokens');
    }
}

export default DeviceManagementService
