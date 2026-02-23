import deviceManagementService from "./deviceManagementService.js";
import logService from "./logService.js";
import { LogItem } from "../models/logItem.js";
import oxpd2 from 'oxpd2';

class SolutionNotificationService {
    #LOG_BASE = "copyNotifications"

    constructor() {

    }

    async handleNotification(notification) {
        logService.log(this.#LOG_BASE, new LogItem(notification.copyJobId, notification));
    }
}

const copyAgentService = new SolutionNotificationService();

export default copyAgentService;
