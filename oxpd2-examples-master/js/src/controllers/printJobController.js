import printJobService from "../services/printJobService.js";

const printJobController = {};

printJobController.get_capabilities = async (req, res, next) => {
    try {
        let capabilities = await printJobService.getCapabilities();
        res.status(200).send(capabilities);
    }
    catch (err) {
        next(err);
    }
}

printJobController.enumerate_print_job_agents = async (req, res, next) => {
    try {
        let printJobAgents = await printJobService.enumeratePrintJobAgents();
        res.status(200).send(printJobAgents);
    }
    catch (err) {
        next(err);
    }
}

printJobController.get_print_job_agent = async (req, res, next) => {
    try {
        let printJobAgent = await printJobService.getPrintJobAgent(req.params.agentId);
        res.status(200).send(printJobAgent);
    }
    catch (err) {
        next(err);
    }
}

export default printJobController;
