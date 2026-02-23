import { render, within, fireEvent } from "@testing-library/react";
import SolutionManagementTabs from "../views/solutionManagement/SolutionManagementView";
import SolutionManagementView from "../views/solutionManagement/SolutionManagementView";
import { DeviceContext } from "../common/DeviceContext";

// Mock the SolutionManagerCapabilities component to prevent API calls
jest.mock("../views/solutionManagement/Capabilities", () => ({
    SolutionManagerCapabilities: function MockedSolutionManagerCapabilities() {
        return <div data-testid="mocked-solution-manager-capabilities">Mocked Solution Manager Capabilities</div>;
    }
}));

// Mock the Installer component
jest.mock("../views/solutionManagement/Installer", () => {
    return function MockedInstaller() {
        return <div data-testid="mocked-installer">Mocked Installer</div>;
    };
});

// Mock the Solutions tab content
jest.mock("../views/solutionManagement/Solutions", () => ({
    SolutionTabContent: function MockedSolutionTabContent() {
        return <div data-testid="mocked-solutions">Mocked Solutions</div>;
    }
}));

// Mock the SolutionAgent tab content
jest.mock("../views/solutionManagement/SolutionAgent", () => ({
    SolutionAgentContent: function MockedSolutionAgentContent() {
        return <div data-testid="mocked-solution-agent">Mocked Solution Agent</div>;
    }
}));

describe("Solution Management View", () => {
    const originalWarn = console.warn.bind(console.warn);
    const originalError = console.error.bind(console.error);
    beforeAll(() => {
        // Ignoring this specific console warning
        console.warn = (msg) =>
            !msg
                .toString()
                .includes("use a basename on a page whose URL path does not begin with the basename") &&
            originalWarn(msg);
        // Ignoring this specific console error
        console.error = (msg) =>
            !msg
                .toString()
                .includes("The prop `to` is marked as required in `Link`, but its value is `undefined`.");
    });
    afterAll(() => {
        console.warn = originalWarn;
        console.error = originalError;
    });

    test("Solution Management View", () => {
        // render sidebar and click solution management button
        var { getByTestId } = render(<SolutionManagementView />);

        const { getByText } = within(getByTestId("solution-view"));
        const expectedTitle = "Solution Manager Service";
        const expectedDesc = "Example interaction with the OXPd2 Solution Manager Service";
        expect(getByText(expectedTitle)).toBeInTheDocument();
        expect(getByText(expectedDesc)).toBeInTheDocument();
    });

    test("Solution Management Tabs", () => {
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

        const installerTab = getByTestId("solution-management-installer-tab");
        expect(installerTab).toBeInTheDocument();
        fireEvent.click(installerTab);

        const solutionsTab = getByTestId("solution-management-solutions-tab");
        expect(solutionsTab).toBeInTheDocument();
        fireEvent.click(solutionsTab);

        const solutionsAgentTab = getByTestId("solution-management-solutions-agent-tab");
        expect(solutionsAgentTab).toBeInTheDocument();
        fireEvent.click(solutionsAgentTab);
    });
});
