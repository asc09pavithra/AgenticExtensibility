/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import usbAccessoriesService from "../services/usbAccessoriesService.js";

const usbAccessoriesController = {};

usbAccessoriesController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await usbAccessoriesService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.enumerate_accessories_agents = async (req, res, next) => {
    try {
        let accessoriesAgents = await usbAccessoriesService.enumerateAccessoriesAgents();
        res.status(200).send(accessoriesAgents);
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.get_accessories_agent = async (req, res, next) => {
    try {
        let accessoriesAgent = await usbAccessoriesService.getAccessoriesAgent(req.params.agentId);
        res.status(200).send(accessoriesAgent);
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.enumerate_accessories = async (req, res, next) => {
    try {
        let accessories = await usbAccessoriesService.enumerateAccessories();
        res.status(200).send(accessories);
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.get_accessory = async (req, res, next) => {
    try {
        let accessory = await usbAccessoriesService.getAccessory(req.params.accessoryID);
        res.status(200).send(accessory);
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.get_accessory_hid = async (req, res, next) => {
    try {
        let hid = await usbAccessoriesService.getUsbAccessoryHid(req.params.accessoryID);
        res.status(200).send(hid);
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.open_accessory_hid = async (req, res, next) => {
    try {
        let hid_open;
        let query = new URLSearchParams(req.query);
        
        if (query.get("isOwned") === "true") {
            hid_open = await usbAccessoriesService.openOwnedAccessoryHid(req.params.accessoryID, req.body);
        }
        else {
            hid_open = await usbAccessoriesService.openSharedAccessoryHid(req.params.accessoryID, req.body);
        }
        res.status(200).send(hid_open);
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.get_open_accessory_hid = async (req, res, next) => {
    try {
        let query = new URLSearchParams(req.query);
        let isOwned = query.has("isOwned") ? query.get("isOwned") === "true" : false;
        let openHIDAccessory = await usbAccessoriesService.getOpenHIDAccessory(req.params.accessoryID, req.params.openHIDAccessoryID, isOwned);
        res.status(200).send(openHIDAccessory);
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.delete_open_accessory_hid = async (req, res, next) => {
    try {
        let query = new URLSearchParams(req.query);
        let isOwned = query.has("isOwned") ? query.get("isOwned") === "true" : false;
        await usbAccessoriesService.deleteOpenHIDAccessory(req.params.accessoryID, req.params.openHIDAccessoryID, isOwned);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.modify_open_accessory_hid = async (req, res, next) => {
    try {
        let query = new URLSearchParams(req.query);
        let isOwned = query.has("isOwned") ? query.get("isOwned") === "true" : false;
        let openHIDAccessory = await usbAccessoriesService.modifyOpenHIDAccessory(req.params.accessoryID, req.params.openHIDAccessoryID, req.body, isOwned);
        res.status(200).send(openHIDAccessory);
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.read_report_open_accessory_hid = async (req, res, next) => {
    try {
        let query = new URLSearchParams(req.query);
        let isOwned = query.has("isOwned") ? query.get("isOwned") === "true" : false;
        let readReport = await usbAccessoriesService.readReportOpenHIDAccessory(req.params.accessoryID, req.params.openHIDAccessoryID, req.body, isOwned);
        res.status(200).send(readReport);
    }
    catch (err) {
        next(err);
    }
}

usbAccessoriesController.write_report_open_accessory_hid = async (req, res, next) => {
    try {
        let query = new URLSearchParams(req.query);
        let isOwned = query.has("isOwned") ? query.get("isOwned") === "true" : false;
        let writeReport = await usbAccessoriesService.writeReportOpenHIDAccessory(req.params.accessoryID, req.params.openHIDAccessoryID, req.body, isOwned);
        res.status(200).send(writeReport);
    }
    catch (err) {
        next(err);
    }
}

    export default usbAccessoriesController;
