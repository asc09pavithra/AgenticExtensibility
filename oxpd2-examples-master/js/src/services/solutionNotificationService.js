import deviceManagementService from "./deviceManagementService.js";
import logService from "./logService.js";
import { LogItem } from "../models/logItem.js";
import oxpd2 from 'oxpd2';

class SolutionNotificationService {
    #LOG_BASE = "solutionNotifications"

    constructor() {

    }

    async handleNotification(payload) {
        // @StartCodeExample:AddNotificationPayload
        if (payload.notificationType == oxpd2.SolutionManagerTypes.NotificationType.ntAuthCode) {
            // exchange the authCode for an accessToken.
            if (payload.notificationPayload != null)
            {
                let code = payload.notificationPayload.authCodeNotificationPayload.code;

                // Check that the current device is set in order to exchange
                if (deviceManagementService.currentDevice != null)
                {
                    // Exchange the authorization code to get a bearer access token for the solution
                    deviceManagementService.authorizationCodeGrant(code);
                }
            }
        }
        const sanitizedPayload = JSON.stringify(payload).replace(/[\r\n]+/g, ' ');
        console.log(sanitizedPayload);
        logService.log(this.#LOG_BASE, new LogItem(payload.notificationType, payload.notificationPayload));
        // @EndCodeExample
    }
}

const solutionNotificationService = new SolutionNotificationService();

export default solutionNotificationService;
