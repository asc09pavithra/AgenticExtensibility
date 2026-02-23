/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import { AccessTokenType } from "../models/accessTokenType.js";
import deviceManagementService from "./deviceManagementService.js";
import errors from './errors.js';
import oxpd2 from 'oxpd2';

const UsbAccessoriesServiceClient = oxpd2.UsbAccessoriesServiceClient;

class UsbAccessoriesService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await usbc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumerateAccessoriesAgents() {
        // @StartCodeExample:EnumerateAccessoriesAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let usbAccessoriesAgents = await usbc.usbAccessoriesAgentsGetAsync(accessToken);
        // @EndCodeExample
        return usbAccessoriesAgents;
    }

    async getAccessoriesAgent(agentId) {
        // @StartCodeExample:GetAccessoriesAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let usbAccessoriesAgent = await usbc.usbAccessoriesAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return usbAccessoriesAgent;
    }

    async enumerateAccessories() {
        // @StartCodeExample:EnumerateAccessories
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let usbAccessories = await usbc.usbAccessoriesGetAsync(accessToken);
        // @EndCodeExample
        return usbAccessories;
    }

    async getAccessory(accessoryId) {
        // @StartCodeExample:GetAccessory
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let usbAccessory = await usbc.usbAccessoryGetAsync(accessToken, accessoryId);
        // @EndCodeExample
        return usbAccessory;
    }

    async getUsbAccessoryHid(accessoryId) {
        // @StartCodeExample:GetUsbAccessoryHid
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Solution]);
        let hid = await usbc.usbAccessoryHidGetAsync(accessToken, accessoryId);
        // @EndCodeExample
        return hid;
    }

    async openOwnedAccessoryHid(accessoryId, hidOpenParams) {
        // @StartCodeExample:OpenOwnedAccessoryHid
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Solution]);
        let hid_open = await usbc.usbAccessoryHidOpenAsync(accessToken, accessoryId, hidOpenParams);
        // @EndCodeExample
        return hid_open;
    }

    async openSharedAccessoryHid(accessoryId, hidOpenParams) {
        // @StartCodeExample:OpenSharedAccessoryHid
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.UI_Context]);
        let hid_open = await usbc.usbAccessoryHidOpenAsync(accessToken, accessoryId, hidOpenParams);
        // @EndCodeExample
        return hid_open;
    }

    async getOpenHIDAccessory(accessoryId, hidAccessoryId, isOwned) {
        // @StartCodeExample:GetOpenHIDAccessory
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([isOwned ? AccessTokenType.Solution : AccessTokenType.UI_Context]);
        let openHIDAccessory = await usbc.usbAccessoryOpenHidAccessoryGetAsync(accessToken, accessoryId, hidAccessoryId);
        // @EndCodeExample
        return openHIDAccessory;
    }

    async deleteOpenHIDAccessory(accessoryId, hidAccessoryId, isOwned) {
        // @StartCodeExample:DeleteOpenHIDAccessory
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([isOwned ? AccessTokenType.Solution : AccessTokenType.UI_Context]);
        await usbc.usbAccessoryOpenHidAccessoryDeleteAsync(accessToken, accessoryId, hidAccessoryId);
        // @EndCodeExample
    }

    async modifyOpenHIDAccessory(accessoryId, hidAccessoryId, modificationRequest, isOwned) {
        // @StartCodeExample:ModifyOpenHIDAccessory
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([isOwned ? AccessTokenType.Solution : AccessTokenType.UI_Context]);
        let openHIDAccessory = await usbc.usbAccessoryOpenHidAccessoryModifyAsync(accessToken, accessoryId, hidAccessoryId, modificationRequest);
        // @EndCodeExample
        return openHIDAccessory;
    }

    async readReportOpenHIDAccessory(accessoryId, hidAccessoryId, readReportParams, isOwned) {
        // @StartCodeExample:ReadReportOpenHIDAccessory
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([isOwned ? AccessTokenType.Solution : AccessTokenType.UI_Context]);
        let readReport = await usbc.usbAccessoryOpenHidAccessoryReadReportAsync(accessToken, accessoryId, hidAccessoryId, readReportParams);
        // @EndCodeExample
        return readReport;
    }

    async writeReportOpenHIDAccessory(accessoryId, hidAccessoryId, writeReportParams, isOwned) {
        // @StartCodeExample:WriteReportOpenHIDAccessory
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let usbc = new UsbAccessoriesServiceClient.UsbAccessoriesServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([isOwned ? AccessTokenType.Solution : AccessTokenType.UI_Context]);
        let writeReport = await usbc.usbAccessoryOpenHidAccessoryWriteReportAsync(accessToken, accessoryId, hidAccessoryId, writeReportParams);
        // @EndCodeExample
        return writeReport;
    }
}

const usbAccessoriesService = new UsbAccessoriesService();

export default usbAccessoriesService;
