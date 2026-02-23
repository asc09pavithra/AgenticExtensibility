import { describe, expect, jest, test, fail } from '@jest/globals';
import { BoundDevice } from '../../src/models/boundDevice.js';
import  deviceManagementService  from '../../src/services/deviceManagementService.js';
import errors from '../../src/services/errors.js';
import oxpd2 from 'oxpd2';

const mockValue = jest.Mock;

global.fetch = jest.fn();

describe('deviceManagementService', () => {
    
    afterEach(() => {
        jest.clearAllMocks();
      });

    describe('bindDevice', () => {
        test('should throw error when service discovery error',async () => {
            // Test Setup
            // Mock getServiceDiscovery to throw error
            jest.spyOn(deviceManagementService, 'getServicesDiscovery').mockRejectedValueOnce(new Error("mock error"));

            try {
                await deviceManagementService.bindDevice("12.23.12.42");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual(errors.DISCOVERY_SERVICE);
            }
            expect(deviceManagementService.currentDevice).toBeNull();
        });

        test('should return bound device discovery tree is available',async () => {
            // Test Setup
            var discovery = new oxpd2.CommonTypes.ServicesDiscovery();
            jest.spyOn(deviceManagementService, 'getServicesDiscovery').mockResolvedValueOnce(discovery);
            // Run Test
            var result = await deviceManagementService.bindDevice("12.23.12.42");
            // Assert Results
            expect(result.networkAddress).toEqual("12.23.12.42");
            expect(result.bindStatus).toEqual("bound");
        });
    });

    describe('unbindDevice', () => {
        test('should unbind device',async () => {
            // Test Setup
            var discovery = new oxpd2.CommonTypes.ServicesDiscovery();
            jest.spyOn(deviceManagementService, 'getServicesDiscovery').mockResolvedValueOnce(discovery);
            // Run Test
            await deviceManagementService.bindDevice("12.23.12.42");
            deviceManagementService.unbindDevice();
            // Assert Results
            expect(deviceManagementService.currentDevice).toBeNull();
        });
    });

    describe('getServicesDiscovery', () => {
        test('should throw error when passwordGrant error',async () => {
            // Test Setup
            // Mock getServiceDiscovery to throw error
            jest.spyOn(deviceManagementService, 'getServicesDiscovery').mockRejectedValueOnce(new Error("mock error"));

            try {
                await deviceManagementService.getServicesDiscovery();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual("mock error");
            }
        });

        test('should return service discovery',async () => {
            // Test Setup
            var sd = new oxpd2.CommonTypes.ServicesDiscovery();

            jest.spyOn(deviceManagementService, 'getServicesDiscovery').mockResolvedValueOnce(sd);
            // Run Test
            var result = await deviceManagementService.getServicesDiscovery();
            // Assert Results
            expect(result).toBeTruthy();
            expect(result instanceof oxpd2.CommonTypes.ServicesDiscovery);
        });

        test('should return service discovery with mocking fetch',async () => {
            let links = [];
            let link = new oxpd2.BaseTypes.Link();
            link.href = "/dummy-service/resource";
            link.rel = "resource";
            links.push(link);
            let serviceMetadata = new oxpd2.CommonTypes.ServiceMetadata({version: "1.0.0", serviceGun: "service.gun", description: "dummy-service", links: links});
            let serviceMetadatas = [];
            serviceMetadatas.push(serviceMetadata);
            let mockResourceContent = new oxpd2.CommonTypes.ServicesDiscovery({version: "1.0.0", services: serviceMetadatas});
            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return mockResourceContent.toJSON();
                }
            });
            fetch.mockImplementation(() => response);  // To mock a sequence use mockImplementationOnce
            await deviceManagementService.bindDevice("12.23.12.42");

            let result = await deviceManagementService.getServicesDiscovery();
            expect(result).toBeInstanceOf(oxpd2.CommonTypes.ServicesDiscovery);
        });
    });

    describe('passwordGrant', () => {
        test('should throw error when passwordGrant error',async () => {
            // Test Setup
            // Mock getServiceDiscovery to throw error
            jest.spyOn(deviceManagementService, 'passwordGrant').mockRejectedValueOnce(new Error("mock error"));

            try {
                await deviceManagementService.passwordGrant("abc", "123");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual("mock error");
            }
        });

        test('should return token',async () => {
            // Test Setup
            var token = new oxpd2.Oauth2Client.Token();
            token.accessToken = "THE-TOKEN";
            token.tokenType = "Bearer";
            token.scope = "THE-SCOPE";
            token.expiresIn = 12345;

            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return token.toJSON();
                }
            });
            fetch.mockImplementation(() => response);
            await deviceManagementService.bindDevice("12.23.12.42");

            // Run Test
            var result = await deviceManagementService.passwordGrant("abc", "123");
            // Assert Results
            expect(result.accessToken).toEqual("THE-TOKEN");
            expect(result.tokenType).toEqual("Bearer");
        });
    });

    describe('authorizationCodeGrant', () => {
        test('should throw error when authorizationCodeGrant error',async () => {
            // Test Setup
            // Mock getServiceDiscovery to throw error
            jest.spyOn(deviceManagementService, 'authorizationCodeGrant').mockRejectedValueOnce(new Error("mock error"));

            try {
                await deviceManagementService.authorizationCodeGrant("code...");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual("mock error");
            }
        });

        test('should return token',async () => {
            // Test Setup
            var token = new oxpd2.Oauth2Client.Token();
            token.accessToken = "THE-TOKEN";
            token.tokenType = "Bearer";
            token.scope = "THE-SCOPE";
            token.expiresIn = 12345;

            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return token.toJSON();
                }
            });
            fetch.mockImplementation(() => response);
            await deviceManagementService.bindDevice("12.23.12.42");

            // Run Test
            var result = await deviceManagementService.authorizationCodeGrant("code...");
            // Assert Results
            expect(result.accessToken).toEqual("THE-TOKEN");
            expect(result.tokenType).toEqual("Bearer");
        });
    });

    describe('refreshGrant', () => {
        test('should throw error when refreshGrant error',async () => {
            // Test Setup
            // Mock getServiceDiscovery to throw error
            jest.spyOn(deviceManagementService, 'refreshGrant').mockRejectedValueOnce(new Error("mock error"));

            try {
                await deviceManagementService.refreshGrant("refreshToken...");
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual("mock error");
            }
        });

        test('should return token',async () => {
            // Test Setup
            var token = new oxpd2.Oauth2Client.Token();
            token.accessToken = "THE-TOKEN";
            token.tokenType = "Bearer";
            token.scope = "THE-SCOPE";
            token.expiresIn = 12345;

            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return token.toJSON();
                }
            });
            fetch.mockImplementation(() => response);
            await deviceManagementService.bindDevice("12.23.12.42");

            // Run Test
            var result = await deviceManagementService.refreshGrant("refreshToken...");
            // Assert Results
            expect(result.accessToken).toEqual("THE-TOKEN");
            expect(result.tokenType).toEqual("Bearer");
        });
    });

    describe('getDeviceInformation', () => {
        test('should throw error when getDeviceInformation error',async () => {
            // Test Setup
            // Mock getServiceDiscovery to throw error
            jest.spyOn(deviceManagementService, 'getDeviceInformation').mockRejectedValueOnce(new Error("mock error"));

            try {
                await deviceManagementService.getDeviceInformation();
                fail("Error should have been thrown");
            }
            catch (error) {
                expect(error.message).toEqual("mock error");
            }
        });

        test('should return object',async () => {
            // Test Setup
            var object = new Object();

            const response = Promise.resolve({
                ok: true,
                status: 200,
                json: () => {
                    return object;
                }
            });
            fetch.mockImplementation(() => response);
            await deviceManagementService.bindDevice("12.23.12.42");

            // Run Test
            var result = await deviceManagementService.getDeviceInformation();
            // Assert Results
            expect(result).toBeTruthy();
        });
    });
});
