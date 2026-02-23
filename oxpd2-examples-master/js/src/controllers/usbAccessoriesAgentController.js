/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import oxpd2 from "oxpd2";
import usbAccessoriesAgentService from '../services/usbAccessoriesAgentService.js';

const usbAccessoriesAgentController = {};

/** Registration target defined in the solution manifest.
* This end-point will be called when solution owned USB accessories
* (as described in the solution manifest file) are attached or detached from the device.
*/
usbAccessoriesAgentController.registration_target = async (req, res, next) => {
    try {
        usbAccessoriesAgentService.handleUsbRegistrationNotification(new oxpd2.UsbAccessoriesService.UsbRegistrationPayload(req.body.registrationPayload));
        res.status(200).send(new oxpd2.UsbAccessoriesService.RegistrationResponse());
    }
    catch (err) {
        next(err);
    }
}

/** Operation Callback target defined in the solution manifest.
* This end-point will be called when an async read or write occurs to the open accessory
* and when the accessory is closed.
*/
usbAccessoriesAgentController.operation_callback_target = async (req, res, next) => {
    try {
        usbAccessoriesAgentService.handleUsbCallback(new oxpd2.UsbAccessoriesService.UsbCallbackEnvelope(req.body));
        res.status(200).send(new oxpd2.UsbAccessoriesService.OperationCallbackResponse());
    }
    catch (err) {
        next(err);
    }
}

export default usbAccessoriesAgentController;
