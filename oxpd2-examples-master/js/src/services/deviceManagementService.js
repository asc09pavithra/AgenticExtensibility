import { BoundDevice } from "../models/boundDevice.js";
//import DiscoveryServiceClient from 'oxpd2'
import oxpd2 from 'oxpd2';
const Oauth2Client = oxpd2.Oauth2Client;
import errors from './errors.js';
import { TokenStatus } from "../models/tokenStatus.js";

class DeviceManagementService {
    #currentDevice

    constructor (props) {
        // TODO?
    }

    get currentDevice() { return this.#currentDevice; }

    async bindDevice(networkAddress) {
        this.#currentDevice = new BoundDevice();
        this.#currentDevice.networkAddress = networkAddress;
        this.#currentDevice.bindStatus = "bound";
        await this.getServicesDiscovery().catch(error => 
            { 
                this.#currentDevice = null;
                throw new Error(errors.DISCOVERY_SERVICE, { cause: error })
            });
 
        return this.#currentDevice;
    }

    async unbindDevice() {
        this.#currentDevice = null;
        return this.#currentDevice;
    }

    async getServicesDiscovery()
    {
        // @StartCodeExample:GetServicesDiscovery
        if (this.#currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        
        let dsc = new oxpd2.DiscoveryServiceClient(this.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        // @EndCodeExample
        return dt;
    }

    async passwordGrant(username, password) {
        // @StartCodeExample:PasswordGrant
        if (this.#currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let dsc = new oxpd2.DiscoveryServiceClient(this.#currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let oauth2Client = new Oauth2Client.Oauth2ServiceClient(this.#currentDevice.networkAddress, dt, fetch);
        let grantRequest = new Oauth2Client.PasswordGrantRequest();
        grantRequest.username = username;
        grantRequest.password = password;
        let token = await oauth2Client.passwordGrantAsync(grantRequest);

        this.#currentDevice.adminAccessTokenStatus = TokenStatus.Granted;
        this.#currentDevice.adminAccessToken = token;
        // @EndCodeExample
        return token;
    }

    async authorizationCodeGrant(code) {
        // @StartCodeExample:AuthorizationCodeGrant
        if (this.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let dsc = new oxpd2.DiscoveryServiceClient(this.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let oauth2Client = new Oauth2Client.Oauth2ServiceClient(this.currentDevice.networkAddress, dt, fetch);
        let grantRequest = new Oauth2Client.AuthorizationCodeGrantRequest();
        grantRequest.code = code;
        let token = await oauth2Client.authorizationCodeGrantAsync(grantRequest);

        const d = new Date();
        let currentTime = d.getTime();

        this.currentDevice.solutionAccessTokenTimeGranted = currentTime;
        this.currentDevice.solutionAccessTokenStatus = TokenStatus.Granted;
        this.currentDevice.solutionAccessToken = token;
        // @EndCodeExample
        return token;
    }

    async refreshGrant(refreshToken) {
        // @StartCodeExample:RefreshGrant
        if (this.#currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let dsc = new oxpd2.DiscoveryServiceClient(this.#currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let oauth2Client = new Oauth2Client.Oauth2ServiceClient(this.#currentDevice.networkAddress, dt, fetch);
        let grantRequest = new Oauth2Client.RefreshTokenGrantRequest();
        grantRequest.refreshToken = refreshToken;
        let token = await oauth2Client.refreshTokenGrantAsync(grantRequest);

        const d = new Date();
        let currentTime = d.getTime();

        this.#currentDevice.solutionAccessTokenTimeGranted = currentTime;
        this.#currentDevice.solutionAccessTokenStatus = TokenStatus.Granted;
        this.#currentDevice.solutionAccessToken = token;
        // @EndCodeExample
        return token;
    }

    setUiContextAccessToken(uiContextToken) {
        if (this.#currentDevice != null) {
            this.#currentDevice.uiContextAccessToken = uiContextToken;
            this.#currentDevice.uiContextAccessTokenStatus = (uiContextToken != null) ? TokenStatus.Granted : TokenStatus.None;
        }
    }

    setAuthContextAccessToken(authContextToken) {
        if (this.#currentDevice != null) {
            this.#currentDevice.authenticationContextAccessToken = authContextToken;
            this.#currentDevice.authenticationContextAccessTokenStatus = (authContextToken != null) ? TokenStatus.Granted : TokenStatus.None;
        }
    }

    getTokens() {
        if (this.#currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        return this.#currentDevice.getTokens();
    }

    async getDeviceInformation() {
        if (this.#currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let testUrl = "https://" + this.#currentDevice.networkAddress + "/cdm/system/v1/identity";
        let baseServiceClient = new oxpd2.Client.BaseServiceClient(null, null, null, null, fetch);
        let coreOptions = {
            method: 'GET'
        }
        return await baseServiceClient.sendRequestAsync(testUrl, coreOptions, Object);
    }
}

const deviceManagementService = new DeviceManagementService()

export default deviceManagementService;
