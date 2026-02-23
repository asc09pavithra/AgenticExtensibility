export class LogItem {
    #data;
    #type;
    #timeStamp;

    constructor(type, data) {
        this.#data = data;
        this.#type = type;
        this.#timeStamp = new Date(Date.now()).toUTCString();
    }

    get data() { return this.#data; }

    get type() { return this.#type; }

    get timeStamp() { return this.#timeStamp; }

    toJSON() {
        let obj = {};
        if (this.#data != null) { obj.data = this.#data; }
        if (this.#type != null) { obj.type = this.#type; }
        if (this.#timeStamp != null) { obj.timeStamp = this.#timeStamp; }
        return obj;
    }
}
