import { AccessTokenType } from "../models/accessTokenType.js";
import deviceManagementService from "./deviceManagementService.js";
import errors from './errors.js';
import oxpd2 from 'oxpd2';

const ScanJobServiceClient = oxpd2.ScanJobServiceClient;
class ScanJobService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let sjc = new ScanJobServiceClient.ScanJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await sjc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumerateScanJobAgents() {
        // @StartCodeExample:EnumerateScanJobAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sjc = new ScanJobServiceClient.ScanJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let scanJobAgents = await sjc.scanJobAgentsGetAsync(accessToken);
        // @EndCodeExample
        return scanJobAgents;
    }

    async getScanJobAgent(agentId) {
        // @StartCodeExample:GetScanJobAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sjc = new ScanJobServiceClient.ScanJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let scanJobAgent = await sjc.scanJobAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return scanJobAgent;
    }

    async getDefaultOptions() {
        // @StartCodeExample:GetDefaultOptions
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sjc = new ScanJobServiceClient.ScanJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Solution]);
        let defaultOptions = await sjc.defaultOptionsGetAsync(accessToken);
        // @EndCodeExample
        return defaultOptions;
    }

    async getProfile() {
        // @StartCodeExample:GetProfile
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();
        
        let sjc = new ScanJobServiceClient.ScanJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Solution]);
        let profile = await sjc.profileGetAsync(accessToken);
        // @EndCodeExample
        return profile;
    }

    async enumerateScanJobs(agentId) {
        // @StartCodeExample:EnumerateScanJobs
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let sjc = new ScanJobServiceClient.ScanJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let scanJobs = await sjc.scanJobsGetAsync(accessToken, agentId);
        // @EndCodeExample
        return scanJobs;
    }

    async createScanJob(scanJobCreate, agentId) {
        // @StartCodeExample:CreateScanJob
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let sjc = new ScanJobServiceClient.ScanJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.UI_Context]);
        let scanJob = await sjc.scanJobCreateAsync(accessToken, agentId, scanJobCreate);
        // @EndCodeExample
        return scanJob;
    }

    async getScanJob(agentId, scanJobId) {
        // @StartCodeExample:GetScanJob
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let sjc = new ScanJobServiceClient.ScanJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let scanJob = await sjc.scanJobGetAsync(accessToken, agentId, scanJobId);
        // @EndCodeExample
        return scanJob;
    }

    async cancelScanJob(agentId, scanJobId) {
        // @StartCodeExample:CancelScanJob
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let sjc = new ScanJobServiceClient.ScanJobServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let scanJobCancel = await sjc.scanJobCancelAsync(accessToken, agentId, scanJobId);
        // @EndCodeExample
        return scanJobCancel;
    }

    async verifyScanTicket(scanOptions) {
        // @StartCodeExample:VerifyScanTicket
        // Start by getting the profile http and base options
        let profile = await this.getProfile();
        let baseOptionProfile = profile.base;
        let httpOptionProfile = profile.http;

        // Create the scan ticket helper
        let target = new oxpd2.ScanJobService.ScanTicketHelper(baseOptionProfile, httpOptionProfile);
        // Set incoming scan options
        target.httpScanOptions = scanOptions;

        // Check for conflicts
        let conflicts = target.httpScanOptionsProfileHelper.getConflicts();

        return conflicts;
        // @EndCodeExample
    }

    async verifyScanTicketExamples(scanOptions) {
        // @StartCodeExample:VerifyScanTicketExamples
        // Start by getting the profile http and base options
        let profile = await this.getProfile();
        let baseOptionProfile = profile.base;
        let httpOptionProfile = profile.http;

        // Create the scan ticket helper
        let target = new oxpd2.ScanJobService.ScanTicketHelper(baseOptionProfile, httpOptionProfile);

        // Set incoming scan options
        target.httpScanOptions = scanOptions;

        //
        // Let's assume we have a very simple group of settings in our app:
        //  * OutputFileFormat
        //  * ColorMode
        //  * FileName
        // The first thing we ought to do is make sure these three ScanOptions are available (supported) on this device.
        // We can do this by making sure the option (names) are either IN the AvailableOptions, or NOT IN the UnavailableOptions.
        // Let's check the latter...
        //
        // Check which options are unavailable
        let unavailableOptions = target.httpScanOptionsProfileHelper.getUnavailableOptions();

        if(unavailableOptions.includes("ColorMode") || unavailableOptions.includes("OutputFileFormat") || unavailableOptions.includes("FileName")) {
            throw new Error("One or more of the needed options is unavailable");
        }

        //
        // Ok. Everything we want is supported. Now, we know the first two are enumerations, so lets see what the possible-values
        // are so that we can populate our combo boxes. The OptionProfile has that information, so use the helper to extract it.
        // There are two variants - one method returns a simple list of strings, the other will return the list of the explict type
        // we want. We'll use the latter in this demo!
        //

        target.httpScanOptions.outputFileFormat = oxpd2.ImagingTypes.FileFormat.ffJpeg;
        target.httpScanOptionsProfileHelper.evaluate();

        let availableFileTypes = target.httpScanOptionsProfileHelper.getCurrentAvailableValues("OutputFileFormat");
        let availableColorModes = target.httpScanOptionsProfileHelper.getCurrentAvailableValues("ColorMode");

        if(availableFileTypes.length != 5 || !availableFileTypes.includes("ffJpeg") || !availableFileTypes.includes("ffPdf") ||
            !availableFileTypes.includes("ffTiff") || !availableFileTypes.includes("ffMtiff") || !availableFileTypes.includes("ffPdfa")) {
            throw new Error("The expected files types are not available");
        }

        if(availableColorModes.length != 2 || !availableColorModes.includes("cmColor") || !availableColorModes.includes("cmGrayscale")) {
            throw new Error("The expected color modes are not available");
        }

        //
        // So the above has shown that the current available values of ColorMode is Color and Grayscale, based on the
        // current state of the options instance.
        //

        // Now let's see these notifications in action. Let's change the OutputFileFormat to PDF and evaluate the result.
        // (We know that this will trigger some notifications)
        target.httpScanOptions.outputFileFormat = oxpd2.ImagingTypes.FileFormat.ffPdf;
        target.httpScanOptionsProfileHelper.evaluate();

        let availableValuesNotifications = target.httpScanOptionsProfileHelper.currentOptionRuleNotifications
            .filter(o => o.notificationType === oxpd2.OptionProfileTypes.OptionRuleNotificationType.OptionAvailableValues);

        availableColorModes = availableValuesNotifications[0].optionAvailableValues;

        if(availableColorModes.length != 3 || !availableColorModes.includes("cmMonochrome") || !availableColorModes.includes("cmColor")
            || !availableColorModes.includes("cmGrayscale")) {
            throw new Error("The expected color modes are not available");
        }

        //
        // The above has shown that now with OutoutFileFormat of PDF, our available ColorModes is now all 3 modes, rather
        // than the restricted set that was available when OutputFileFormat was JPEG.
        //

        // Let's verify we are still valid
        if(!target.httpScanOptionsProfileHelper.isValid(true)) {
            throw new Error("The scan ticket should be valid at this point");
        }

        //
        // Let's change the color mode to Monochrome, now that it's available.
        //
        target.httpScanOptions.colorMode = oxpd2.ImagingTypes.ColorMode.cmMonochrome;
        if(!target.httpScanOptionsProfileHelper.isValid(true)) {
            throw new Error("The scan ticket should still be valid at this point");
        }

        //
        // Now change the OutputFileFormat back to JPEG...
        // (which we know in this demo will trigger a conflict and make the options no longer valid!)
        //
        target.httpScanOptions.outputFileFormat = oxpd2.ImagingTypes.FileFormat.ffJpeg;
        if(target.httpScanOptionsProfileHelper.isValid(true)) {
            throw new Error("The scan ticket should now be invalid");
        }

        //
        // Why are we invalid? It's all explained by the Helper
        //
        let conflicts = target.httpScanOptionsProfileHelper.currentOptionRuleNotifications
                .filter(o => o.notificationType === oxpd2.OptionProfileTypes.OptionRuleNotificationType.OptionConflict);

        
        if(conflicts.length != 1 || !conflicts[0].enforcedRule.validValues.message === 
            "JPEG file format does not support Monochrome color mode.") {
            throw new Error("The first conflict message should be that JPEG file format does not support Monochrome color mode");
        }
        
        //
        // Ok, then, let's change OutputFileFormat back to PDF
        //
        target.httpScanOptions.outputFileFormat = oxpd2.ImagingTypes.FileFormat.ffPdf;
        if(!target.httpScanOptionsProfileHelper.isValid(true)) {
            throw new Error("The scan ticket should now be valid again");
        }

        //
        // Finally, let's try some different FileName settings... FileName is a complex option, as it is Bindable.
        // First let's try to set it to an explict empty-string.
        scanOptions.fileName.explicit = new oxpd2.ScanJobService.ScanOptions_FileName_Value();
        if(target.httpScanOptionsProfileHelper.isValid(true)) {
            throw new Error("The scan ticket should be invalid with an empty string");
        }

        conflicts = target.httpScanOptionsProfileHelper.currentOptionRuleNotifications
                .filter(o => o.notificationType === oxpd2.OptionProfileTypes.OptionRuleNotificationType.OptionConflict);

        let conflict = conflicts
                .find(o => o.optionName === "fileName.explicit.explicitValue");

        if(conflicts.length != 1 || !conflict.enforcedRule.regularExpression.message === 
            "Explicit Filename must not be empty or include invalid characters.") {
            throw new Error("The conflict should mean that Filename is invalid");
        }

        //
        // Since that name is invalid, let's try an empty Expression instead
        //
        scanOptions.fileName.expression = new oxpd2.ScanJobService.ScanOptions_FileName_Expression();
        if(target.httpScanOptionsProfileHelper.isValid(true)) {
            throw new Error("Again, the scan ticket should invalid with empty string");
        }

        conflicts = target.httpScanOptionsProfileHelper.currentOptionRuleNotifications
                .filter(o => o.notificationType === oxpd2.OptionProfileTypes.OptionRuleNotificationType.OptionConflict);

        conflict = conflicts
                .find(o => o.optionName === "fileName.expression.expressionPattern");

        if(conflicts.length != 1 || !conflict.enforcedRule.stringLength.message === 
            "Filename expression must not be empty.") {
            throw new Error("The conflict should mean that Filename is invalid");
        }

        //
        // Ok, let's change the FileName back to an explicit-value with something in it!
        //
        let filename = new oxpd2.ScanJobService.ScanOptions_FileName_Value();
        filename.explicitValue = "MyScanFile";
        scanOptions.fileName.explicit = filename;
        if(!target.httpScanOptionsProfileHelper.isValid(true)) {
            throw new Error("scanOptions has a fileName so the ticket should be valid");
        }
        
        //
        // Finally, let's create a ticket with these options and validate the ticket
        //
        let ticket = new oxpd2.ScanJobService.ScanTicket();
        ticket.scanOptions = scanOptions;
        
        let httpOptions = new oxpd2.ScanJobService.HttpOptions();
        let destination = new oxpd2.ScanJobService.HttpDestination();
        destination.scheme = "http";
        destination.host = new oxpd2.TargetTypes.HttpStyleHostCommon_Host_Binding();
        destination.host.explicit = new oxpd2.TargetTypes.HttpStyleHostCommon_Host_Value()
        destination.host.explicit.explicitValue = new oxpd2.TargetTypes.HostName("localhost");
        destination.path = new oxpd2.TargetTypes.HttpStyleClientCommon_Path_Binding();
        destination.path.explicit = new oxpd2.TargetTypes.HttpStyleClientCommon_Path_Value();
        destination.path.explicit.explicitValue = new oxpd2.TargetTypes.HttpPath("/myScanDestinationPath");
        httpOptions.destination = destination;

        let destinationOptions = new oxpd2.ScanJobService.DestinationOptions();
        destinationOptions.http = httpOptions
        ticket.destinationOptions = destinationOptions;

        if(!target.isTicketValid(ticket)) {
            throw new Error("This scan ticket should be valid and ready to use!");
        }
        // @EndCodeExample
    }
}

const scanJobService = new ScanJobService();

export default scanJobService;
