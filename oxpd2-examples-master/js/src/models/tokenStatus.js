const definitions = {
    None: {
        name: 'None',
        value: 0
    },
    Granted: {
        name: 'Granted',
        value: 0
    },
    Invalid: {
        name: 'Invalid',
        value: 0
    }
}

export class TokenStatus
{
    #name

    static None = new TokenStatus(definitions.None.name);
    static Granted = new TokenStatus(definitions.Granted.name);
    static Invalid = new TokenStatus(definitions.Invalid.name);

    constructor(name) {
        this.#name = name;
    }

    toString() {
        return this.#name;
    }

    toJSON() {
        return this.#name;
    }
}
