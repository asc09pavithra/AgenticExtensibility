import { TokenStatus } from "./tokenStatus.js"

export class Device {
    networkAddress;
    bindStatus = "unbound";
    adminAccessTokenStatus = TokenStatus.None;
    solutionAccessTokenStatus = TokenStatus.None;
    solutionAccessTokenTimeGranted
    uiContextAccessTokenStatus = TokenStatus.None;
    authenticationContextAccessTokenStatus = TokenStatus.None;

    constructor() {}

    // TODO: add Accessors/Mutators to ensure type

    toJSON() {
        let obj = {};
        if (this.networkAddress != null) { obj.networkAddress = this.networkAddress; }
        if (this.bindStatus != null) { obj.bindStatus = this.bindStatus; }
        if (this.adminAccessTokenStatus != null) { obj.adminAccessTokenStatus = this.adminAccessTokenStatus; }
        if (this.solutionAccessTokenStatus != null ) {obj.solutionAccessTokenStatus = this.solutionAccessTokenStatus; }
        if (this.solutionAccessTokenTimeGranted != null ) {obj.solutionAccessTokenTimeGranted = this.solutionAccessTokenTimeGranted; }
        if (this.uiContextAccessTokenStatus != null ) {obj.uiContextAccessTokenStatus = this.uiContextAccessTokenStatus; }
        if (this.authenticationContextAccessTokenStatus != null ) {obj.authenticationContextAccessTokenStatus = this.authenticationContextAccessTokenStatus; }
        return obj;
    }
}
