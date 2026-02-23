/**
 * (C) Copyright 2022 HP Development Company, L.P.
 * All rights reserved.
 */

import deviceManagementService from "./deviceManagementService.js";
import oxpd2 from 'oxpd2';
const SolutionManagerServiceClient = oxpd2.SolutionManagerServiceClient;
import { AccessTokenType } from "../models/accessTokenType.js";

import errors from './errors.js';
import { TokenStatus } from "../models/tokenStatus.js";

class SolutionMangerService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await smc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async getInstaller() {
        // @StartCodeExample:GetInstaller
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let installer = await smc.installerGetAsync(accessToken);
        // @EndCodeExample
        return installer;
    }

    async installSolution( installSolutionRequest, solutionBundle, solutionBundleFilename, context) {
        // @StartCodeExample:InstallSolution
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let installerInstallSolution = await smc.installSolutionAsync(accessToken, installSolutionRequest, solutionBundle, solutionBundleFilename, context);
        // @EndCodeExample
        return installerInstallSolution;
    }

    async installRemote( installRemoteRequest, remoteArchive ) {
        // @StartCodeExample:InstallRemote
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let installerInstallRemote = await smc.installRemoteAsync(accessToken, installRemoteRequest, remoteArchive);
        // @EndCodeExample
        return installerInstallRemote;
    }
    
    async uninstallSolution( uninstallSolutionRequest ) {
        // @StartCodeExample:UninstallSolution
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let installerUninstallSolution = await smc.uninstallSolutionAsync(accessToken, uninstallSolutionRequest);

        deviceManagementService.currentDevice.solutionAccessTokenStatus = TokenStatus.None;
        deviceManagementService.currentDevice.solutionAccessToken = null;
        // @EndCodeExample
        return installerUninstallSolution;
    }

    async enumerateInstallerOperations( includeMembers, contentFilter ) {
        // @StartCodeExample:EnumerateInstallerOperations
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);

        let queryParams = null;

        if(includeMembers != null ) {
            queryParams = "includeMembers=" + includeMembers.toString().toLowerCase();
            if(contentFilter != null ) {
                queryParams = queryParams + "&contentFilter=" + contentFilter;
            }
        }
        
        let installerInstall = await smc.installerOperationsGetAsync(accessToken, queryParams);
        // @EndCodeExample
        return installerInstall;
    }

    async getInstallerOperation( operationId ) {
        // @StartCodeExample:GetInstallerOperation
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let installerInstall = await smc.installerOperationGetAsync(accessToken, operationId);
        // @EndCodeExample
        return installerInstall;
    }


    async enumerateSolutions(includeMembers, contentFilter) {
        // @StartCodeExample:EnumerateSolutions
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);

        let queryParams = null;

        if (includeMembers != null) {
            queryParams = "includeMembers=" + includeMembers.toString().toLowerCase();
            if (contentFilter != null) {
                queryParams = queryParams + "&contentFilter=" + contentFilter;
            }
        }

        let solutions = await smc.solutionsGetAsync(accessToken, queryParams);
        // @EndCodeExample
        return solutions;

    }

    async getSolution( solutionId ) {
        // @StartCodeExample:GetSolution
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let solution = await smc.solutionGetAsync(accessToken, solutionId);
        // @EndCodeExample
        return solution;
    }
    
    async reissueInstallCode( solutionId ) {
        // @StartCodeExample:ReissueInstallCode
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let solutionReissueInstallCode = await smc.solutionReissueInstallCodeAsync(accessToken, solutionId);
        // @EndCodeExample
        return solutionReissueInstallCode;
    }

    async getSolutionContext( solutionId ) {
        // @StartCodeExample:GetSolutionContext
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let solution = await smc.solutionContextGetAsync(accessToken, solutionId);
        // @EndCodeExample
        return solution;
    }

    async modifySolutionContext( solutionId, contextModify ) {
        // @StartCodeExample:ModifySolutionContext
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let solution = await smc.solutionContextModifyAsync(accessToken, solutionId, contextModify);
        // @EndCodeExample
        return solution;
    }

    async replaceSolutionContext( solutionId, contextReplace ) {
        // @StartCodeExample:ReplaceSolutionContext
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let solution = await smc.solutionContextReplaceAsync(accessToken, solutionId, contextReplace);
        // @EndCodeExample
        return solution;
    }

    async enumerateCertificateAuthorities( solutionId, queryParams ) {
        // @StartCodeExample:EnumerateCertificateAuthorities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let certificateAuthorities = await smc.solutionCertificateAuthoritiesGetAsync(accessToken, solutionId, queryParams);
        // @EndCodeExample
        return certificateAuthorities;
    }

    async exportCertificateAuthorities( solutionId ) {
        // @StartCodeExample:ExportCertificateAuthorities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let response = await smc.solutionCertificateAuthoritiesExportAsync(accessToken, solutionId);
        // @EndCodeExample
        return response;
    }

    async getCertificateAuthority( solutionId, certificateId ) {
        // @StartCodeExample:GetCertificateAuthority
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let certificateAuthority = await smc.solutionCertificateAuthorityGetAsync(accessToken, solutionId, certificateId);
        // @EndCodeExample
        return certificateAuthority;
    }

    async exportCertificateAuthority( solutionId, certificateId ) {
        // @StartCodeExample:ExportCertificateAuthority
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let response = await smc.solutionCertificateAuthorityExportAsync(accessToken, solutionId, certificateId);
        // @EndCodeExample
        return response;
    }

    async deleteCertificateAuthority( solutionId, certificateId ) {
        // @StartCodeExample:DeleteCertificateAuthority
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let response = await smc.solutionCertificateAuthorityDeleteAsync(accessToken, solutionId, certificateId);
        // @EndCodeExample
        return response;
    }

    async importCertificateAuthority( solutionId, importRequest, certificate, certificateFilename) {
        // @StartCodeExample:ImportCertificateAuthority
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let certificateAuthority = await smc.solutionCertificateAuthoritiesImportAsync(accessToken, solutionId, importRequest, certificate, certificateFilename);
        // @EndCodeExample
        return certificateAuthority;
    }

    async getConfiguration( solutionId ) {
        // @StartCodeExample:GetConfiguration
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let configuration = await smc.configurationGetAsync(accessToken, solutionId);
        // @EndCodeExample
        return configuration;
    }

    async modifyConfiguration( solutionId, configurationModify ) {
        // @StartCodeExample:ModifyConfiguration
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let configuration = await smc.configurationModifyAsync(accessToken, solutionId, configurationModify);
        // @EndCodeExample
        return configuration;
    }

    async getConfigurationData( solutionId ) {
        // @StartCodeExample:GetConfigurationData
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let configuration = await smc.configurationDataGetAsync(accessToken, solutionId);
        // @EndCodeExample
        return configuration;
    }

    async replaceConfigurationData( solutionId, data, mimeType ) {
        // @StartCodeExample:ReplaceConfigurationData
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let responseData = await smc.configurationDataReplaceAsync(accessToken, solutionId, data, mimeType);
        // @EndCodeExample
        return responseData;
    }

    async enumerateRuntimeRegistrations( solutionId, queryParams ) {
        // @StartCodeExample:EnumerateRuntimeRegistrations
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let runtimeRegistrations = await smc.solutionRuntimeRegistrationsGetAsync(accessToken, solutionId, queryParams);
        // @EndCodeExample
        return runtimeRegistrations;
    }

    async createRuntimeRegistration( solutionId, runtimeCreate, queryParams ) {
        // @StartCodeExample:CreateRuntimeRegistration
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let runtimeRegistration = await smc.solutionRuntimeRegistrationCreateAsync(accessToken, solutionId, runtimeCreate, queryParams);
        // @EndCodeExample
        return runtimeRegistration;
    }

    async getRuntimeRegistration( solutionId, resourceId, queryParams ) {
        // @StartCodeExample:GetRuntimeRegistration
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin,
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let runtimeRegistrations = await smc.solutionRuntimeRegistrationGetAsync(accessToken, solutionId, resourceId, queryParams);
        // @EndCodeExample
        return runtimeRegistrations;
    }

    async deleteRuntimeRegistration( solutionId, resourceId ) {
        // @StartCodeExample:DeleteRuntimeRegistration
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }

        let accessToken = await deviceManagementService.currentDevice.getToken([
            AccessTokenType.Admin, 
            AccessTokenType.Solution
        ]);

        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        
        let smc = new SolutionManagerServiceClient.SolutionManagerServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);

        let runtimeRegistration = await smc.solutionRuntimeRegistrationDeleteAsync(accessToken, solutionId, resourceId, null);

        // @EndCodeExample
        return runtimeRegistration;
    }
}

const solutionManagerService = new SolutionMangerService();

export default solutionManagerService;
