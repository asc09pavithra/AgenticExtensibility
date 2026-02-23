import { Device } from "./device.js";
import { AccessTokenType } from "./accessTokenType.js";
import { TokenStatus } from "./tokenStatus.js";
import { AccessTokenInfo } from "./accessTokenInfo.js";
import oxpd2 from 'oxpd2';
import deviceManagementService from "../services/deviceManagementService.js";

export class BoundDevice extends Device {
    #adminAccessToken;
    #solutionAccessToken;
    #uiContextAccessToken;
    #authenticationContextAccessToken;

    constructor()
    {
        super();
    }

    get adminAccessToken() { return this.#adminAccessToken; }
    set adminAccessToken(value) {
        if (value instanceof oxpd2.Oauth2Client.Token || value == null) {
            this.#adminAccessToken = value;
        }
        else { throw "Unexpected type: Expected type of Oauth2Client.Token but value is " + (typeof value); }
    }

    get solutionAccessToken() { return this.#solutionAccessToken; }
    set solutionAccessToken(value) {
        if (value instanceof oxpd2.Oauth2Client.Token || value == null) {
            this.#solutionAccessToken = value;
        }
        else { throw "Unexpected type: Expected type of Oauth2Client.Token but value is " + (typeof value); }
    }

    get uiContextAccessToken() { return this.#uiContextAccessToken; }
    set uiContextAccessToken(value) {
        if (value instanceof oxpd2.Oauth2Client.Token || value == null) {
            this.#uiContextAccessToken = value;
        }
        else { throw "Unexpected type: Expected type of Oauth2Client.Token but value is " + (typeof value); }
    }

    get authenticationContextAccessToken() { return this.#authenticationContextAccessToken; }
    set authenticationContextAccessToken(value) {
        if (value instanceof oxpd2.Oauth2Client.Token || value == null) {
            this.#authenticationContextAccessToken = value;
        }
        else { throw "Unexpected type: Expected type of Oauth2Client.Token but value is " + (typeof value); }
    }

    async getToken(accessTokenTypes)
    {
        if (accessTokenTypes == null || accessTokenTypes.length == 0)
        {
            return "";
        }
        else
        {
            var grantedTokenTypes = this.getTokens().filter(function(x) { return x.status == TokenStatus.Granted });
            if (grantedTokenTypes.length == 0)
            {
                return "";
            }

            var matchingTokens = accessTokenTypes.filter(x => grantedTokenTypes.find(t => t.type == x));

            if (matchingTokens.length == 0)
            {
                return "";
            }

            switch (AccessTokenType.getLeastPrivileged(matchingTokens))
            {
                case AccessTokenType.UI_Context: return this.uiContextAccessToken.accessToken;
                case AccessTokenType.Authentication_Context: return this.authenticationContextAccessToken.accessToken;
                case AccessTokenType.Solution:
                {
                    await this.refreshTokenIfNeeded();
                    return this.solutionAccessToken.accessToken;
                }
                case AccessTokenType.Admin: return this.adminAccessToken.accessToken;
                default: return ""; // Should never reach this case
            }
        }
    }

    getTokens()
    {
        return [
            new AccessTokenInfo(AccessTokenType.Admin, this.adminAccessToken, this.adminAccessTokenStatus),
            new AccessTokenInfo(AccessTokenType.Solution, this.solutionAccessToken, this.solutionAccessTokenStatus),
            new AccessTokenInfo(AccessTokenType.UI_Context, this.uiContextAccessToken, this.uiContextAccessTokenStatus),
            new AccessTokenInfo(AccessTokenType.Authentication_Context, this.authenticationContextAccessToken, this.authenticationContextAccessTokenStatus)
        ];
    }

    async refreshTokenIfNeeded() 
    {
        let expiryTime = this.solutionAccessTokenTimeGranted;
        expiryTime = expiryTime + this.solutionAccessToken.expiresIn * 1000;

        let d = new Date();
        let now = d.getTime();
        if( now >= expiryTime) {
            await deviceManagementService.refreshGrant(this.solutionAccessToken.refreshToken)
        }
    }

    toJSON() {
        return super.toJSON();
    }
}
