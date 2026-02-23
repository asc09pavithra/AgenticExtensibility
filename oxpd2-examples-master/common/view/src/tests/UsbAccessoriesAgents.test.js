import { render, fireEvent } from "@testing-library/react";
import UsbAccessoriesTabs from "../views/usbAccessories/UsbAccessoriesView";
import { UsbAgentsTabContent } from "../views/usbAccessories/UsbAgents";
import { UsbAgent, UsbAgentDetails } from "../views/usbAccessories/UsbAgent";
import { DeviceContext } from "../common/DeviceContext";
import userEvent from "@testing-library/user-event";

describe("USB Accessories Agents", () => {
    const originalWarn = console.warn.bind(console.warn);
    const originalError = console.error.bind(console.error);
    const service = require('../services/UsbAccessoriesService')
    jest.mock('../services/UsbAccessoriesService', () => ({ enumerateUsbAgents: jest.fn(), getUsbAgent: jest.fn() }))

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

    test("USB Accessories Agents", async () => {

        const agents = {
            memberIds: ["e3736199-5163-4c47-88d3-572e4e06dd6a"],
            offset: 0,
            selectedCount: 1,
            totalCount: 1
        };
        service.enumerateUsbAgents.mockReturnValue(agents);

        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
            currentAccessToken: "fakestuff"
        };

        const user = userEvent.setup();

        var { getByTestId, getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <UsbAgentsTabContent service={service} />
            </DeviceContext.Provider>
        );

        const agentsCard = getByTestId("usb-accessories-agents-card");
        expect(agentsCard).toBeInTheDocument();
        expect(service.enumerateUsbAgents.mock.calls.length).toBe(1);
        expect(getByText('Loading resource...')).toBeInTheDocument();
    });

    test("USB Accessories Agent", async () => {
        const agents = {
            memberIds: ["e3736199-5163-4c47-88d3-572e4e06dd6a"],
            offset: 0,
            selectedCount: 1,
            totalCount: 1
        };
        const agent = {
            registrations: [
                {
                    productId: 12345,
                    registrationKind: "rkShared",
                    serialNumber: "SN02848893984",
                    vendorId: 4562
                },
                {
                    productId: 23456,
                    registrationKind: "rkShared",
                    serialNumber: "SN028465153984",
                    vendorId: 515
                }
            ],
            resourceId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
            solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
            agentId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
            localizedDescription: {
                i18nAssetId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                stringId: "cUsbAccessoryDescription"
            },
            localizedName: {
                i18nAssetId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                stringId: "cUsbAccessoryName"
            },
            name: "Acme Agent"
        }
        service.getUsbAgent.mockReturnValue(agent);

        const deviceContext = {
            currentDevice: {
                networkAddress: "http://localhost:5000",
                bindStatus: "bound",
            },
            currentAccessToken: "fakestuff"
        };

        const user = userEvent.setup();

        var { getByTestId, getByText } = render(
            <DeviceContext.Provider value={deviceContext}>
                <UsbAgent service={service} agentId={"e3736199-5163-4c47-88d3-572e4e06dd6a"} />
            </DeviceContext.Provider>
        );

        const agentCard = getByTestId("usb-accessories-agent-card");
        expect(agentCard).toBeInTheDocument();
        expect(service.getUsbAgent.mock.calls.length).toBe(1);
        expect(getByText('Loading resource...')).toBeInTheDocument();

        const loadrefresh = getByTestId("usb-accessories-agent-loadrefresh");
        expect(loadrefresh).toBeInTheDocument();
        fireEvent.click(loadrefresh);

        const showapiresponse = getByTestId("usb-accessories-agent-showapiresponse");
        expect(showapiresponse).toBeInTheDocument();
        fireEvent.click(showapiresponse);
    });

    test("USB Accessories Agent Details", async () => {
        const agent = {
            registrations: [
                {
                    productId: 12345,
                    registrationKind: "rkShared",
                    serialNumber: "SN02848893984",
                    vendorId: 4562
                },
                {
                    productId: 23456,
                    registrationKind: "rkShared",
                    serialNumber: "SN028465153984",
                    vendorId: 515
                }
            ],
            resourceId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
            solutionId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
            agentId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
            localizedDescription: {
                i18nAssetId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                stringId: "cUsbAccessoryDescription"
            },
            localizedName: {
                i18nAssetId: "e3736199-5163-4c47-88d3-572e4e06dd6a",
                stringId: "cUsbAccessoryName"
            },
            name: "Acme Agent"
        }

        const user = userEvent.setup();

        var { getByTestId, getByText } = render(
            <UsbAgentDetails usbAgent={agent} />
        );

        const agentDetails = getByTestId("usb-accessories-agentdetails-list");
        expect(agentDetails).toBeInTheDocument();

        const agentRegistrations = getByTestId("usb-accessories-agentregistrations-list");
        expect(agentRegistrations).toBeInTheDocument();

        const product = getByText("12345");
        expect(product).toBeInTheDocument();
        await user.click(product);        
    });
});

