import deviceManagementService from "./deviceManagementService.js";
import oxpd2 from 'oxpd2';

const JobStatisticsServiceClient = oxpd2.JobStatisticsServiceClient;
import errors from './errors.js';
import { AccessTokenType } from "../models/accessTokenType.js";

class JobStatisticsService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let jsc = new JobStatisticsServiceClient.JobStatisticsServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await jsc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumerateJobStatisticsAgents() {
        // @StartCodeExample:EnumerateJobStatisticsAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let jsc = new JobStatisticsServiceClient.JobStatisticsServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let jobStatisticsAgents = await jsc.jobStatisticsAgentsGetAsync(accessToken);
        // @EndCodeExample
        return jobStatisticsAgents;
    }

    async getJobStatisticsAgent(agentId) {
        // @StartCodeExample:GetJobStatisticsAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let jsc = new JobStatisticsServiceClient.JobStatisticsServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let jobStatisticsAgent = await jsc.jobStatisticsAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return jobStatisticsAgent;
    }

    async enumerateJobs(agentId) {
        // @StartCodeExample:EnumerateJobs
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let jsc = new JobStatisticsServiceClient.JobStatisticsServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let jobs = await jsc.jobsGetAsync(accessToken, agentId);
        // @EndCodeExample
        return jobs;
    }

    async modifyJobs(agentId, jobsModify) {
        // @StartCodeExample:ModifyJobs
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let jsc = new JobStatisticsServiceClient.JobStatisticsServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let jobs = await jsc.jobsModifyAsync(accessToken, agentId, jobsModify);
        // @EndCodeExample
        return jobs;
    }

    async getJob(agentId, sequenceNumber) {
        // @StartCodeExample:GetJob
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let jsc = new JobStatisticsServiceClient.JobStatisticsServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let job = await jsc.jobGetAsync(accessToken, agentId, sequenceNumber);
        // @EndCodeExample
        return job;
    }
}

const jobStatisticsService = new JobStatisticsService();

export default jobStatisticsService;
