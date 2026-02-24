import deviceManagementService from "./deviceManagementService.js";
import oxpd2 from 'oxpd2';

const AuthenticationServiceClient = oxpd2.AuthenticationServiceClient;
import errors from './errors.js';
import { AccessTokenType } from "../models/accessTokenType.js";

class AuthenticationService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new AuthenticationServiceClient.AuthenticationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await ac.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumerateAuthenticationAccessPoints(queryParams) {
        // @StartCodeExample:EnumerateAuthenticationAccessPoints
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new AuthenticationServiceClient.AuthenticationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);

        let authenticationAccessPoints = await ac.authenticationAccessPointsGetAsync(accessToken, queryParams);
        // @EndCodeExample
        return authenticationAccessPoints;
    }

    async getAuthenticationAccessPoint(accessPointId) {
        // @StartCodeExample:GetAuthenticationAccessPoint
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new AuthenticationServiceClient.AuthenticationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let authenticationAccessPoint = await ac.authenticationAccessPointGetAsync(accessToken, accessPointId);
        // @EndCodeExample
        return authenticationAccessPoint;
    }

    async authenticationAccessPointInitiateLogin(accessPointId) {
        // @StartCodeExample:AuthenticationAccessPointInitiateLogin
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new AuthenticationServiceClient.AuthenticationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessPointLogin = await ac.authenticationAccessPointInitiateLoginAsync(accessToken, accessPointId);
        // @EndCodeExample
        return accessPointLogin;
    }

    async enumerateAuthenticationAgents() {
        // @StartCodeExample:EnumerateAuthenticationAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new AuthenticationServiceClient.AuthenticationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);

        let authenticationAgents = await ac.authenticationAgentsGetAsync(accessToken);
        // @EndCodeExample
        return authenticationAgents;
    }

    async getAuthenticationAgent(agentId) {
        // @StartCodeExample:GetAuthenticationAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new AuthenticationServiceClient.AuthenticationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let authenticationAgent = await ac.authenticationAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return authenticationAgent;
    }

    async authenticationAgentLogin(prePrompResult, agentId) {
        // @StartCodeExample:AuthenticationAgentLogin
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new AuthenticationServiceClient.AuthenticationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let authenticationAgent_Login = await ac.authenticationAgentLoginAsync(accessToken, agentId, prePrompResult);

        if(authenticationAgent_Login.sessionAccessToken) {
            let authContextToken = new oxpd2.Oauth2Client.Token();
            authContextToken.accessToken = authenticationAgent_Login.sessionAccessToken;
            authContextToken.tokenType = "Bearer";
    
            deviceManagementService.setAuthContextAccessToken(authContextToken);
        }
        
        // @EndCodeExample
        return authenticationAgent_Login;
    }

    async sessionForceLogout() {
        // @StartCodeExample:SessionForceLogout
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Authentication_Context
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let ac = new AuthenticationServiceClient.AuthenticationServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let session = await ac.authenticationSessionForceLogoutAsync(accessToken);
        // @EndCodeExample
        return session;
    }
}

const authenticationService = new AuthenticationService();

export default authenticationService;
