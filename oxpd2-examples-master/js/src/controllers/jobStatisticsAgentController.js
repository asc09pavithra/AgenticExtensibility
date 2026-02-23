import jobStatisticsAgentService from '../services/jobStatisticsAgentService.js';

const jobStatisticsAgentController = {};

jobStatisticsAgentController.post_notification = async (req, res, next) => {
    try {
        let statisticsCallbackResponse = await jobStatisticsAgentService.handleNotification(req.body);
        res.status(200).send(statisticsCallbackResponse);
    }
    catch (err) {
        next(err);
    }
}

export default jobStatisticsAgentController;
