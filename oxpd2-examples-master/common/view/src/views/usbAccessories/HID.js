import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { Fragment, useContext, useState } from 'react';
import { OpenHIDAccessory } from './OpenHIDAccessory';
import { DeviceContext } from '../../common/DeviceContext';
import OpenHIDAccessoryDialog from './OpenHIDAccessoryDialog';
import SDKButton from '../../common/SDKButton';

function HID(props) {
    const deviceContext = useContext(DeviceContext);
    const usbAccessoryService = props.service;
    const [state, setState] = useState({
        currentUsbAccessory: props.usbAccessory,
        isOwned: props.usbAccessory.registration && props.usbAccessory.registration.toLowerCase() === "rkowned",
        showOpenDialog: false
    });
    const [currentOpenHIDAccessory, setCurrentOpenHIDAccessory] = useState(null);

    async function handleOpenClicked() {
        setState({ ...state, showOpenDialog: true });
    }

    async function openHID(operationContext, reportReadingActive) {
        let response;
        try {
            let requestPayload =
            {
                reportReadingActive: reportReadingActive
            }

            if (operationContext && operationContext.length > 0) {
                requestPayload.operationContext = {
                    explicit: {
                        explicitValue: operationContext
                    }
                };
            }

            response = await usbAccessoryService.openUsbAccessoryHid(state.currentUsbAccessory.accessoryID, state.isOwned, requestPayload);
            console.log("Response ===> " + JSON.stringify(response));

            if (null !== response && response.openHIDAccessory !== null) {
                setCurrentOpenHIDAccessory(response);
                deviceContext.HIDAccessories.set(state.currentUsbAccessory.accessoryID, response.openHIDAccessory.openHIDAccessoryID);
            }
            props.postAlert('success', 'Open USB accessory HID request successful');
        }
        catch (error) {
            props.postAlert('error', 'Unable to open USB accessory HID - ' + error.cause.message);
        }
        setState({ ...state, showOpenDialog: false });
    }

    async function getHidAccessory() {
        let response;

        try {
            if(deviceContext.HIDAccessories.get(state.currentUsbAccessory.accessoryID) !== null) {
                response = await usbAccessoryService.getOpenHIDAccessory(state.currentUsbAccessory.accessoryID, deviceContext.HIDAccessories.get(state.currentUsbAccessory.accessoryID), state.isOwned);
                console.log("Response ===> " + JSON.stringify(response));
                
                if (null !== response) {
                    setCurrentOpenHIDAccessory({ openHIDAccessory: response });
                }

                props.postAlert('success', 'Get USB accessory HID request successful');
            } else {
                props.postAlert('error', 'No Open HID Accessory');
            }  
        } catch (error) {
            props.postAlert('error', 'Unable to open USB accessory HID - ' + error.cause.message);
        }
        setState({ ...state, showOpenDialog: false });
    }

    async function closeOpenHIDDialog() {
        setState({ ...state, showOpenDialog: false });
    }

    function openHIDDisabled() {
        return (state.currentUsbAccessory === null || !state.currentUsbAccessory.registration || currentOpenHIDAccessory !== null);
    }

    function secondaryToolTipCondition() {
        return state.currentUsbAccessory.registration;
    }

    return (
        <Fragment>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">Open HID Accessory</Typography>
                    {
                        currentOpenHIDAccessory !== null ?
                            <OpenHIDAccessory
                                accessoryId={state.currentUsbAccessory.accessoryID}
                                openHIDAccessory={currentOpenHIDAccessory.openHIDAccessory}
                                service={usbAccessoryService}
                                isOwned={state.isOwned}
                                postAlert={props.postAlert} />
                            : ""
                    }
                </CardContent>
                <CardActions>
                    <SDKButton
                        data-testid='accessoryHid-open-button'
                        disabled={openHIDDisabled}
                        onClick={handleOpenClicked}
                        buttonlabel="Open HID"
                        primaryToolTip="Opens the accessory and creates a resource representing the open accessory"
                        secondaryToolTip="USB Accessory does not have a registration"
                        secondaryToolTipCondition={secondaryToolTipCondition}
                    />
                    <SDKButton 
                        disabled={deviceContext.HIDAccessories.get(state.currentUsbAccessory.accessoryID) == null || currentOpenHIDAccessory !== null }
                        onClick={getHidAccessory}
                        buttonlabel="Get Open HID"
                        primaryToolTip="Gets The Current Open HID Device"
                        secondaryToolTip="USB Accessory does not have an open HID device"
                        secondaryToolTipCondition={!(deviceContext.HIDAccessories.get(state.currentUsbAccessory.accessoryID) == null || currentOpenHIDAccessory !== null )}
                    />
                </CardActions>
            </Card>
            <OpenHIDAccessoryDialog title="Open HID" onSubmit={openHID} onClose={closeOpenHIDDialog} open={state.showOpenDialog} />
        </Fragment>
    );
}

export {
    HID
};

