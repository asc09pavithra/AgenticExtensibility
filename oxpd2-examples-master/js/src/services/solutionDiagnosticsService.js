/**
 * (C) Copyright 2022 HP Development Company, L.P.
 * All rights reserved.
 */

import deviceManagementService from "./deviceManagementService.js";
import oxpd2 from 'oxpd2';
const SolutionDiagnosticsServiceClient = oxpd2.SolutionDiagnosticsServiceClient;
import errors from './errors.js';
import { AccessTokenType } from "../models/accessTokenType.js";

class SolutionDiagnosticsService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let sdc = new SolutionDiagnosticsServiceClient.SolutionDiagnosticsServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await sdc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumerateSolutionDiagnosticsAgents() {
        // @StartCodeExample:EnumerateSolutionDiagnosticsAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sdc = new SolutionDiagnosticsServiceClient.SolutionDiagnosticsServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);


        let solutionDiagnosticsAgents = await sdc.solutionDiagnosticsAgentsGetAsync(accessToken);
        // @EndCodeExample
        return solutionDiagnosticsAgents;
    }

    async getSolutionDiagnosticsAgent(agentId) {
        // @StartCodeExample:GetSolutionDiagnosticsAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sdc = new SolutionDiagnosticsServiceClient.SolutionDiagnosticsServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let solutionDiagnosticsAgent = await sdc.solutionDiagnosticsAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return solutionDiagnosticsAgent;
    }

    async getAgentLog(agentId) {
        // @StartCodeExample:GetSolutionDiagnosticsAgentLog
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sdc = new SolutionDiagnosticsServiceClient.SolutionDiagnosticsServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let solutionDiagnosticsAgent = await sdc.solutionDiagnosticsAgentLogGetAsync(accessToken, agentId);
        // @EndCodeExample
        return solutionDiagnosticsAgent;
    }

}

const solutionDiagnosticsService = new SolutionDiagnosticsService();

export default solutionDiagnosticsService;
