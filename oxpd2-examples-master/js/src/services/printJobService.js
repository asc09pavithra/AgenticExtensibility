import deviceManagementService from "./deviceManagementService.js";
import oxpd2 from 'oxpd2';

const PrintJobServiceClient = oxpd2.PrintJobServiceClient;
import errors from './errors.js';
import { AccessTokenType } from "../models/accessTokenType.js";

class PrintJobService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let pjc = new PrintJobServiceClient.PrintJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await pjc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumeratePrintJobAgents() {
        // @StartCodeExample:EnumeratePrintJobAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let pjc = new PrintJobServiceClient.PrintJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let printJobAgents = await pjc.printJobAgentsGetAsync(accessToken);
        // @EndCodeExample
        return printJobAgents;
    }

    async getPrintJobAgent(agentId) {
        // @StartCodeExample:GetPrintJobAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let pjc = new PrintJobServiceClient.PrintJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let printJobAgent = await pjc.printJobAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return printJobAgent;
    }
}

const printJobService = new PrintJobService();

export default printJobService;
