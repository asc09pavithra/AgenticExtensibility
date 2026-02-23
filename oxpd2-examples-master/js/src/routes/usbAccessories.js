/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import express from 'express';
import usbAccessoriesController from "../controllers/usbAccessoriesController.js";

var usbAccessoriesRouter = express.Router();

// Routes

// Capabilities
usbAccessoriesRouter.get("/capabilities", usbAccessoriesController.get_capabilities);

// Agents
usbAccessoriesRouter.get("/usbAccessoriesAgents", usbAccessoriesController.enumerate_accessories_agents);

usbAccessoriesRouter.get("/usbAccessoriesAgents/:agentId", usbAccessoriesController.get_accessories_agent);

// Accessories
usbAccessoriesRouter.get("/accessories", usbAccessoriesController.enumerate_accessories);

usbAccessoriesRouter.get("/accessories/:accessoryID", usbAccessoriesController.get_accessory);

// Hid

usbAccessoriesRouter.get("/accessories/:accessoryID/hid", usbAccessoriesController.get_accessory_hid);

usbAccessoriesRouter.post("/accessories/:accessoryID/hid/open", usbAccessoriesController.open_accessory_hid);

usbAccessoriesRouter.get("/accessories/:accessoryID/hid/:openHIDAccessoryID", usbAccessoriesController.get_open_accessory_hid);

usbAccessoriesRouter.delete("/accessories/:accessoryID/hid/:openHIDAccessoryID", usbAccessoriesController.delete_open_accessory_hid);

usbAccessoriesRouter.patch("/accessories/:accessoryID/hid/:openHIDAccessoryID", usbAccessoriesController.modify_open_accessory_hid);

usbAccessoriesRouter.post("/accessories/:accessoryID/hid/:openHIDAccessoryID/readReport", usbAccessoriesController.read_report_open_accessory_hid);

usbAccessoriesRouter.post("/accessories/:accessoryID/hid/:openHIDAccessoryID/writeReport", usbAccessoriesController.write_report_open_accessory_hid);

export default usbAccessoriesRouter;
