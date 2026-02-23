/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */
import { AccessTokenType } from "../models/accessTokenType.js";
import deviceManagementService from "./deviceManagementService.js";
import errors from './errors.js';
import oxpd2 from 'oxpd2';

const DeviceUsageServiceClient = oxpd2.DeviceUsageServiceClient;

class DeviceUsageService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let duc = new DeviceUsageServiceClient.DeviceUsageServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await duc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumerateDeviceUsageAgents() {
        // @StartCodeExample:EnumerateDeviceUsageAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let duc = new DeviceUsageServiceClient.DeviceUsageServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let deviceUsageAgents = await duc.deviceUsageAgentsGetAsync(accessToken);
        // @EndCodeExample
        return deviceUsageAgents;
    }

    async getDeviceUsageAgent(agentId) {
        // @StartCodeExample:GetDeviceUsageAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let duc = new DeviceUsageServiceClient.DeviceUsageServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let deviceUsageAgent = await duc.deviceUsageAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return deviceUsageAgent;
    }

    async getDeviceUsageAgentLifetimeCounters(agentId) {
        // @StartCodeExample:GetLifetimeCounters
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let duc = new DeviceUsageServiceClient.DeviceUsageServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let lifetimeCounters = await duc.deviceUsageAgentLifetimeCountersGetAsync(accessToken, agentId);
        // @EndCodeExample
        return lifetimeCounters;
    }
}

const deviceUsageService = new DeviceUsageService();

export default deviceUsageService;
