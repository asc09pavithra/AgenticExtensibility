import { render, within, fireEvent } from "@testing-library/react";
import UsbAccessoriesTabs from "../views/usbAccessories/UsbAccessoriesView";
import UsbAccessoriesView from "../views/usbAccessories/UsbAccessoriesView";
import { DeviceContext } from "../common/DeviceContext";

jest.mock("../common/Capabilities", () => {
    return function MockedCapabilities() {
        return <div data-testid="mocked-capabilities">Mocked Capabilities</div>;
    };
});

jest.mock("../views/usbAccessories/UsbAgents", () => ({
    UsbAgentsTabContent: function MockedUsbAgentsTabContent() {
        return <div data-testid="mocked-usb-agents">Mocked USB Agents</div>;
    }
}));

jest.mock("../views/usbAccessories/UsbAccessories", () => ({
    UsbAccessoriesTabContent: function MockedUsbAccessoriesTabContent() {
        return <div data-testid="mocked-usb-accessories">Mocked USB Accessories</div>;
    }
}));

jest.mock("../views/usbAccessories/UsbAccessoriesAgentLog", () => ({
    UsbAccessoriesLogContent: function MockedUsbAccessoriesLogContent() {
        return <div data-testid="mocked-usb-accessories-log">Mocked USB Accessories Log</div>;
    }
}));

describe("USB Accessories View", () => {
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

    test("USB Accessories View", () => {
        // render sidebar and click USB Accessories button
        var { getByTestId } = render(<UsbAccessoriesView />);

        const { getByText } = within(getByTestId("usb-accessories-view"));
        const expectedTitle = "USB Accessories Service";
        const expectedDesc = "Example interaction with the OXPd2 USB Accessories Service";
        expect(getByText(expectedTitle)).toBeInTheDocument();
        expect(getByText(expectedDesc)).toBeInTheDocument();
    });

    test("USB Accessories Tabs", () => {
        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
        };

        var { getByTestId, getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <UsbAccessoriesTabs />
            </DeviceContext.Provider>
        );

        const capabilitiesTab = getByTestId("usb-accessories-capabilities-tab");
        expect(capabilitiesTab).toBeInTheDocument();
        fireEvent.click(capabilitiesTab);

        const agentsTab = getByTestId("usb-accessories-agents-tab");
        expect(agentsTab).toBeInTheDocument();
        fireEvent.click(agentsTab);

        const accessoriesTab = getByTestId("usb-accessories-tab");
        expect(accessoriesTab).toBeInTheDocument();
        fireEvent.click(accessoriesTab);
    });
});
