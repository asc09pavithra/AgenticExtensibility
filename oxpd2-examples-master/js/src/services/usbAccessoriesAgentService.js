/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */
import logService from "./logService.js";
import { LogItem } from "../models/logItem.js";

class UsbAccessoriesAgentService {
    #REGISTRATION_LOG_BASE = "usbregistration";
    #CALLBACK_LOG_BASE = "usbcallback";

    constructor() {

    }

    async handleUsbRegistrationNotification(payload) {
        if(payload.isUsbAttached) {
            logService.log(this.#REGISTRATION_LOG_BASE, new LogItem(payload.usbAttached.typeName, payload.usbAttached))
        }
        if(payload.isUsbDetached) {
            logService.log(this.#REGISTRATION_LOG_BASE, new LogItem(payload.usbDetached.typeName, payload.usbDetached))
        }
    }

    async handleUsbCallback(callbackEnvelope) {
        if (callbackEnvelope.usbCallback !== undefined && callbackEnvelope.usbCallback !== null) {
            let callback = callbackEnvelope.usbCallback;
            if(callback.isHidRead) {
                logService.log(this.#CALLBACK_LOG_BASE, new LogItem(callback.hidRead.typeName, callback.hidRead));
            }
            if(callback.isUsbRead) {
                logService.log(this.#CALLBACK_LOG_BASE, new LogItem(callback.usbRead.typeName, callback.usbRead));
            }
            if(callback.isUsbWrite) {
                logService.log(this.#CALLBACK_LOG_BASE, new LogItem(callback.usbWrite.typeName, callback.usbWrite));
            }
            if(callback.isUsbClosed) {
                logService.log(this.#CALLBACK_LOG_BASE, new LogItem(callback.usbClosed.typeName, callback.usbClosed));
            }
        }
    }
}

const usbAccessoriesAgentService = new UsbAccessoriesAgentService();

export default usbAccessoriesAgentService;
