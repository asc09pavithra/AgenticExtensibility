import logService from '../services/logService.js';

const logController = {};

logController.get_log = async (req, res, next) => {
    try {
        let log = await logService.getLog(req.params.logName);
        if (log != null){
            res.status(200).send(log);
        } else {
            res.status(204).send();
        }
    }
    catch (err) {
        next(err);
    }
}

logController.clear_log = async (req, res, next) => {
    try {
        await logService.clearLog(req.params.logName);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}

export default logController;
