import deviceManagementService from "./deviceManagementService.js";
import oxpd2 from 'oxpd2';

const SecurityServiceClient = oxpd2.SecurityServiceClient;
import errors from './errors.js';
import { AccessTokenType } from "../models/accessTokenType.js";

class SecurityService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let sc = new SecurityServiceClient.SecurityServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await sc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumerateSecurityAgents() {
        // @StartCodeExample:EnumerateSecurityAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sc = new SecurityServiceClient.SecurityServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let securityAgents = await sc.securityAgentsGetAsync(accessToken);
        // @EndCodeExample
        return securityAgents;
    }

    async getSecurityAgent(agentId) {
        // @StartCodeExample:GetSecurityAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sc = new SecurityServiceClient.SecurityServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let securityAgent = await sc.securityAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return securityAgent;
    }

    async resolveSecurityExpression(agentId, resolveSecurityExpressionRequest) {
        // @StartCodeExample:ResolveSecurityExpression
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sc = new SecurityServiceClient.SecurityServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let resolvedExpression = await sc.resolveSecurityExpressionAsync(accessToken, agentId, resolveSecurityExpressionRequest);
        // @EndCodeExample
        return resolvedExpression;
    }
}

const securityService = new SecurityService();

export default securityService;
