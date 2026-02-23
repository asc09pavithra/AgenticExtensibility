import solutionNotificationService from '../services/solutionNotificationService.js';

const logController = {};

logController.post_notification = async (req, res, next) => {
    try {
        for (let payloadItemJson of req.body.payloads) {
            await solutionNotificationService.handleNotification(payloadItemJson);
        }
        res.status(200).send();
    }
    catch (err) {
        next(err);
    }
}

export default logController;
