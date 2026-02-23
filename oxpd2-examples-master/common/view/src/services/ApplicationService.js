import BaseService from './BaseService';
import { Multipart } from '../common/Multipart';
import { MultipartPart } from '../common/Multipart';
import { ReadFileText } from '../common/Utilities';

class ApplicationService extends BaseService {
    constructor(apiRoot) {
        super(apiRoot);
        this.serviceRoot = '/application';
    }

    async getCapabilities(networkAddress) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/capabilities');
    }

    async enumerateApplicationAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/applicationAgents');
    }

    async getApplicationAgent(applicationId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/applicationAgents/' + applicationId);
    }

    async refreshApplicationAgent(applicationId) {
        return this.postResource(this._apiRoot + this.serviceRoot + '/applicationAgents/' + applicationId + "/refresh", {});
    }

    async enumerateApplicationAccessPoints(queryParams) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/applicationAccessPoints?' + queryParams);
    }

    async getApplicationAccessPoint(accessPointId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/applicationAccessPoints/' + accessPointId);
    }

    async applicationAccessPointInitiateLaunch(accessPointId, initiateLaunchRequest, startIntentFile) {
        // Get the startIntent as string
        var startIntent = null;
        if (startIntentFile) {
            startIntent = await ReadFileText(startIntentFile);
        }

        if (null == startIntent) {
            return this.postResource(this._apiRoot + this.serviceRoot + '/applicationAccessPoints/' + accessPointId + "/initiateLaunch", initiateLaunchRequest);
        }

        let initiateLaunchMultipart = new InitiateLaunchMultipart(initiateLaunchRequest, startIntent);
        let response = await fetch(this._apiRoot + this.serviceRoot + '/applicationAccessPoints/' + accessPointId + "/initiateLaunch", {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': initiateLaunchMultipart.contentTypeHeaderValue
            },
            body: initiateLaunchMultipart.createBlob()
        });

        if (response.status === 204) {
            return;
        }

        if (response.status === 200 || response.status === 201) {
            let json = await response.json();
            return json;
        }

        throw new Error(response.status);
    }

    async getApplicationRuntime(networkAddress) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/applicationRuntime');
    }

    async enumerateI18nAssets() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/i18nAssets');
    }

    async getI18nAsset(i18nAssetId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/i18nAssets/' + i18nAssetId);
    }

    async resetApplicationRuntime() {
        return this.postResource(this._apiRoot + this.serviceRoot + '/applicationRuntime/reset', {});
    }

    async getApplicationRuntimeCurrentContext(networkAddress) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/applicationRuntime/currentContext');
    }

    async exitApplicationRuntimeCurrentContext() {
        return this.postResource(this._apiRoot + this.serviceRoot + '/applicationRuntime/currentContext/exit', {});
    }

    async execApplicationRuntimeCurrentContext(applicationId, startIntentFile) {
        var startIntent = null;
        if (startIntentFile) {
            startIntent = await ReadFileText(startIntentFile);
        }

        if (null == startIntent) {
            return this.postResource(this._apiRoot + this.serviceRoot + '/applicationRuntime/currentContext/exec' , {"applicationId": applicationId});
        }

        let execMultipart = new InitiateLaunchMultipart({"applicationId": applicationId}, startIntent);
        let response = await fetch(this._apiRoot + this.serviceRoot + '/applicationRuntime/currentContext/exec', {
            mode: 'cors',
            method: 'post',
            headers: {
                'Content-Type': execMultipart.contentTypeHeaderValue
            },
            body: execMultipart.createBlob()
        });

        if (response.status === 204) {
            return;
        }

        if (response.status === 200 || response.status === 201) {
            let json = await response.json();
            return json;
        }

        throw new Error(response.status);
    }

    async resetInactivityTimerApplicationRuntimeCurrentContext() {
        return this.postResource(this._apiRoot + this.serviceRoot + '/applicationRuntime/currentContext/resetInactivityTimer', {});
    }

    async getApplicationRuntimeCurrentContextRuntimeChrome() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/applicationRuntime/currentContext/runtimeChrome');
    }

    async replaceApplicationRuntimeCurrentContextRuntimeChrome(runtimeChrome_replace) {
        return this.putResource(this._apiRoot + this.serviceRoot + '/applicationRuntime/currentContext/runtimeChrome', runtimeChrome_replace);
    }

    async modifyApplicationRuntimeCurrentContextRuntimeChrome(runtimeChrome_modify) {
        return this.patchResource(this._apiRoot + this.serviceRoot + '/applicationRuntime/currentContext/runtimeChrome', runtimeChrome_modify);
    }

    async getApplicationRuntimeCurrentContextStartIntent() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/applicationRuntime/currentContext/startIntent');
    }

    async enumerateMessageCenterAgents() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/messageCenterAgents');
    }

    async getMessageCenterAgent(agentId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/messageCenterAgents/' + agentId);
    }

    async enumerateMessages(agentId, queryParams) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/messageCenterAgents/' + agentId + '/messages?'+ queryParams);
    }

    async getMessage(agentId, messageId) {
        return this.getResource(this._apiRoot + this.serviceRoot + '/messageCenterAgents/' + agentId + '/messages/' + messageId);
    }

    async deleteMessage(agentId, messageId) {
        return this.deleteResource(this._apiRoot + this.serviceRoot + '/messageCenterAgents/' + agentId + '/messages/' + messageId);
    }

    async createMessage(agentId, message) {
        const uri = `${this._apiRoot}${this.serviceRoot}/messageCenterAgents/${agentId}/messages`;
        return this.postResource(uri, message);
    }

    async getHomescreen() {
        return this.getResource(this._apiRoot + this.serviceRoot + '/homescreen');
    }

    async modifyHomescreen(homescreenModify) {
        return this.patchResource(this._apiRoot + this.serviceRoot + '/homescreen', homescreenModify);
    }
}

class InitiateLaunchMultipart extends Multipart {
    constructor(initiateLaunchRequest, startIntent) {
        let parts = [];

        // First the content-part
        parts.push(InitiateLaunchMultipart.createContentMultipartPart(initiateLaunchRequest));

        // Next the startIntent-part if provided
        if (typeof startIntent !== 'undefined' && startIntent !== null) {
            parts.push(InitiateLaunchMultipart.createStartIntentMultipartPart(startIntent));
        }

        super(parts);
    }

    static createContentMultipartPart(content) {
        const headers = [
            'Content-Type: application/json',
            'Content-Disposition: form-data; name="content"'
        ]
        return new MultipartPart(headers, JSON.stringify(content));
    }

    static createStartIntentMultipartPart(startIntent) {
        const headers = [
            'Content-Type: application/json',
            'Content-Disposition: form-data; name="startIntent"'
        ]
        return new MultipartPart(headers, startIntent);
    }
}

export default ApplicationService
