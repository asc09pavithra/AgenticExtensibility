import { describe, expect, jest, test } from '@jest/globals';
import {AccessTokenType} from '../../src/models/accessTokenType';
import {TokenStatus} from '../../src/models/tokenStatus';
import {BoundDevice }from '../../src/models/boundDevice';
var oxpd2 = require('oxpd2');

describe('BoundDevice', () => {
    describe('getToken', () => {

        test('Should return empty string when called with empty array', async () => {
            var boundDevice = new BoundDevice();
            var token = await boundDevice.getToken([]);
            expect(token).toEqual("");
        });

        test('Should return empty string when called with no params', async () => {
            var boundDevice = new BoundDevice();
            var token = await boundDevice.getToken();
            expect(token).toEqual("");
        });

        test('Should return empty string when no granted tokens', async () => {
            var boundDevice = new BoundDevice();
            var token = await boundDevice.getToken([AccessTokenType.Admin]);
            expect(token).toEqual("");
        });

        test('Should return empty string when no matching tokens', async () => {
            var boundDevice = new BoundDevice();
            boundDevice.solutionAccessToken = new  oxpd2.Oauth2Client.Token();
            boundDevice.solutionAccessToken.accessToken = "solution_token"
            boundDevice.solutionAccessTokenStatus = TokenStatus.Granted;
            var token = await boundDevice.getToken([AccessTokenType.Admin]);
            expect(token).toEqual("");
        });

        test('Should get Admin Token when only Admin Token is set.', async () => {
            var boundDevice = new BoundDevice();
            boundDevice.adminAccessToken = new  oxpd2.Oauth2Client.Token();
            boundDevice.adminAccessToken.accessToken = "admin_token"
            boundDevice.adminAccessTokenStatus = TokenStatus.Granted;
            var token = await boundDevice.getToken([AccessTokenType.Admin]);
            expect(token).toEqual("admin_token");
        });
        test ('Should get Solution Token when only Solution Token is set.', async () => {
            var boundDevice = new BoundDevice();
            boundDevice.solutionAccessToken = new  oxpd2.Oauth2Client.Token();
            boundDevice.solutionAccessToken.accessToken = "solution_token"
            boundDevice.solutionAccessTokenStatus = TokenStatus.Granted;
            var token = await boundDevice.getToken([AccessTokenType.Solution]);
            expect(token).toEqual("solution_token");
        });
        test ('Should get Authentication Token when only Authentication Token is set.', async () => {
            var boundDevice = new BoundDevice();
            boundDevice.authenticationContextAccessToken = new  oxpd2.Oauth2Client.Token();
            boundDevice.authenticationContextAccessToken.accessToken = "auth_token"
            boundDevice.authenticationContextAccessTokenStatus = TokenStatus.Granted;
            var token = await boundDevice.getToken([AccessTokenType.Authentication_Context]);
            expect(token).toEqual("auth_token");
        });
        
        test ('Should get UI Context Token when only UI Context Token is set.', async () => {
            var boundDevice = new BoundDevice();
            boundDevice.uiContextAccessToken = new  oxpd2.Oauth2Client.Token();
            boundDevice.uiContextAccessToken.accessToken = "ui_token"
            boundDevice.uiContextAccessTokenStatus = TokenStatus.Granted;
            var token = await boundDevice.getToken([AccessTokenType.UI_Context]);
            expect(token).toEqual("ui_token");
        });

        test ('Should get UI Solution Token with Solution and Admin Token are set', async () => {
            var boundDevice = new BoundDevice();
            boundDevice.solutionAccessToken = new  oxpd2.Oauth2Client.Token();
            boundDevice.solutionAccessToken.accessToken = "solution_token"
            boundDevice.solutionAccessTokenStatus = TokenStatus.Granted;
            boundDevice.adminAccessToken = new  oxpd2.Oauth2Client.Token();
            boundDevice.adminAccessToken.accessToken = "admin_token"
            boundDevice.adminAccessTokenStatus = TokenStatus.Granted;
            var token = await boundDevice.getToken([AccessTokenType.Solution, AccessTokenType.Admin]);
            expect(token).toEqual("solution_token");
        });
    });
    describe('set adminAccessToken', () => {
        test ('should set adminAccessToken', () => {
            var boundDevice = new BoundDevice();
            var token = new  oxpd2.Oauth2Client.Token();
            boundDevice.adminAccessToken = token;
            var result = boundDevice.adminAccessToken;
            expect(result).toEqual(token);
        });

        test ('should throw when setting adminAccessToken to non-token', () => {
            var boundDevice = new BoundDevice();
            var token = {};
            expect(() => {
                boundDevice.adminAccessToken = token;
              }).toThrow();
        });
    });

    describe('set solutionAccessToken', () => {
        test ('should set solutionAccessToken', () => {
            var boundDevice = new BoundDevice();
            var token = new  oxpd2.Oauth2Client.Token();
            boundDevice.solutionAccessToken = token;
            var result = boundDevice.solutionAccessToken;
            expect(result).toEqual(token);
        });

        test ('should throw when setting solutionAccessToken to non-token', () => {
            var boundDevice = new BoundDevice();
            var token = {};
            expect(() => {
                boundDevice.solutionAccessToken = token;
              }).toThrow();
        });
    });

    describe('set authenticationContextAccessToken', () => {
        test ('should set authenticationContextAccessToken', () => {
            var boundDevice = new BoundDevice();
            var token = new  oxpd2.Oauth2Client.Token();
            boundDevice.authenticationContextAccessToken = token;
            var result = boundDevice.authenticationContextAccessToken;
            expect(result).toEqual(token);
        });

        test ('should throw when setting authenticationContextAccessToken to non-token', () => {
            var boundDevice = new BoundDevice();
            var token = {};
            expect(() => {
                boundDevice.authenticationContextAccessToken = token;
              }).toThrow();
        });
    });

    describe('set uiContextAccessToken', () => {
        test ('should set uiContextAccessToken', () => {
            var boundDevice = new BoundDevice();
            var token = new  oxpd2.Oauth2Client.Token();
            boundDevice.uiContextAccessToken = token;
            var result = boundDevice.uiContextAccessToken;
            expect(result).toEqual(token);
        });

        test ('should throw when setting uiContextAccessToken to non-token', () => {
            var boundDevice = new BoundDevice();
            var token = {};
            expect(() => {
                boundDevice.uiContextAccessToken = token;
            }).toThrow();
        });
    });
});
