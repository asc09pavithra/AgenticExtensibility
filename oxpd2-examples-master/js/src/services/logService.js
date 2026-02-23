class LogService {
    #log

    constructor(props) {
        this.#log = new Map();
    }

    async createLog(logName) {
        if(!this.#log.has(logName)){
            this.#log.set(logName,[]);
        }
    }

    async log(logName, logItem) {
        if(!this.#log.has(logName)) {
            this.#log.set(logName,[]);
        }
        this.#log.get(logName).push(logItem);
    }

    async clearLog(logName) {
        if(this.#log.has(logName)){
            this.#log.delete(logName);
        }
    }

    async getLog(logName) {
        if(this.#log.has(logName)) {
            return this.#log.get(logName);
        }
        return [];
    }

    async resetLogs() {
        this.#log = new Map();
    }
}

const logService = new LogService();

export default logService;
