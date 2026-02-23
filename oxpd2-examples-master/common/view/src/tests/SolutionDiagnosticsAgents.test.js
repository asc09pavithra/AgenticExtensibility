import { fireEvent, render } from '@testing-library/react';
import { SolutionDiagnosticsAgentsTabContent } from '../views/solutionDiagnostics/SolutionDiagnosticsAgents';
import { SolutionDiagnosticsAgent, SolutionDiagnosticsAgentDetails, SolutionDiagnosticsAgentLog } from '../views/solutionDiagnostics/SolutionDiagnosticsAgent';
import { DeviceContext } from "../common/DeviceContext";

describe('Solution Diagnostics Service View', () => {

    const originalWarn = console.warn.bind(console.warn);
    const originalError = console.error.bind(console.error);
    const service = require('../services/SolutionDiagnosticsService');
    jest.mock('../services/SolutionDiagnosticsService', () => ({ 
        enumerateSolutionDiagnosticsAgents: jest.fn(),
        getSolutionDiagnosticsAgent: jest.fn(),
        getSolutionDiagnosticsAgentLog: jest.fn()
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

    test("Solution Diagnostics Agents", () => {

        const agents = {
            memberIds: ["b7f74d8a-f36d-4165-ab4f-914345785e79"],
            offset: 0,
            selectedCount: 1,
            totalCount: 1
        };
        service.enumerateSolutionDiagnosticsAgents.mockReturnValue(agents);

        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
            currentAccessToken: "fakestuff"
        };

        var { getByTestId, getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <SolutionDiagnosticsAgentsTabContent service={service} />
            </DeviceContext.Provider>
        );

        const agentsCard = getByTestId("solution-diagnostics-agents-card");
        expect(agentsCard).toBeInTheDocument();
        expect(service.enumerateSolutionDiagnosticsAgents.mock.calls.length).toBe(1);
        expect(getByText('Loading resource...')).toBeInTheDocument();
    });

    test("Solution Diagnostics Agent", () => {

        const agent = {
            resourceId: "b7f74d8a-f36d-4165-ab4f-914345785e79",
            solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
            agentId: "b7f74d8a-f36d-4165-ab4f-914345785e79",
            localizedDescription: {
                i18nAssetId: "e2755ea1-1cf5-4e96-8ab9-c2c875e63e87",
                stringId: "cSolutionDiagnosticsAgentDescription"
            },
            localizedName: {
                i18nAssetId: "e2755ea1-1cf5-4e96-8ab9-c2c875e63e87",
                stringId: "cSolutionDiagnosticsAgentName"
            },
            name: "Acme Agent"
        }
        service.getSolutionDiagnosticsAgent.mockReturnValue(agent);

        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
            currentAccessToken: "fakestuff"
        };

        var { getByTestId, getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <SolutionDiagnosticsAgent service={service} agentId={"b7f74d8a-f36d-4165-ab4f-914345785e79"} />
            </DeviceContext.Provider>
        );

        const agentCard = getByTestId("solution-diagnostics-agent-card");
        expect(agentCard).toBeInTheDocument();
        expect(service.getSolutionDiagnosticsAgent.mock.calls.length).toBe(1);
        expect(getByText('Loading resource...')).toBeInTheDocument();

        const loadrefresh = getByTestId("solution-diagnostics-agent-loadrefresh");
        expect(loadrefresh).toBeInTheDocument();
        fireEvent.click(loadrefresh);

        const showapiresponse = getByTestId("solution-diagnostics-agent-showapiresponse");
        expect(showapiresponse).toBeInTheDocument();
        fireEvent.click(showapiresponse);
    });

    test("Solution Diagnostics Agent Details", () => {
        const agent = {
            resourceId: "b7f74d8a-f36d-4165-ab4f-914345785e79",
            solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
            agentId: "b7f74d8a-f36d-4165-ab4f-914345785e79",
            localizedDescription: {
                i18nAssetId: "e2755ea1-1cf5-4e96-8ab9-c2c875e63e87",
                stringId: "cSolutionDiagnosticsAgentDescription"
            },
            localizedName: {
                i18nAssetId: "e2755ea1-1cf5-4e96-8ab9-c2c875e63e87",
                stringId: "cSolutionDiagnosticsAgentName"
            },
            name: "Acme Agent"
        }

        var { getByTestId } = render(
            <SolutionDiagnosticsAgentDetails solutionDiagnosticsAgent={agent} />
        );

        const agentDetails = getByTestId("solution-diagnostics-agentdetails-list");
        expect(agentDetails).toBeInTheDocument();   
    });

    test("Solution Diagnostics Agent Log", () => {
        const log = {
            "data": "<solutionDiagnosticsLog>"
        }

        service.getSolutionDiagnosticsAgentLog.mockReturnValue(log);

        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
            currentAccessToken: "fakestuff"
        };

        var { getByTestId, getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <SolutionDiagnosticsAgentLog service={service} agentId={"b7f74d8a-f36d-4165-ab4f-914345785e79"} />
            </DeviceContext.Provider>
        );

        const loadrefresh = getByTestId("solution-diagnostics-agent-log-loadrefresh");
        expect(loadrefresh).toBeInTheDocument();
        fireEvent.click(loadrefresh);

        const logExport = getByTestId("solution-diagnostics-log-export-button");
        expect(logExport).toBeInTheDocument();
        fireEvent.click(loadrefresh);
    });
});
