/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */
import { AccessTokenType } from "../models/accessTokenType.js";
import deviceManagementService from "./deviceManagementService.js";
import errors from './errors.js';
import oxpd2 from 'oxpd2';

const SuppliesServiceClient = oxpd2.SuppliesServiceClient;

class SuppliesService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let sc = new SuppliesServiceClient.SuppliesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await sc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumerateSuppliesAgents() {
        // @StartCodeExample:EnumerateSuppliesAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sc = new SuppliesServiceClient.SuppliesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let suppliesAgents = await sc.suppliesAgentsGetAsync(accessToken);
        // @EndCodeExample
        return suppliesAgents;
    }

    async getSuppliesAgent(agentId) {
        // @StartCodeExample:GetSuppliesAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sc = new SuppliesServiceClient.SuppliesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let suppliesAgent = await sc.suppliesAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return suppliesAgent;
    }

    async getSuppliesConfiguration(agentId) {
        // @StartCodeExample:GetSuppliesConfiguration
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sc = new SuppliesServiceClient.SuppliesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let suppliesConfiguration = await sc.suppliesAgentSuppliesConfigurationGetAsync(accessToken, agentId);
        // @EndCodeExample
        return suppliesConfiguration;
    }

    async getSuppliesInfo(agentId) {
        // @StartCodeExample:GetSuppliesInfo
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sc = new SuppliesServiceClient.SuppliesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let suppliesInfo = await sc.suppliesAgentSuppliesInfoGetAsync(accessToken, agentId);
        // @EndCodeExample
        return suppliesInfo;
    }

    async getSuppliesUsage(agentId) {
        // @StartCodeExample:GetSuppliesUsage
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sc = new SuppliesServiceClient.SuppliesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let suppliesUsage = await sc.suppliesAgentSuppliesUsageGetAsync(accessToken, agentId);
        // @EndCodeExample
        return suppliesUsage;
    }
}

const suppliesService = new SuppliesService();

export default suppliesService;
