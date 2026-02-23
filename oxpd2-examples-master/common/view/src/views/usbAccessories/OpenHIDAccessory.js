import { Card, CardActions, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Fragment, useContext, useState } from 'react';
import ApiResponseButton from '../../common/ApiResponseButton';
import ApiResponseDialog from '../../common/ApiResponseDialog';
import { DeviceContext } from '../../common/DeviceContext';
import { PropertyItemWithDivider } from '../../common/ResponseTypes';
import ModifyDialog from './OpenHIDAccessoryModifyDialog';
import ReadReportDialog from './OpenHIDAccessoryReadReportDialog';
import WriteReportDialog from './OpenHIDAccessoryWriteReportDialog';
import SDKButton from '../../common/SDKButton';

function OpenHIDAccessory(props) {
    const deviceContext = useContext(DeviceContext);
    const usbAccessoryService = props.service;
    const accessoryId = props.accessoryId;
    const [openHIDAccessory, setOpenHidAccessory] = useState(props.openHIDAccessory);
    const openHIDAccessoryId = props.openHIDAccessory.openHIDAccessoryID;
    const isOwned = props.isOwned;

    const [state, setState] = useState({
        modificationResponse: null,
        deleteResponse: null,
        readReportResponse: null,
        writeReportResponse: null,
        showApiResponse: false,
        showModifyDialog: false,
        showReadReportDialog: false,
        showWriteReportDialog: false,
        showDeleteConfirmDialog: false,
        modifyDialogKey: 0
    });

    async function handleLoadClicked() {
        loadOpenHidAccessory();
    }

    async function toggleShowApiResponseDialog() {
        setState({ ...state, showApiResponse: !state.showApiResponse });
    }

    async function toggleShowModificationDialog() {
        setState({ 
            ...state, 
            showModifyDialog: !state.showModifyDialog,
            modifyDialogKey: !state.showModifyDialog ? state.modifyDialogKey + 1 : state.modifyDialogKey // modifyDialogKey forces the modify dialog to re render when reopened
        });
    }

    async function toggleShowDeleteConfirmDialog() {
        setState({ ...state, showDeleteConfirmDialog: !state.showDeleteConfirmDialog });
    }

    async function toggleShowReadReportDialog() {
        setState({ ...state, showReadReportDialog: !state.showReadReportDialog });
    }

    async function toggleShowWriteReportDialog() {
        setState({ ...state, showWriteReportDialog: !state.showWriteReportDialog });
    }

    async function loadOpenHidAccessory() {
        let response;
        try {
            response = await usbAccessoryService.getOpenHIDAccessory(accessoryId, openHIDAccessoryId, isOwned);
            console.log("getOpenHIDAccessory - " + JSON.stringify(response));

            if (null !== response) {
                setOpenHidAccessory(response);
            }
        }
        catch (error) {
            props.postAlert('error', 'Unable to get the HID accessory  - ' + error.cause.message);
        }
    }

    async function sendModificationRequest(modify_request) {
        let response;
        try {
            response = await usbAccessoryService.modifyOpenHIDAccessory(accessoryId, openHIDAccessoryId, modify_request, isOwned);
            console.log("Response ===> " + JSON.stringify(response));

            if (null !== response) {
                setState({ ...state, modificationResponse: response });
                openHIDAccessory.reportReadingActive = response.reportReadingActive;
            }
            props.postAlert('success', 'Open HID accessory modify request successful');
        }
        catch (error) {
            props.postAlert('error', 'Unable to modify open HID Accessory - ' + error.cause.message);
        }
        setState({ ...state, showModifyDialog: false });
    }

    async function SendDeleteRequest() {
        let response;
        try {
            response = await usbAccessoryService.deleteOpenHIDAccessory(accessoryId, openHIDAccessoryId, isOwned);
            console.log("Response ===> " + JSON.stringify(response));

            if (null !== response) {
                deviceContext.HIDAccessories.set(accessoryId, null);
                setState({ ...state, deleteResponse: response });
            }
            props.postAlert('success', 'Open HID accessory delete request successful');
        }
        catch (error) {
            props.postAlert('error', 'Unable to delete open HID Accessory - ' + error.cause.message);
        }
        setState({ ...state, showDeleteConfirmDialog: false });
    }

    async function sendReadReportRequest(async, length, reportId, reportType) {
        let response;
        try {
            response = await usbAccessoryService.readReportOpenHIDAccessory(accessoryId, openHIDAccessoryId, { async, length, reportId, reportType }, isOwned);
            console.log("Response ===> " + JSON.stringify(response));

            if (null !== response) {
                setState({ ...state, readReportResponse: response });
            }
            props.postAlert('success', 'Open HID accessory read report request successful');
            return response;
        }
        catch (error) {
            props.postAlert('error', 'Unable to read report request for open HID Accessory - ' + error.cause.message);
        }
    }

    async function sendWriteReportRequest(async, data, reportId, reportType) {
        let response;
        try {
            response = await usbAccessoryService.writeReportOpenHIDAccessory(accessoryId, openHIDAccessoryId, { async, data, reportId, reportType }, isOwned);
            console.log("Response ===> " + JSON.stringify(response));

            if (null !== response) {
                setState({ ...state, writeReportResponse: response });
            }
            props.postAlert('success', 'Open HID accessory write report request successful');
            return response;
        }
        catch (error) {
            props.postAlert('error', 'Unable to read report request for open HID Accessory - ' + error.cause.message);
        }
    }

    return (
        <Fragment>
            <Card>
                <CardContent>
                    <PropertyItemWithDivider primary="featureReportLength" secondary={openHIDAccessory.featureReportLength + "" || ""} />
                    <PropertyItemWithDivider primary="hardwareCountryCode" secondary={openHIDAccessory.hardwareCountryCode + "" || ""} />
                    <PropertyItemWithDivider primary="inputReportLength" secondary={openHIDAccessory.inputReportLength + "" || ""} />
                    <PropertyItemWithDivider primary="openHIDAccessoryID" secondary={openHIDAccessory.openHIDAccessoryID || ""} />
                    <PropertyItemWithDivider primary="outputReportLength" secondary={openHIDAccessory.outputReportLength + "" || ""} />
                    <PropertyItemWithDivider primary="reportReadingActive" secondary={openHIDAccessory.reportReadingActive ? "true" : "false"} />
                    <PropertyItemWithDivider primary="resourceId" secondary={openHIDAccessory.resourceId || ""} />
                    <ApiResponseDialog title="Open HID Usb Accessory API Response" open={state.showApiResponse} apiResponse={openHIDAccessory} handleClose={toggleShowApiResponseDialog} />
                    <ModifyDialog key={state.modifyDialogKey} onSubmit={sendModificationRequest} onClose={toggleShowModificationDialog} open={state.showModifyDialog} reportReadingActive={openHIDAccessory.reportReadingActive} />
                    <ReadReportDialog featureLength={openHIDAccessory.featureReportLength} accessoryID={accessoryId} openHIDAccessoryID={openHIDAccessoryId} usbAccessoryService={usbAccessoryService} onSubmit={sendReadReportRequest} onClose={toggleShowReadReportDialog} open={state.showReadReportDialog} isOwned={props.isOwned} />
                    <WriteReportDialog onSubmit={sendWriteReportRequest} onClose={toggleShowWriteReportDialog} open={state.showWriteReportDialog} />
                    <DeleteConfirmDialog onSubmit={SendDeleteRequest} onClose={toggleShowDeleteConfirmDialog} open={state.showDeleteConfirmDialog} openHIDAccessoryID={openHIDAccessoryId} />
                </CardContent>
                <CardActions>
                    <ApiResponseButton data-testid="accessoryHid-showapiresponse-button" onClick={toggleShowApiResponseDialog} deviceContext={deviceContext} disabled={state.currentOpenHIDAccessory === null} />
                    <SDKButton
                        disabled={state.currentOpenHIDAccessory === null}
                        buttonlabel="Refresh"
                        primaryToolTip="Refresh Open HID Accessory"
                        secondaryToolTip="No Open HID Accessory"
                        secondaryToolTipCondition={state.currentOpenHIDAccessory !== null}
                        onClick={handleLoadClicked}
                    />
                    <SDKButton
                        disabled={state.currentOpenHIDAccessory === null}
                        buttonlabel="Modify"
                        primaryToolTip="Modify Open HID Accessory"
                        secondaryToolTip="No Open HID Accessory"
                        secondaryToolTipCondition={state.currentOpenHIDAccessory !== null}
                        onClick={toggleShowModificationDialog}
                    />
                    <SDKButton
                        disabled={state.currentOpenHIDAccessory === null}
                        buttonlabel="Read Report"
                        primaryToolTip="Read Report For Open HID Accessory"
                        secondaryToolTip="No Open HID Accessory"
                        secondaryToolTipCondition={state.currentOpenHIDAccessory !== null}
                        onClick={toggleShowReadReportDialog}
                    />
                    <SDKButton
                        disabled={state.currentOpenHIDAccessory === null}
                        buttonlabel="Write Report"
                        primaryToolTip="Write Report For Open HID Accessory"
                        secondaryToolTip="No Open HID Accessory"
                        secondaryToolTipCondition={state.currentOpenHIDAccessory !== null}
                        onClick={toggleShowWriteReportDialog}
                    />
                    <SDKButton
                        disabled={state.currentOpenHIDAccessory === null}
                        buttonlabel="Delete"
                        primaryToolTip="Delete Open HID Accessory"
                        secondaryToolTip="No Open HID Accessory"
                        secondaryToolTipCondition={state.currentOpenHIDAccessory !== null}
                        onClick={toggleShowDeleteConfirmDialog}
                    />
                </CardActions>
            </Card>
        </Fragment>
    );
}

function DeleteConfirmDialog(props) {
    return (
        <Dialog fullWidth maxWidth="sm" open={props.open} onClose={props.onClose} >
            <DialogTitle>Confirm DELETE Open HID Accessory</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete (close) the accessory with ID[{props.openHIDAccessoryID}]?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <SDKButton
                    disabled={false}
                    buttonlabel="Cancel"
                    primaryToolTip="Don't Delete HID Accessory"
                    secondaryToolTip="No Open HID Accessory"
                    secondaryToolTipCondition={true}
                    onClick={props.onClose}
                />
                <SDKButton
                    disabled={false}
                    buttonlabel="Confirm"
                    primaryToolTip="Delete HID Accessory"
                    secondaryToolTip="No Open HID Accessory"
                    secondaryToolTipCondition={true}
                    onClick={props.onSubmit}
                />
            </DialogActions>
        </Dialog>
    );
}

export {
    OpenHIDAccessory
};

