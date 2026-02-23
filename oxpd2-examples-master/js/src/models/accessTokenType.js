// Order matters here. Must be in ascending order by scope.

const definitions = {
    UI_Context: {
        name: 'UI_Context',
        value: 0
    },
    Authentication_Context: {
        name: 'Authentication_Context',
        value: 1
    },
    Solution: {
        name: 'Solution',
        value: 2
    },
    Admin: {
        name: 'Admin',
        value: 3
    }
}

export class AccessTokenType
{
    #name;
    #value;
    static UI_Context = new AccessTokenType(definitions.UI_Context);
    static Authentication_Context = new AccessTokenType(definitions.Authentication_Context);
    static Solution = new AccessTokenType(definitions.Solution);
    static Admin = new AccessTokenType(definitions.Admin);

    constructor(props) {
        this.#name = props.name;
        this.#value = props.value;
    }

    get value() { return this.#value };
    get name() { return this.#name };

    static getLeastPrivileged(tokens) {
        var min = Math.min.apply(Math,tokens.map(function(x){return x.value;}))
        var obj = tokens.find(function(x){ return x.value == min; })
        return obj;
    }

    toString() {
        return this.#name;
    }

    toJSON() {
        return this.#name;
    }
}
