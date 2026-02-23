/**
 * (C) Copyright 2023 HP Development Company, L.P.
 * All rights reserved.
 */

import { LogItem } from "../models/logItem.js";
import logService from "./logService.js";

class ScanJobAgentService {
    #NOTIFICATION_LOG = "scanNotifications";
    #RECEIVER_LOG = "scanJobReceiver";

    constructor() {

    }

    async handleNotification(payload) {
        logService.log(this.#NOTIFICATION_LOG, new LogItem(payload.jobNotification.scanJobId.toString(), payload));
    }

    async handleScanJobReceiver(payload) {
        logService.log(this.#RECEIVER_LOG, new LogItem(payload.transmittingState, payload));
    }
}

const scanJobAgentService = new ScanJobAgentService();

export default scanJobAgentService;
