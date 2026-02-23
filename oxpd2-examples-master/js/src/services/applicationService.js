/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import deviceManagementService from "./deviceManagementService.js";
import oxpd2 from 'oxpd2';
const ApplicationServiceClient = oxpd2.ApplicationServiceClient;

import errors from './errors.js';
import { AccessTokenType } from "../models/accessTokenType.js";

class ApplicationService {

    constructor(props) {
        // TODO?
    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await ac.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumerateApplicationAccessPoints(queryParams) {
        // @StartCodeExample:EnumerateApplicationAccessPoints
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let applicationAccessPoints = await ac.applicationAccessPointsGetAsync(accessToken, queryParams);
        // @EndCodeExample
        return applicationAccessPoints;
    }

    async getApplicationAccessPoint(accessPointId) {
        // @StartCodeExample:GetApplicationAccessPoint
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let applicationAccessPoint = await ac.applicationAccessPointGetAsync(accessToken, accessPointId);
        // @EndCodeExample
        return applicationAccessPoint;
    }

    async applicationAccessPointInitiateLaunch(accessPointId, initiateLaunchRequest, startIntent) {
        // @StartCodeExample:ApplicationAccessPointInitiateLaunch
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let applicationAccessPointInitiateLaunch = await ac.applicationAccessPointInitiateLaunch(accessToken, accessPointId, initiateLaunchRequest, startIntent);
        // @EndCodeExample
        return applicationAccessPointInitiateLaunch;
    }

    async enumerateApplicationAgents() {
        // @StartCodeExample:EnumerateApplicationAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        
        let applicationAgents = await ac.applicationAgentsGetAsync(accessToken);
        // @EndCodeExample
        return applicationAgents;
    }

    async getApplicationAgent(agentId) {
        // @StartCodeExample:GetApplicationAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let applicationAgent = await ac.applicationAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return applicationAgent;
    }

    async refreshApplicationAgent(refreshRequest, agentId) {
        // @StartCodeExample:RefreshApplicationAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let applicationAgent = await ac.applicationAgentRefreshAsync(accessToken, agentId, refreshRequest);
        // @EndCodeExample
        return applicationAgent;
    }

    async getApplicationRuntime() {
        // @StartCodeExample:GetApplicationRuntime
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let applicationRuntime = await ac.applicationRuntimeGetAsync(accessToken);
        // @EndCodeExample
        return applicationRuntime;
    }

    async resetApplicationRuntime(resetRequest) {
        // @StartCodeExample:ResetApplicationRuntime
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let applicationRuntimeReset = await ac.applicationRuntimeResetAsync(accessToken, resetRequest);

        deviceManagementService.setUiContextAccessToken(null)
        // @EndCodeExample
        return applicationRuntimeReset;
    }

    async getCurrentContext() {
        // @StartCodeExample:GetCurrentContext
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let currentContext = await ac.currentContextGetAsync(accessToken);
        // @EndCodeExample
        return currentContext;
    }

    async resetInactivityTimerCurrentContext(resetRequest) {
        // @StartCodeExample:ResetInactivityTimerCurrentContext
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.UI_Context
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let currentContext_ResetInactivityTimer = await ac.currentContextResetInactivityTimerAsync(accessToken, resetRequest);
        // @EndCodeExample
        return currentContext_ResetInactivityTimer;
    }

    async exitCurrentContext(exitRequest) {
        // @StartCodeExample:ExitCurrentContext
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.UI_Context
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let currentContext_Exit = await ac.currentContextExitAsync(accessToken, exitRequest);
        deviceManagementService.setUiContextAccessToken(new oxpd2.Oauth2Client.Token())
        // @EndCodeExample
        return currentContext_Exit;
    }

    async execCurrentContext(execRequest, startIntent) {
        // @StartCodeExample:ExecCurrentContext
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.UI_Context
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let currentContext_Exec = await ac.currentContextExecAsync(accessToken, execRequest, startIntent);
        // @EndCodeExample
        return currentContext_Exec;
    }

    async getStartIntent() {
        // @StartCodeExample:GetStartIntent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.UI_Context
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let startIntent = await ac.currentContextStartIntentGetAsync(accessToken);
        // @EndCodeExample
        return startIntent;
    }

    async getRuntimeChrome() {
        // @StartCodeExample:GetRuntimeChrome
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.UI_Context
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let runtimeChrome = await ac.currentContextRuntimeChromeGetAsync(accessToken);
        // @EndCodeExample
        return runtimeChrome;
    }

    async replaceRuntimeChrome(runtimeChromeReplace) {
        // @StartCodeExample:ReplaceRuntimeChrome
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.UI_Context
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let runtimeChrome = await ac.currentContextRuntimeChromeReplaceAsync(accessToken, runtimeChromeReplace);
        // @EndCodeExample
        return runtimeChrome;
    }

    async modifyRuntimeChrome(runtimeChromeModify) {
        // @StartCodeExample:ModifyRuntimeChrome
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.UI_Context
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let runtimeChrome = await ac.currentContextRuntimeChromeModifyAsync(accessToken, runtimeChromeModify);
        // @EndCodeExample
        return runtimeChrome;
    }

    async enumerateI18nAssets() {
        // @StartCodeExample:EnumerateI18nAssets
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        
        let i18nAssets = await ac.i18nAssetsGetAsync(accessToken);
        // @EndCodeExample
        return i18nAssets;
    }

    async getI18nAsset(assetId) {
        // @StartCodeExample:GetI18nAsset
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let i18nAsset = await ac.i18nAssetGetAsync(accessToken, assetId);
        // @EndCodeExample
        return i18nAsset;
    }

    async enumerateMessageCenterAgents() {
        // @StartCodeExample:EnumerateMessageCenterAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        
        let messageCenterAgents = await ac.messageCenterAgentsGetAsync(accessToken);
        // @EndCodeExample
        return messageCenterAgents;
    }

    async getMessageCenterAgent(agentId) {
        // @StartCodeExample:GetMessageCenterAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let messageCenterAgent = await ac.messageCenterAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return messageCenterAgent;
    }

    async enumerateMessages(agentId, queryParams) {
        // @StartCodeExample:EnumerateMessages
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);

        let messages = await ac.messagesGetAsync(accessToken, agentId, queryParams);
        console.log(messages.members);
        // @EndCodeExample
        return messages;
    }

    async createMessage(messageCreate, agentId) {
        // @StartCodeExample:CreateMessage
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let message = await ac.messageCreateAsync(accessToken, agentId, messageCreate);
        // @EndCodeExample
        return message;
    }

    async getMessage(agentId, messageId) {
        // @StartCodeExample:GetMessage
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let message = await ac.messageGetAsync(accessToken, agentId, messageId);
        // @EndCodeExample
        return message;
    }

    async deleteMessage(agentId, messageId) {
        // @StartCodeExample:DeleteMessage
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let opMeta = await ac.messageDeleteAsync(accessToken, agentId, messageId);
        // @EndCodeExample
        return opMeta;
    }

    async getHomescreen() {
        // @StartCodeExample:GetHomescreen
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let homescreen = await ac.homescreenGetAsync(accessToken);
        // @EndCodeExample
        return homescreen;
    }

    async modifyHomescreen(homescreenModify) {
        // @StartCodeExample:ModifyHomescreen
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new ApplicationServiceClient.ApplicationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let homescreen = await ac.homescreenModifyAsync(accessToken, homescreenModify);
        // @EndCodeExample
        return homescreen;
    }
}

const applicationService = new ApplicationService();

export default applicationService;
