import deviceManagementService from "./deviceManagementService.js";
import oxpd2 from 'oxpd2';

const DeviceServiceClient = oxpd2.DeviceServiceClient;
import errors from './errors.js';
import { AccessTokenType } from "../models/accessTokenType.js";

class DeviceService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let dc = new DeviceServiceClient.DeviceServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await dc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async getIdentity() {
        // @StartCodeExample:GetIdentity
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let dc = new DeviceServiceClient.DeviceServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let identity = await dc.identityGetAsync();
        // @EndCodeExample
        return identity;
    }

    async getStatus() {
        // @StartCodeExample:GetStatus
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let dc = new DeviceServiceClient.DeviceServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let status = await dc.statusGetAsync();
        // @EndCodeExample
        return status;
    }

    async getEmail() {
        // @StartCodeExample:GetEmail
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let dc = new DeviceServiceClient.DeviceServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let email = await dc.emailGetAsync();
        // @EndCodeExample
        return email;
    }

    async getScanner() {
        // @StartCodeExample:GetScanner
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let dc = new DeviceServiceClient.DeviceServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let scanner = await dc.scannerGetAsync();
        // @EndCodeExample
        return scanner;
    }

    async getDeploymentInformation() {
        // @StartCodeExample:GetDeploymentInformation
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let dc = new DeviceServiceClient.DeviceServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let deploymentInformation = await dc.deploymentInformationGetAsync();
        // @EndCodeExample
        return deploymentInformation;
    }
}

const deviceService = new DeviceService();

export default deviceService;
