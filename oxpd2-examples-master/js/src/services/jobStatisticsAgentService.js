import deviceManagementService from "./deviceManagementService.js";
import logService from "./logService.js";
import { LogItem } from "../models/logItem.js";
import oxpd2 from 'oxpd2';

class JobStatisticsAgentService {
    #LOG_BASE = "jobStatisticsNotifications";

    constructor() {

    }

    async handleNotification(payload) {
        logService.log(this.#LOG_BASE, new LogItem("StatisticsCallbackPayload", payload));

        // This is where the solution would process the data

        let statisticsCallbackResponse = new oxpd2.JobStatisticsService.StatisticsCallbackResponse();
        
        statisticsCallbackResponse.lastSequenceNumberNotified = payload.lastSequenceNumberNotified;
        statisticsCallbackResponse.lastSequenceNumberProcessed = payload.lastSequenceNumberProcessed;
        
        return statisticsCallbackResponse;
    }
}

const jobStatisticsAgentService = new JobStatisticsAgentService();

export default jobStatisticsAgentService;
