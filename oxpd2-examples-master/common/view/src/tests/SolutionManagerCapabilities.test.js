import { render, fireEvent } from '@testing-library/react'
import SolutionManagementTabs from "../views/solutionManagement/SolutionManagementView";
import { DeviceContext } from "../common/DeviceContext";

jest.mock("../views/solutionManagement/Capabilities", () => ({
    SolutionManagerCapabilities: function MockedSolutionManagerCapabilities() {
        return (
            <div>
                <div>Loading resource...</div>
                <div>Solution Manager Service Capabilities</div>
                <button data-testid="smc-load-refresh">Load/Refresh</button>
                <button data-testid="smc-show-api-response">Show API Response</button>
            </div>
        );
    }
}));

jest.mock("../views/solutionManagement/Installer", () => {
    return function MockedInstaller() {
        return <div data-testid="mocked-installer">Mocked Installer</div>;
    };
});

jest.mock("../views/solutionManagement/Solutions", () => ({
    SolutionTabContent: function MockedSolutionTabContent() {
        return <div data-testid="mocked-solutions">Mocked Solutions</div>;
    }
}));

jest.mock("../views/solutionManagement/SolutionAgent", () => ({
    SolutionAgentContent: function MockedSolutionAgentContent() {
        return <div data-testid="mocked-solution-agent">Mocked Solution Agent</div>;
    }
}));

describe('Solution Capabilities', () => {

    const originalWarn = console.warn.bind(console.warn)
    const originalError = console.error.bind(console.error)
    beforeAll(() => {
        // Ignoring this specific console warning
        console.warn = (msg) =>
            !msg.toString().includes('use a basename on a page whose URL path does not begin with the basename') && originalWarn(msg)
        // Ignoring this specific console error
        console.error = (msg) =>
            !msg.toString().includes('The prop `to` is marked as required in `Link`, but its value is `undefined`.')
    })
    afterAll(() => {
        console.warn = originalWarn
        console.error = originalError
    })

    test('Solution Manager Capabilities', () => {
        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
        };

        var { getByTestId, getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <SolutionManagementTabs />
            </DeviceContext.Provider>
        );

        const capabilitiesTab = getByTestId("solution-management-capabilities-tab");
        expect(capabilitiesTab).toBeInTheDocument();
        fireEvent.click(capabilitiesTab);

        const expectedTitle = 'Loading resource...'
        const expectedDesc = 'Solution Manager Service Capabilities'
        expect(getByText(expectedTitle)).toBeInTheDocument()
        expect(getByText(expectedDesc)).toBeInTheDocument()

        const loadRefreshButton = getByTestId('smc-load-refresh')
        expect(loadRefreshButton).toBeInTheDocument()
        fireEvent.click(loadRefreshButton)

        const apiResponseButton = getByTestId("smc-show-api-response")
        expect(apiResponseButton).toBeInTheDocument()
        fireEvent.click(apiResponseButton)
    });
});
