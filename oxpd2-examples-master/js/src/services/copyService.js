import { AccessTokenType } from "../models/accessTokenType.js";
import deviceManagementService from "./deviceManagementService.js";
import errors from './errors.js';
import oxpd2 from 'oxpd2';
const CopyServiceClient = oxpd2.CopyServiceClient;

class CopyService {

    constructor(props) {

    }

    async getCapabilities() {
        // @StartCodeExample:GetCapabilities
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let capabilities = await cc.capabilitiesGetAsync();
        // @EndCodeExample
        return capabilities;
    }

    async enumerateCopyAgents() {
        // @StartCodeExample:EnumerateCopyAgents
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let copyAgents = await cc.copyAgentsGetAsync(accessToken);
        // @EndCodeExample
        return copyAgents;
    }

    async getCopyAgent(agentId) {
        // @StartCodeExample:GetCopyAgent
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let copyAgent = await cc.copyAgentGetAsync(accessToken, agentId);
        // @EndCodeExample
        return copyAgent;
    }

    async enumerateCopyJobs(agentId) {
        // @StartCodeExample:EnumerateCopyJobs
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let copyJobs = await cc.copyJobsGetAsync(accessToken, agentId);
        // @EndCodeExample
        return copyJobs;
    }

    async createCopyJob(copyJobCreate, agentId) {
        // @StartCodeExample:CreateCopyJob
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.UI_Context]);
        let copyJob = await cc.copyJobCreateAsync(accessToken, agentId, copyJobCreate);
        // @EndCodeExample
        return copyJob;
    }

    async getCopyJob(agentId, copyJobId) {
        // @StartCodeExample:GetCopyJob
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let copyJob = await cc.copyJobGetAsync(accessToken, agentId, copyJobId);
        // @EndCodeExample
        return copyJob;
    }

    async cancelCopyJob(agentId, copyJobId) {
        // @StartCodeExample:CancelCopyJob
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let copyJobCancel = await cc.copyJobCancelAsync(accessToken, agentId, copyJobId);
        // @EndCodeExample
        return copyJobCancel;
    }

    async getDefaultOptions() {
        // @StartCodeExample:GetDefaultOptions
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Solution]);
        let defaultOptions = await cc.defaultOptionsGetAsync(accessToken);
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

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Solution]);
        let profile = await cc.profileGetAsync(accessToken);
        // @EndCodeExample
        return profile;
    }

    async enumerateStoredJobs(agentId) {
        // @StartCodeExample:EnumerateStoredJobs
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let storedJobs = await cc.storedJobsGetAsync(accessToken, agentId);
        // @EndCodeExample
        return storedJobs;
    }

    async getStoredJob(agentId, jobId) {
        // @StartCodeExample:GetStoredJob
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let storedJob = await cc.storedJobGetAsync(accessToken, agentId, jobId);
        // @EndCodeExample
        return storedJob;
    }

    async releaseStoredJob(agentId, jobId, releaseStoredJobRequest) {
        // @StartCodeExample:ReleaseStoredJob
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let storedJobRelease = await cc.storedJobReleaseAsync(accessToken, agentId, jobId, releaseStoredJobRequest);
        // @EndCodeExample
        return storedJobRelease;
    }

    async removeStoredJob(agentId, jobId, removeStoredJobRequest) {
        // @StartCodeExample:RemoveStoredJob
        if (deviceManagementService.currentDevice == null) {
            throw new Error(errors.NO_BOUND_DEVICE);
        }
        let dsc = new oxpd2.DiscoveryServiceClient(deviceManagementService.currentDevice.networkAddress, fetch);
        let dt = await dsc.servicesDiscoveryGetAsync();

        let cc = new CopyServiceClient.CopyServiceClient(deviceManagementService.currentDevice.networkAddress, dt, fetch);
        let accessToken = await deviceManagementService.currentDevice.getToken([AccessTokenType.Admin, AccessTokenType.Solution]);
        let storedJobRemove = await cc.storedJobRemoveAsync(accessToken, agentId, jobId, removeStoredJobRequest);
        // @EndCodeExample
        return storedJobRemove;
    }

    async verifyCopyTicket(copyOptions) {
        // @StartCodeExample:VerifyCopyTicket
        // Start by getting the profile options
        let profile = await this.getProfile();
        let optionProfile = new oxpd2.OptionProfileTypes.OptionProfile();

        if (profile.base !== null && profile.base.definitions !== null) {
            optionProfile.definitions = profile.base.definitions
        }
        else {
            optionProfile.definitions = [];
        }

        // Create the copy ticket helper
        let target = new oxpd2.CopyService.CopyTicketHelper(optionProfile);
        // Set incoming copy options
        target.copyOptions = copyOptions;

        // Check for conflicts
        let conflicts = target.copyOptionsProfileHelper.getConflicts();

        return conflicts;
        // @EndCodeExample
    }

    async verifyStoredCopyTicket(copyOptions) {
        // @StartCodeExample:VerifyStoredCopyTicket
        // Start by getting the profile options
        let profile = await this.getProfile();
        let baseOptionProfile = new oxpd2.OptionProfileTypes.OptionProfile();

        if (profile.base !== null && profile.base.definitions !== null) {
            baseOptionProfile.definitions = profile.base.definitions
        }
        else {
            baseOptionProfile.definitions = [];
        }

        let storedCopyOptionProfile = new oxpd2.OptionProfileTypes.OptionProfile();

        if (profile.storedCopy !== null && profile.storedCopy.definitions !== null) {
            storedCopyOptionProfile.definitions = profile.storedCopy.definitions
        }
        else {
            storedCopyOptionProfile.definitions = [];
        }

        // Create the copy ticket helper
        let target = new oxpd2.CopyService.CopyTicketHelper(baseOptionProfile, storedCopyOptionProfile);
        // Set incoming copy options
        target.storedCopyOptions = copyOptions;

        // Check for conflicts
        let conflicts = target.storedCopyOptionsProfileHelper.getConflicts();

        return conflicts;
        // @EndCodeExample
    }

    async verifyCopyTicketExample(copyOptions) {
        // @StartCodeExample:VerifyCopyTicketExample
        //
        // Create the parts we need to utilize the the CopyTicketHelper. This includes:
        // 1) A "default" CopyOptions instance (normally would be retrieved from the ./copy/v1/defaultOptions resource.
        // 2) The OptionProfile instance for copy (normally from ./copy/v1/profile)
        // 4) The CopyTicketHelper itself
        //

        let profile = await this.getProfile();

        let optionProfile = new oxpd2.OptionProfileTypes.OptionProfile();
        optionProfile.definitions = profile.base.definitions

        let target = new oxpd2.CopyService.CopyTicketHelper(optionProfile);

        //
        // We have a CopyTicketHelper instance ready to start using!!
        //

        //
        // Let's assume we have a very simple group of settings in our app:
        //  * OriginalMediaSize
        //  * ColorMode
        //  * Copies
        // The first thing we ought to do is make sure these three CopyOptions are available (supported) on this device.
        // We can do this by making sure the option (names) are either IN the AvailableOptions, or NOT IN the UnavailableOptions.
        // Let's check the latter...
        //

        let unavailableOptions = target.copyOptionsProfileHelper.getUnavailableOptions();

        if (unavailableOptions.includes("OriginalMediaSize") || unavailableOptions.includes("ColorMode") || unavailableOptions.includes("Copies")) {
            throw new Error("One or more of the needed options is unavailable");
        }

        //
        // Ok. Everything we want is supported. Now, we know the first two are enumerations, so lets see what the possible-values
        // are so that we can populate our combo boxes. The OptionProfile has that information, so use the helper to extract it.
        // There are two variants - one method returns a simple list of strings, the other will return the list of the explict type
        // we want. We'll use the latter in this demo!
        //

        let possibleOriginalMediaSizes = target.copyOptionsProfileHelper.getPossibleValues("OriginalMediaSize");
        let possibleColorModes = target.copyOptionsProfileHelper.getPossibleValues("ColorMode");

        //
        // A real solution would programatically populate their view with the above values. For demo/test purposes,
        // we're going to assert that they contain the values that should be there (from the OptionProfile we loaded, of course)
        //

        if (possibleOriginalMediaSizes.length != 22) {
            throw new Error("The expected original media size types are not available");
        }

        if (possibleColorModes.length != 3 || !possibleColorModes.includes("cmAutoDetect") ||
            !possibleColorModes.includes("cmColor") || !possibleColorModes.includes("cmGrayscale")) {
            throw new Error("The expected color modes are not available");
        }

        //
        // Alright, we have our ComboBoxes ready. It's time to load the helper with a "live" instance we want to 
        // be using to hold our settings from the view. So we set the CopyOptions property of the helper
        // with a CopyOptions instance we created. This will be the instance, then, that is used during evaluations of the
        // CopyOptionsProfileHelper member. We'll use the "default" instance from the begining of this demo.
        //
        target.copyOptions = copyOptions;

        // Hopefully the default CopyOptions are valid! Let's check
        if (!target.copyOptionsProfileHelper.isValid(true)) {
            throw new Error("The copy options should be valid");
        }

        //
        // Great! Next, let's do a check to see if any of the three options we are supporting in our view are disabled.
        // Being disabled simply means it is not relevant based on the current state of all CopyOptions.
        //

        let disabled = target.copyOptionsProfileHelper.getDisabledOptions();

        if (disabled.includes("OriginalMediaSize") || disabled.includes("ColorMode") || disabled.includes("Copies")) {
            throw new Error("The options shouldn't be disabled");
        }

        //
        // How about checking what our current *available* values are for OriginalMediaSize and ColorMode?  Because
        // recall that available-values might be a subset of total possible-values based on the optionProfile.
        // (In this demo we know there is a difference, so we'll assert it)

        let availableOriginalMediaSizes = target.copyOptionsProfileHelper.getCurrentAvailableValues("OriginalMediaSize");
        let availableColorModes = target.copyOptionsProfileHelper.getCurrentAvailableValues("ColorMode");

        if (availableOriginalMediaSizes.length != 22) {
            throw new Error("The expected original media sizes are not available");
        }

        if (availableColorModes.length != 3 || !availableColorModes.includes("cmAutoDetect") ||
            !availableColorModes.includes("cmColor") || !availableColorModes.includes("cmGrayscale")) {
            throw new Error("The expected original color modes are not available");
        }

        //
        // So the above has shown that the current available values of ColorMode is Color and Grayscale, based on the
        // current state of the options instance.
        //

        // Sanity-check, let's make sure we are still valid
        if (!target.copyOptionsProfileHelper.isValid(true)) {
            throw new Error("The copy options should be valid");
        }

        //
        // Let's change the color mode to Monochrome.
        // (which we know in this demo will trigger a conflict and make the options no longer valid!)
        //
        copyOptions.colorMode = oxpd2.ImagingTypes.ColorMode.cmMonochrome;
        if (!target.copyOptionsProfileHelper.isValid(true)) {
            throw new Error("The copy options should be invalid");
        }

        //
        // Why are we invalid? It's all explained by the Helper :)
        //

        let conflicts = target.copyOptionsProfileHelper.currentOptionRuleNotifications
            .filter(o => o.notificationType === OptionRuleNotificationType.OptionConflict);

        if (conflicts[0].optionName !== "colorMode") {
            throw new Exception("The first conflict should be for ColorMode");
        }

        //
        // Ok, then, let's change ColorMode back to cmColor
        //

        copyOptions.colorMode = oxpd2.ImagingTypes.ColorMode.cmColor;
        if (!target.copyOptionsProfileHelper.isValid(true)) {
            throw new Error("The copy options should be valid");
        }

        //
        // Finally, let's create a ticket with these options and validate the ticket
        //
        let ticket = new CopyJobTicket();
        ticket.copyOptions = copyOptions;

        if (!target.isTicketValid(ticket)) {
            throw new Exception("The copy options should be valid");
        }

        //
        // YeeHaw! We are ready to start an E2 CopyJob with this ticket!
        //
        // The End.
        // @EndCodeExample
    }
}

const copyService = new CopyService();

export default copyService;
