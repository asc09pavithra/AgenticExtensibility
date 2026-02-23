import { fireEvent, render } from '@testing-library/react';
import { SecurityAgentsTabContent } from '../views/security/SecurityAgents';
import { SecurityAgent, SecurityAgentDetails } from '../views/security/SecurityAgent';
import { DeviceContext } from "../common/DeviceContext";

describe('Security Service View', () => {

    const originalWarn = console.warn.bind(console.warn);
    const originalError = console.error.bind(console.error);
    const service = require('../services/SecurityService');
    jest.mock('../services/SecurityService', () => ({ 
        enumerateSecurityAgents: jest.fn(),
        getSecurityAgent: jest.fn()
    }));
    beforeAll(() => {
        // Ignoring this specific console warning
        console.warn = (msg) =>
            !msg.toString().includes('use a basename on a page whose URL path does not begin with the basename') && originalWarn(msg)
        // Ignoring this specific console error
        console.error = (msg) =>
            !msg.toString().includes('The prop `to` is marked as required in `Link`, but its value is `undefined`.')
    });
    afterAll(() => {
        console.warn = originalWarn
        console.error = originalError
    });

    test("Security Agents", () => {

        const agents = {
            memberIds: ["ad431139-6b64-4851-8c66-099766ae3fa1"],
            offset: 0,
            selectedCount: 1,
            totalCount: 1
        };
        service.enumerateSecurityAgents.mockReturnValue(agents);

        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
            currentAccessToken: "fakestuff"
        };

        var { getByTestId, getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <SecurityAgentsTabContent service={service} />
            </DeviceContext.Provider>
        );

        const agentsCard = getByTestId("security-agents-card");
        expect(agentsCard).toBeInTheDocument();
        expect(service.enumerateSecurityAgents.mock.calls.length).toBe(1);
        expect(getByText('Loading resource...')).toBeInTheDocument();
    });

    test("Security Agent", () => {

        const agent = {
            declaredExpressionOperators: [
                "EMAIL_ADDRESS",
                "USER_NAME"
            ],
            resourceId: "ad431139-6b64-4851-8c66-099766ae3fa1",
            solutionId: "9b1930cd-001a-4c47-b194-112c3ea59f67",
            agentId: "ad431139-6b64-4851-8c66-099766ae3fa1",
            localizedDescription: {
                i18nAssetId: "a5ca1752-e811-458f-9a33-693b0bac8703",
                stringId: "cSecurityAgentDescription"
            },
            localizedName: {
                i18nAssetId: "a5ca1752-e811-458f-9a33-693b0bac8703",
                stringId: "cSecurityAgentName"
            },
            name: "Acme Security Agent"
        }
        service.getSecurityAgent.mockReturnValue(agent);

        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
            currentAccessToken: "fakestuff"
        };

        var { getByTestId, getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <SecurityAgent service={service} agentId={"ad431139-6b64-4851-8c66-099766ae3fa1"} />
            </DeviceContext.Provider>
        );

        const agentCard = getByTestId("security-agent-card");
        expect(agentCard).toBeInTheDocument();
        expect(service.getSecurityAgent.mock.calls.length).toBe(1);
        expect(getByText('Loading resource...')).toBeInTheDocument();

        const loadrefresh = getByTestId("security-agent-loadrefresh");
        expect(loadrefresh).toBeInTheDocument();
        fireEvent.click(loadrefresh);

        const showapiresponse = getByTestId("security-agent-showapiresponse");
        expect(showapiresponse).toBeInTheDocument();
        fireEvent.click(showapiresponse);
    });

    test("Security Agent Details", () => {
        const agent = {
            declaredExpressionOperators: [
                "EMAIL_ADDRESS",
                "USER_NAME"
            ],
            resourceId: "ad431139-6b64-4851-8c66-099766ae3fa1",
            solutionId: "9b1930cd-001a-4c47-b194-112c3ea59f67",
            agentId: "ad431139-6b64-4851-8c66-099766ae3fa1",
            localizedDescription: {
                i18nAssetId: "a5ca1752-e811-458f-9a33-693b0bac8703",
                stringId: "cSecurityAgentDescription"
            },
            localizedName: {
                i18nAssetId: "a5ca1752-e811-458f-9a33-693b0bac8703",
                stringId: "cSecurityAgentName"
            },
            name: "Acme Security Agent"
        }

        var { getByTestId } = render(
            <SecurityAgentDetails securityAgent={agent} />
        );

        const agentDetails = getByTestId("security-agentdetails-list");
        expect(agentDetails).toBeInTheDocument();   
    });
});
