// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Create a proper mock response object
const createMockResponse = (status = 200, data = {}) => ({
  status,
  statusText: status === 200 ? 'OK' : status === 204 ? 'No Content' : 'Error',
  ok: status >= 200 && status < 300,
  headers: new Headers(),
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
  blob: () => Promise.resolve(new Blob()),
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
});

// Mock fetch more comprehensively
Object.defineProperty(window, 'fetch', {
  writable: true,
  value: jest.fn().mockImplementation((url) => {
    // Simulate different responses based on the URL
    if (url.includes('/deviceManagement/bindDevice')) {
      return Promise.resolve(createMockResponse(204));
    }
    
    if (url.includes('/deviceManagement/unbindDevice')) {
      return Promise.resolve(createMockResponse(204));
    }

    if (url.includes('/deviceManagement/device/passwordGrant')) {
      return Promise.resolve(createMockResponse(200, { token: 'mock-token' }));
    }

    if (url.includes('/deviceManagement/device/tokens')) {
      return Promise.resolve(createMockResponse(200, { tokens: [] }));
    }

    if (url.includes('/deviceManagement/device/servicesDiscovery')) {
      return Promise.resolve(createMockResponse(200, { services: [] }));
    }

    if (url.includes('/deviceManagement/device/deviceInfo')) {
      return Promise.resolve(createMockResponse(200, { deviceInfo: {} }));
    }

    // Handle application service requests
    if (url.includes('/application/capabilities')) {
      return Promise.resolve(createMockResponse(200, { capabilities: [] }));
    }

    if (url.includes('/application/applicationAgents')) {
      return Promise.resolve(createMockResponse(200, { agents: [] }));
    }

    if (url.includes('/application/applicationAccessPoints')) {
      return Promise.resolve(createMockResponse(200, { accessPoints: [] }));
    }

    if (url.includes('/application/applicationRuntime')) {
      return Promise.resolve(createMockResponse(200, { runtime: {} }));
    }

    // Default successful response for all other requests
    return Promise.resolve(createMockResponse(200, { message: 'Success' }));
  })
});

// Also set global fetch for Node.js environment
global.fetch = window.fetch;

// Mock console.log to capture service calls without cluttering output
const originalConsoleLog = console.log;
global.console.log = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  window.fetch.mockClear();
  console.log.mockClear();
});
