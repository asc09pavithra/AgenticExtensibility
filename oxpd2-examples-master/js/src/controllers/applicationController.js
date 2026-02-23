/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import applicationService from '../services/applicationService.js';
import oxpd2 from "oxpd2"
import MultipartParser from "../utils/multipartParser.js";

const applicationController = {};

applicationController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await applicationService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

applicationController.enumerate_application_access_points = async (req, res, next) => {
    let query = new URLSearchParams(req.query);

    try {
        let applicationAccessPoints = await applicationService.enumerateApplicationAccessPoints(query);
        res.status(200).send(applicationAccessPoints);
    }
    catch (err) {
        next(err);
    }
}

applicationController.get_application_access_point = async (req, res, next) => {
    try {
        let applicationAccessPoint = await applicationService.getApplicationAccessPoint(req.params.accessPointId);
        res.status(200).send(applicationAccessPoint);
    }
    catch (err) {
        next(err);
    }
}

applicationController.application_access_point_initiate_launch = async (req, res, next) => {
    let startIntent = null;
    let initiateLaunchRequest = null;
    // First lets parse the contents. We should end up with at least 1!
    let boundary = MultipartParser.getContentBoundary(req.headers['content-type']);
    let parts = MultipartParser.parseContent(boundary, req.body);

    if (0 === parts.length) {
        initiateLaunchRequest = new oxpd2.ApplicationService.InitiateLaunchRequest(req.body);
    }
    else {
        // Add any included metadata
        parts.forEach((part) => {
            let cdHeader = part.headers.find((header) => {
                if (header.name === "content-disposition") {
                    return true;
                }
                return false;
            });
            let ctHeader = part.headers.find((header) => {
                if (header.name === "content-type") {
                    return true;
                }
                return false;
            });

            if (cdHeader.directives["name"] === "content") {
                initiateLaunchRequest = new oxpd2.ApplicationService.InitiateLaunchRequest(JSON.parse(part.data));
            }
            else if (cdHeader.directives["name"] === "startIntent") {
                startIntent = JSON.parse(part.data);
            }
        });
    }
    try {
        let applicationAccessPointInitiateLaunch = await applicationService.applicationAccessPointInitiateLaunch(req.params.accessPointId, initiateLaunchRequest, startIntent);
        res.status(200).send(applicationAccessPointInitiateLaunch);
    }
    catch (err) {
        next(err);
    }
}

applicationController.enumerate_application_agents = async (req, res, next) => {
    try {
        let applicationAgents = await applicationService.enumerateApplicationAgents();
        res.status(200).send(applicationAgents);
    }
    catch (err) {
        next(err);
    }
}

applicationController.get_application_agent = async (req, res, next) => {
    try {
        let applicationAgent = await applicationService.getApplicationAgent(req.params.agentId);
        res.status(200).send(applicationAgent);
    }
    catch (err) {
        next(err);
    }
}

applicationController.refresh_application_agent = async (req, res, next) => {
    try {
        let applicationAgents = await applicationService.refreshApplicationAgent(req.body, req.params.agentId);
        res.status(200).send(applicationAgents);
    }
    catch (err) {
        next(err);
    }
}

applicationController.get_application_runtime = async (req, res, next) => {
    try {
        let applicationRuntime = await applicationService.getApplicationRuntime();
        res.status(200).send(applicationRuntime);
    }
    catch (err) {
        next(err);
    }
}

applicationController.reset_application_runtime = async (req, res, next) => {
    try {
        let applicationRuntimeReset = await applicationService.resetApplicationRuntime(req.body);
        res.status(200).send(applicationRuntimeReset);
    }
    catch (err) {
        next(err);
    }
}

applicationController.get_current_context = async (req, res, next) => {
    try {
        let currentContext = await applicationService.getCurrentContext();
        res.status(200).send(currentContext);
    }
    catch (err) {
        next(err);
    }
}

applicationController.reset_inactivity_timer_current_context = async (req, res, next) => {
    try {
        let resetRequest = new oxpd2.ApplicationService.ResetInactivityTimerRequest(req.body);
        let currentContext_ResetInactivityTimer = await applicationService.resetInactivityTimerCurrentContext(resetRequest);
        res.status(200).send(currentContext_ResetInactivityTimer);
    }
    catch (err) {
        next(err);
    }
}

applicationController.exit_current_context = async (req, res, next) => {
    try {
        let exitRequest = new oxpd2.ApplicationService.ExitRequest(req.body);
        let currentContext_Exit = await applicationService.exitCurrentContext(exitRequest);
        res.status(200).send(currentContext_Exit);
    }
    catch (err) {
        next(err);
    }
}

