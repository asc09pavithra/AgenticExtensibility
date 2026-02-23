import { render, fireEvent } from "@testing-library/react";
import UsbAccessoriesTabs from "../views/usbAccessories/UsbAccessoriesView";
import { UsbAccessoriesTabContent } from "../views/usbAccessories/UsbAccessories";
import { UsbAccessory, UsbAccessoryDetails } from "../views/usbAccessories/UsbAccessory";
import { DeviceContext } from "../common/DeviceContext";
import userEvent from "@testing-library/user-event";

describe("USB Accessories", () => {
    const originalWarn = console.warn.bind(console.warn);
    const originalError = console.error.bind(console.error);
    const service = require('../services/UsbAccessoriesService');
    jest.mock('../services/UsbAccessoriesService', () =>
    ({
        enumerateUsbAgents: jest.fn(),
        getUsbAgent: jest.fn(),
        enumerateUsbAccessories: jest.fn(),
        getUsbAccessory: jest.fn()
    }));

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

    test("USB Accessories Accessories", async () => {

        const accessories = {
            memberIds: ["e3736199-5163-4c47-88d3-572e4e06dd6a"],
            offset: 0,
            selectedCount: 1,
            totalCount: 1
        };
        service.enumerateUsbAccessories.mockReturnValue(accessories);

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
                <UsbAccessoriesTabContent service={service} />
            </DeviceContext.Provider>
        );

        const accessoriesCard = getByTestId("usb-accessories-accessories-card");
        expect(accessoriesCard).toBeInTheDocument();
        expect(service.enumerateUsbAccessories.mock.calls.length).toBe(1);
        expect(getByText('Loading resource...')).toBeInTheDocument();
    });

    test("USB Accessories Accessory", async () => {

        const accessory = {
            accessoryID: "57ea40b6-aee4-432a-8fd8-e18e11ad7239",
            activeConfiguration: 123,
            deviceClass: 456,
            deviceProtocol: 789,
            deviceSubclass: 123,
            deviceVersion: 456,
            languagesSupported: [
                0,
                65535
            ],
            manufacturerName: "HP Inc",
            productId: 456,
            productName: "Card Reader",
            registration: "rkShared",
            resourceId: "57ea40b6-aee4-432a-8fd8-e18e11ad7239",
            serialNumber: "7Jkd5198s9",
            usbVersion: 1,
            vendorId: 123
        };

        const accessories = {
            memberIds: ["e3736199-5163-4c47-88d3-572e4e06dd6a"],
            members: [accessory],
            offset: 0,
            selectedCount: 1,
            totalCount: 1
        };
        service.getUsbAccessory.mockReturnValue(accessory);

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
                <UsbAccessory service={service} accessoryId={"e3736199-5163-4c47-88d3-572e4e06dd6a"} />
            </DeviceContext.Provider>
        );

        const accessoryCard = getByTestId("usb-accessories-accessory-card");
        expect(accessoryCard).toBeInTheDocument();
        expect(service.getUsbAccessory.mock.calls.length).toBe(1);
        expect(getByText('Loading resource...')).toBeInTheDocument();
    });

    test("USB Accessories Accessory Details", async () => {
        const accessory = {
            accessoryID: "57ea40b6-aee4-432a-8fd8-e18e11ad7239",
            activeConfiguration: 123,
            deviceClass: 456,
            deviceProtocol: 789,
            deviceSubclass: 123,
            deviceVersion: 456,
            languagesSupported: [
                0,
                65535
            ],
            manufacturerName: "HP Inc",
            productId: 123456,
            productName: "Card Reader",
            registration: "rkShared",
            resourceId: "57ea40b6-aee4-432a-8fd8-e18e11ad7239",
            serialNumber: "7Jkd5198s9",
            usbVersion: 1,
            vendorId: 123
        };

        const user = userEvent.setup();

        var { getByTestId, getByText } = render(
            <UsbAccessoryDetails usbAccessory={accessory} />
        );

        const accessoryDetails = getByTestId("usb-accessories-accessorydetails-list");
        expect(accessoryDetails).toBeInTheDocument();

        const product = getByText("123456");
        expect(product).toBeInTheDocument();
        await user.click(product);
    });
});

