export class AccessTokenInfo {
    type;
    token;
    status;

    constructor(type, token, status) {
        this.type = type;
        this.token = token;
        this.status = status;
    }
}