applicationController.exec_current_context = async (req, res, next) => {
    let startIntent = null;
    let execRequest = null;
    // First lets parse the contents. We should end up with at least 1!
    let boundary = MultipartParser.getContentBoundary(req.headers['content-type']);
    let parts = MultipartParser.parseContent(boundary, req.body);

    if (0 === parts.length) {
        execRequest = new oxpd2.ApplicationService.ExecRequest(req.body);
    }
    else {
        // Add any included metadata
        parts.forEach((part) => {
            let cdHeader = part.headers.find((header) => {
                if (header.name === "content-disposition") {
                    return true;
                }
                return false;
            });
            let ctHeader = part.headers.find((header) => {
                if (header.name === "content-type") {
                    return true;
                }
                return false;
            });

            if (cdHeader.directives["name"] === "content") {
                execRequest = new oxpd2.ApplicationService.ExecRequest(JSON.parse(part.data));
            }
            else if (cdHeader.directives["name"] === "startIntent") {
                let intent = JSON.parse(part.data);
                startIntent = new oxpd2.ApplicationService.StartIntent({"intent": intent});
            }
        });
    }
    try {
        let currentContext_Exec = await applicationService.execCurrentContext(execRequest, startIntent);
        res.status(200).send(currentContext_Exec);
    }
    catch (err) {
        next(err);
    }
}

applicationController.get_start_intent = async (req, res, next) => {
    try {
        let startIntent = await applicationService.getStartIntent();
        res.status(200).send(startIntent);
    }
    catch (err) {
        next(err);
    }
}

applicationController.enumerate_i18n_assets = async (req, res, next) => {
    try {
        let i18nAssets = await applicationService.enumerateI18nAssets();
        res.status(200).send(i18nAssets);
    }
    catch (err) {
        next(err);
    }
}

applicationController.get_i18n_asset = async (req, res, next) => {
    try {
        let i18nAsset = await applicationService.getI18nAsset(req.params.assetId);
        res.status(200).send(i18nAsset);
    }
    catch (err) {
        next(err);
    }
}

applicationController.get_runtime_chrome = async (req, res, next) => {
    try {
        let runtimeChrome = await applicationService.getRuntimeChrome();
        res.status(200).send(runtimeChrome);
    }
    catch (err) {
        next(err);
    }
}

applicationController.replace_runtime_chrome = async (req, res, next) => {
    try {
        let runtimeChrome = await applicationService.replaceRuntimeChrome(req.body);
        res.status(200).send(runtimeChrome);
    }
    catch (err) {
        next(err);
    }
}

applicationController.modify_runtime_chrome = async (req, res, next) => {
    try {
        let runtimeChrome = await applicationService.modifyRuntimeChrome(req.body);
        res.status(200).send(runtimeChrome);
    }
    catch (err) {
        next(err);
    }
}

applicationController.enumerate_message_center_agents = async (req, res, next) => {
    try {
        let messageCenterAgents = await applicationService.enumerateMessageCenterAgents();
        res.status(200).send(messageCenterAgents);
    }
    catch (err) {
        next(err);
    }
}

applicationController.get_message_center_agent = async (req, res, next) => {
    try {
        let messageCenterAgent = await applicationService.getMessageCenterAgent(req.params.agentId);
        res.status(200).send(messageCenterAgent);
    }
    catch (err) {
        next(err);
    }
}

applicationController.enumerate_messages = async (req, res, next) => {
    try {
        let query = new URLSearchParams(req.query);

        let messages = await applicationService.enumerateMessages(req.params.agentId, query);
        res.status(200).send(messages);
    }
    catch (err) {
        next(err);
    }
}

applicationController.create_message = async (req, res, next) => {
    try {
        let message = await applicationService.createMessage(req.body, req.params.agentId);
        res.status(201).send(message);
    }
    catch (err) {
        next(err);
    }
}

applicationController.get_message = async (req, res, next) => {
    try {
        let message = await applicationService.getMessage(req.params.agentId, req.params.messageId);
        res.status(200).send(message);
    }
    catch (err) {
        next(err);
    }
}

applicationController.delete_message = async (req, res, next) => {
    try {
        let opMeta = await applicationService.deleteMessage(req.params.agentId, req.params.messageId);
        res.status(200).send(opMeta);
    }
    catch (err) {
        next(err);
    }
}

applicationController.get_homescreen = async (req, res, next) => {
    try {
        let homescreen = await applicationService.getHomescreen();
        res.status(200).send(homescreen);
    }
    catch (err) {
        next(err);
    }
}

applicationController.modify_homescreen = async (req, res, next) => {
    try {
        let homescreen = await applicationService.modifyHomescreen(req.body);
        res.status(200).send(homescreen);
    }
    catch (err) {
        next(err);
    }
}

export default applicationController;
