import BaseService from './BaseService';

class UsbAccessoriesService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/usbAccessories';
    }

    async getCapabilities(networkAddress) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async enumerateUsbAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/usbAccessoriesAgents');
    }

    async getUsbAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/usbAccessoriesAgents/' + agentId);
    }

    async enumerateUsbAccessories() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/accessories');
    }

    async getUsbAccessory(accessoryId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/accessories/' + accessoryId);
    }

    async getUsbAccessoryHid(accessoryId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/accessories/' + accessoryId + '/hid');
    }

    async openUsbAccessoryHid(accessoryId, isOwned, requestedPayload) {
        return this.postResource(this._apiRoot + this.serviceRoot + '/accessories/' + accessoryId + '/hid/open?isOwned=' + isOwned, requestedPayload);
    }

    async getOpenHIDAccessory(accessoryId, openHIDAccessoryId, isOwned) {
        return this.getResource(this.apiRoot + this.serviceRoot + '/accessories/' + accessoryId + '/hid/' + openHIDAccessoryId + '?isOwned=' + isOwned);
    }

    async modifyOpenHIDAccessory(accessoryId, openHIDAccessoryId, modification_request, isOwned) {
        return this.patchResource(this.apiRoot + this.serviceRoot + '/accessories/' + accessoryId + '/hid/' + openHIDAccessoryId + '?isOwned=' + isOwned, modification_request);
    }

    async deleteOpenHIDAccessory(accessoryId, openHIDAccessoryId, isOwned) {
        return this.deleteResource(this.apiRoot + this.serviceRoot + '/accessories/' + accessoryId + '/hid/' + openHIDAccessoryId + '?isOwned=' + isOwned);
    }

    async readReportOpenHIDAccessory(accessoryId, openHIDAccessoryId, readReportRequest, isOwned) {
        return this.postResource(this.apiRoot + this.serviceRoot + '/accessories/' + accessoryId + '/hid/' + openHIDAccessoryId + '/readReport?isOwned=' + isOwned, readReportRequest);
    }

    async writeReportOpenHIDAccessory(accessoryId, openHIDAccessoryId, writeReportRequest, isOwned) {
        return this.postResource(this.apiRoot + this.serviceRoot + '/accessories/' + accessoryId + '/hid/' + openHIDAccessoryId + '/writeReport?isOwned=' + isOwned, writeReportRequest);
    }
}

export default UsbAccessoriesService
